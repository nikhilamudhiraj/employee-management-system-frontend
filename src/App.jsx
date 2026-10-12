import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import NavigationTabs from './components/NavigationTabs';
import DashboardView from './components/DashboardView';
import EmployeeDirectory from './components/EmployeeDirectory';
import DepartmentAnalyticsView from './components/DepartmentAnalyticsView';
import EmployeeModal from './components/EmployeeModal';
import EmployeeDetailModal from './components/EmployeeDetailModal';
import ConfirmModal from './components/ConfirmModal';
import Toast from './components/Toast';
import { 
  getEmployees, 
  getDashboardStats, 
  createEmployee, 
  updateEmployee, 
  deleteEmployee, 
  seedDatabase,
  checkBackendHealth 
} from './services/api';
import { DEPARTMENTS } from './data/mockEmployees';
import { Github, Globe, Server, Database, Heart } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [employees, setEmployees] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [backendStatus, setBackendStatus] = useState('offline'); // 'online' | 'offline'

  // Modals state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedForEdit, setSelectedForEdit] = useState(null);
  const [selectedForView, setSelectedForView] = useState(null);
  const [selectedForDelete, setSelectedForDelete] = useState(null);

  // Toast notification
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((current) => (current?.message === message ? null : current));
    }, 4000);
  };

  // Load employees and stats
  const refreshData = useCallback(async () => {
    try {
      setLoading(true);
      const isHealthy = await checkBackendHealth();
      setBackendStatus(isHealthy ? 'online' : 'offline');

      const [empRes, statsRes] = await Promise.all([
        getEmployees(),
        getDashboardStats()
      ]);

      setEmployees(empRes.data || []);
      setStats(statsRes);
    } catch (err) {
      console.error('Error refreshing data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Handle Add or Edit employee submit
  const handleSaveEmployee = async (formData) => {
    try {
      if (selectedForEdit) {
        const res = await updateEmployee(selectedForEdit.id, formData);
        showToast(`Employee "${formData.firstName} ${formData.lastName}" updated successfully.`);
      } else {
        const res = await createEmployee(formData);
        showToast(`New employee "${formData.firstName} ${formData.lastName}" added to directory.`);
      }
      await refreshData();
      setSelectedForEdit(null);
    } catch (err) {
      showToast(err.message || 'Operation failed', 'error');
      throw err;
    }
  };

  // Handle Delete employee
  const handleConfirmDelete = async () => {
    if (!selectedForDelete) return;
    try {
      await deleteEmployee(selectedForDelete.id);
      showToast(`Employee "${selectedForDelete.firstName} ${selectedForDelete.lastName}" removed.`);
      setSelectedForDelete(null);
      await refreshData();
    } catch (err) {
      showToast(err.message || 'Failed to delete employee', 'error');
    }
  };

  // Handle Seed Demo Data
  const handleSeed = async () => {
    try {
      await seedDatabase();
      await refreshData();
      showToast('Sample employee records loaded successfully.');
    } catch (err) {
      showToast('Failed to seed records', 'error');
    }
  };

  // Export CSV handler
  const handleExportCSV = (listToExport = employees) => {
    if (!listToExport || listToExport.length === 0) {
      showToast('No employee records available to export', 'warning');
      return;
    }

    const headers = [
      'ID',
      'First Name',
      'Last Name',
      'Email',
      'Phone',
      'Department',
      'Designation',
      'Annual Salary',
      'Status',
      'Joining Date',
      'Location'
    ];

    const rows = listToExport.map(emp => [
      emp.id,
      `"${emp.firstName || ''}"`,
      `"${emp.lastName || ''}"`,
      `"${emp.email || ''}"`,
      `"${emp.phone || ''}"`,
      `"${emp.department || ''}"`,
      `"${emp.designation || ''}"`,
      emp.salary || 0,
      `"${emp.status || 'ACTIVE'}"`,
      `"${emp.joiningDate || ''}"`,
      `"${emp.location || ''}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `worknest-employees-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${listToExport.length} employees to CSV.`);
  };

  // Filter department directly from analytics
  const handleFilterByDepartment = (deptName) => {
    setActiveTab('directory');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      
      {/* Top Application Header */}
      <div>
        <Header
          backendStatus={backendStatus}
          onAddEmployee={() => {
            setSelectedForEdit(null);
            setModalOpen(true);
          }}
          onSeedData={handleSeed}
          activeTab={activeTab}
        />

        {/* Navigation Tabs */}
        <NavigationTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          counts={{
            total: employees.length,
            departments: DEPARTMENTS.length
          }}
        />

        {/* Main Workspace View Container */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Banner if backend is on Render free-tier waking up */}
          {backendStatus === 'offline' && (
            <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center space-x-3">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                <div>
                  <p className="text-xs font-bold">Local Demo Mode Active / Render Backend In Standby</p>
                  <p className="text-[11px] text-amber-700 mt-0.5">
                    Free tier instances on Render sleep after 15 minutes of inactivity and take ~30-50 seconds to wake up. All operations work seamlessly with local simulated state!
                  </p>
                </div>
              </div>
              <button
                onClick={refreshData}
                className="px-3 py-1.5 text-xs font-semibold bg-amber-200/80 hover:bg-amber-300 rounded-xl text-amber-900 transition whitespace-nowrap"
              >
                Retry Live API
              </button>
            </div>
          )}

          {/* Active Tab View */}
          {activeTab === 'dashboard' && (
            <DashboardView
              stats={stats}
              employees={employees}
              onAddEmployee={() => {
                setSelectedForEdit(null);
                setModalOpen(true);
              }}
              onViewAll={() => setActiveTab('directory')}
              onExportCSV={() => handleExportCSV(employees)}
              onSelectEmployee={(emp) => setSelectedForView(emp)}
            />
          )}

          {activeTab === 'directory' && (
            <EmployeeDirectory
              employees={employees}
              loading={loading}
              onAddEmployee={() => {
                setSelectedForEdit(null);
                setModalOpen(true);
              }}
              onEditEmployee={(emp) => {
                setSelectedForEdit(emp);
                setModalOpen(true);
              }}
              onDeleteEmployee={(emp) => setSelectedForDelete(emp)}
              onViewEmployee={(emp) => setSelectedForView(emp)}
              onExportCSV={handleExportCSV}
            />
          )}

          {activeTab === 'departments' && (
            <DepartmentAnalyticsView
              employees={employees}
              onFilterByDepartment={handleFilterByDepartment}
            />
          )}

        </main>
      </div>

      {/* Global Modals */}
      <EmployeeModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedForEdit(null);
        }}
        onSubmit={handleSaveEmployee}
        initialData={selectedForEdit}
      />

      <EmployeeDetailModal
        employee={selectedForView}
        isOpen={Boolean(selectedForView)}
        onClose={() => setSelectedForView(null)}
        onEdit={(emp) => {
          setSelectedForView(null);
          setSelectedForEdit(emp);
          setModalOpen(true);
        }}
        onDelete={(emp) => {
          setSelectedForView(null);
          setSelectedForDelete(emp);
        }}
      />

      <ConfirmModal
        isOpen={Boolean(selectedForDelete)}
        onClose={() => setSelectedForDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Remove Employee"
        message={`Are you sure you want to delete ${selectedForDelete?.firstName} ${selectedForDelete?.lastName} (${selectedForDelete?.designation}) from the system?`}
        confirmText="Confirm Delete"
      />

      {/* Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Enterprise Footer */}
      <footer className="mt-12 border-t border-slate-200 bg-white py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-800">WorkNest</span>
            <span>—</span>
            <span>Employee Management System</span>
          </div>

          <div className="flex items-center space-x-6 text-slate-600">
            <span className="flex items-center space-x-1.5">
              <Globe className="w-3.5 h-3.5 text-brand-600" />
              <span>Vercel Frontend</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <Server className="w-3.5 h-3.5 text-indigo-600" />
              <span>Render Backend</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <Database className="w-3.5 h-3.5 text-emerald-600" />
              <span>PostgreSQL</span>
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}
