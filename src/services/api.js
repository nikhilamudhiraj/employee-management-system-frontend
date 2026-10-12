import { INITIAL_EMPLOYEES } from '../data/mockEmployees';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://employee-management-system-backend-8jgf.onrender.com/api';

// In-memory fallback state in case backend is offline or starting up
let fallbackEmployees = [...INITIAL_EMPLOYEES];

export const checkBackendHealth = async () => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(`${BASE_URL}/health`, { signal: controller.signal });
    clearTimeout(timeoutId);
    return res.ok;
  } catch (err) {
    return false;
  }
};

export const getEmployees = async (filters = {}) => {
  const { query = '', department = '', status = '' } = filters;
  const params = new URLSearchParams();
  if (query) params.append('query', query);
  if (department && department !== 'All') params.append('department', department);
  if (status && status !== 'All') params.append('status', status);

  try {
    const res = await fetch(`${BASE_URL}/employees?${params.toString()}`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    return { data, isFallback: false };
  } catch (err) {
    // Client-side fallback filter
    let filtered = [...fallbackEmployees];
    if (query) {
      const q = query.toLowerCase();
      filtered = filtered.filter(
        e =>
          e.firstName.toLowerCase().includes(q) ||
          e.lastName.toLowerCase().includes(q) ||
          e.email.toLowerCase().includes(q) ||
          e.designation.toLowerCase().includes(q) ||
          e.department.toLowerCase().includes(q)
      );
    }
    if (department && department !== 'All') {
      filtered = filtered.filter(e => e.department.toLowerCase() === department.toLowerCase());
    }
    if (status && status !== 'All') {
      filtered = filtered.filter(e => e.status.toLowerCase() === status.toLowerCase());
    }
    return { data: filtered, isFallback: true };
  }
};

export const getEmployeeById = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/employees/${id}`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    return fallbackEmployees.find(e => e.id === Number(id)) || null;
  }
};

export const createEmployee = async (employeeData) => {
  try {
    const res = await fetch(`${BASE_URL}/employees`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(employeeData),
    });
    if (!res.ok) {
      const errorJson = await res.json().catch(() => ({}));
      throw new Error(errorJson.error || `Failed to create employee (Status ${res.status})`);
    }
    const created = await res.json();
    fallbackEmployees = [created, ...fallbackEmployees];
    return { data: created, isFallback: false };
  } catch (err) {
    // If backend isn't accessible, perform local simulation
    const newRecord = {
      ...employeeData,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    fallbackEmployees = [newRecord, ...fallbackEmployees];
    return { data: newRecord, isFallback: true, warning: err.message };
  }
};

export const updateEmployee = async (id, employeeData) => {
  try {
    const res = await fetch(`${BASE_URL}/employees/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(employeeData),
    });
    if (!res.ok) {
      const errorJson = await res.json().catch(() => ({}));
      throw new Error(errorJson.error || `Failed to update employee (Status ${res.status})`);
    }
    const updated = await res.json();
    fallbackEmployees = fallbackEmployees.map(e => (e.id === Number(id) ? updated : e));
    return { data: updated, isFallback: false };
  } catch (err) {
    const updated = { ...employeeData, id: Number(id), updatedAt: new Date().toISOString() };
    fallbackEmployees = fallbackEmployees.map(e => (e.id === Number(id) ? updated : e));
    return { data: updated, isFallback: true, warning: err.message };
  }
};

export const deleteEmployee = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/employees/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const errorJson = await res.json().catch(() => ({}));
      throw new Error(errorJson.error || `Failed to delete employee`);
    }
    fallbackEmployees = fallbackEmployees.filter(e => e.id !== Number(id));
    return { success: true, isFallback: false };
  } catch (err) {
    fallbackEmployees = fallbackEmployees.filter(e => e.id !== Number(id));
    return { success: true, isFallback: true };
  }
};

export const getDashboardStats = async () => {
  try {
    const res = await fetch(`${BASE_URL}/employees/stats`);
    if (!res.ok) throw new Error('Stats endpoint failed');
    return await res.json();
  } catch (err) {
    // Compute stats from local fallback
    const totalEmployees = fallbackEmployees.length;
    const activeEmployees = fallbackEmployees.filter(e => e.status === 'ACTIVE').length;
    const onLeaveEmployees = fallbackEmployees.filter(e => e.status === 'ON_LEAVE').length;
    const totalPayroll = fallbackEmployees.reduce((sum, e) => sum + (e.salary || 0), 0);
    const averageSalary = totalEmployees > 0 ? totalPayroll / totalEmployees : 0;

    const deptMap = {};
    fallbackEmployees.forEach(e => {
      deptMap[e.department] = (deptMap[e.department] || 0) + 1;
    });
    const departmentBreakdown = Object.entries(deptMap).map(([department, count]) => ({
      department,
      count
    }));

    return {
      totalEmployees,
      activeEmployees,
      onLeaveEmployees,
      totalPayroll,
      averageSalary,
      departmentBreakdown
    };
  }
};

export const seedDatabase = async () => {
  try {
    const res = await fetch(`${BASE_URL}/employees/seed`, { method: 'POST' });
    if (!res.ok) throw new Error('Seeding failed');
    return await res.json();
  } catch (err) {
    fallbackEmployees = [...INITIAL_EMPLOYEES];
    return { success: true, count: INITIAL_EMPLOYEES.length, isFallback: true };
  }
};
