import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Plus, 
  Eye, 
  Edit3, 
  Trash2, 
  LayoutGrid, 
  Table as TableIcon,
  ArrowUpDown,
  Mail,
  Phone,
  MapPin,
  Calendar,
  X
} from 'lucide-react';
import { DEPARTMENTS } from '../data/mockEmployees';

export default function EmployeeDirectory({
  employees,
  loading,
  onAddEmployee,
  onEditEmployee,
  onDeleteEmployee,
  onViewEmployee,
  onExportCSV
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortBy, setSortBy] = useState('name-asc');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'

  // Filter and sort
  const filteredEmployees = useMemo(() => {
    return employees
      .filter((emp) => {
        const matchesQuery =
          !searchQuery.trim() ||
          emp.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          emp.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          emp.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          emp.designation?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          emp.department?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesDept =
          selectedDepartment === 'All' ||
          emp.department?.toLowerCase() === selectedDepartment.toLowerCase();

        const matchesStatus =
          selectedStatus === 'All' ||
          emp.status?.toUpperCase() === selectedStatus.toUpperCase();

        return matchesQuery && matchesDept && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'name-asc') {
          return (a.firstName + a.lastName).localeCompare(b.firstName + b.lastName);
        }
        if (sortBy === 'name-desc') {
          return (b.firstName + b.lastName).localeCompare(a.firstName + a.lastName);
        }
        if (sortBy === 'salary-high') {
          return (b.salary || 0) - (a.salary || 0);
        }
        if (sortBy === 'salary-low') {
          return (a.salary || 0) - (b.salary || 0);
        }
        if (sortBy === 'date-newest') {
          return new Date(b.joiningDate || 0) - new Date(a.joiningDate || 0);
        }
        if (sortBy === 'date-oldest') {
          return new Date(a.joiningDate || 0) - new Date(b.joiningDate || 0);
        }
        return 0;
      });
  }, [employees, searchQuery, selectedDepartment, selectedStatus, sortBy]);

  const getStatusBadge = (status) => {
    const s = (status || 'ACTIVE').toUpperCase();
    if (s === 'ACTIVE') {
      return (
        <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span>Active</span>
        </span>
      );
    }
    if (s === 'ON_LEAVE') {
      return (
        <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/80">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
          <span>On Leave</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
        <span>Inactive</span>
      </span>
    );
  };

  const getDepartmentColor = (dept) => {
    switch (dept) {
      case 'Engineering':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Product':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Marketing':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Human Resources':
        return 'bg-pink-50 text-pink-700 border-pink-200';
      case 'Finance':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-5">

      {/* Control Bar: Search, Filters & Actions */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm space-y-4">
        
        {/* Top row: Search input + View toggle + Export + Add */}
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          
          {/* Live Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, role, email, or department..."
              className="w-full pl-10 pr-9 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            
            {/* View Mode Switcher (Table vs Grid) */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80">
              <button
                onClick={() => setViewMode('table')}
                title="Table view"
                className={`p-1.5 rounded-lg text-xs font-medium transition ${
                  viewMode === 'table'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <TableIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                title="Grid card view"
                className={`p-1.5 rounded-lg text-xs font-medium transition ${
                  viewMode === 'grid'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 font-medium text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              >
                <option value="name-asc">Sort: Name (A to Z)</option>
                <option value="name-desc">Sort: Name (Z to A)</option>
                <option value="salary-high">Sort: Salary (High to Low)</option>
                <option value="salary-low">Sort: Salary (Low to High)</option>
                <option value="date-newest">Sort: Joining (Newest)</option>
                <option value="date-oldest">Sort: Joining (Oldest)</option>
              </select>
            </div>

            {/* Export CSV Button */}
            <button
              onClick={() => onExportCSV(filteredEmployees)}
              className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 rounded-xl transition"
              title="Download CSV spreadsheet"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>

            {/* Add Employee Button */}
            <button
              onClick={onAddEmployee}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-xs transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Employee</span>
            </button>

          </div>
        </div>

        {/* Second row: Department pills & Status Filter */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 pt-3 border-t border-slate-100">
          
          {/* Department Pills */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 max-w-full">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-1 hidden sm:inline">
              Dept:
            </span>
            <button
              onClick={() => setSelectedDepartment('All')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition whitespace-nowrap ${
                selectedDepartment === 'All'
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Departments
            </button>
            {DEPARTMENTS.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDepartment(dept)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition whitespace-nowrap ${
                  selectedDepartment === dept
                    ? 'bg-brand-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>

          {/* Status selector & Results count */}
          <div className="flex items-center space-x-3 text-xs w-full lg:w-auto justify-between lg:justify-end">
            <div className="flex items-center space-x-1.5">
              <span className="text-slate-400 font-medium">Status:</span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg py-1 px-2 font-medium text-slate-700 focus:outline-none"
              >
                <option value="All">All Statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="ON_LEAVE">On Leave</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>

            <span className="text-slate-500 font-medium bg-slate-100 px-2.5 py-1 rounded-lg">
              Showing <strong className="text-slate-800">{filteredEmployees.length}</strong> of {employees.length}
            </span>
          </div>

        </div>

      </div>

      {/* Main Content: Table or Grid */}
      {filteredEmployees.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-sm">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No employees match your search</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search keywords, clear department pills, or reset the status filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedDepartment('All');
              setSelectedStatus('All');
            }}
            className="mt-4 px-4 py-2 text-xs font-semibold text-brand-600 bg-brand-50 hover:bg-brand-100 rounded-xl transition"
          >
            Clear All Filters
          </button>
        </div>
      ) : viewMode === 'table' ? (
        
        /* Table View */
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-4">Employee</th>
                  <th className="py-3.5 px-4">Department &amp; Role</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Salary</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Joined</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredEmployees.map((emp) => (
                  <tr
                    key={emp.id}
                    className="hover:bg-slate-50/70 transition group"
                  >
                    
                    {/* Employee avatar & name */}
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={emp.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(emp.firstName + ' ' + emp.lastName)}&background=random`}
                          alt={emp.firstName}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200 flex-shrink-0"
                        />
                        <div>
                          <p 
                            onClick={() => onViewEmployee(emp)}
                            className="font-semibold text-slate-900 group-hover:text-brand-600 cursor-pointer transition leading-snug"
                          >
                            {emp.firstName} {emp.lastName}
                          </p>
                          <p className="text-xs text-slate-500 flex items-center space-x-1 mt-0.5">
                            <Mail className="w-3 h-3 text-slate-400" />
                            <span>{emp.email}</span>
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Department & Role */}
                    <td className="py-3 px-4">
                      <div>
                        <span className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-md border ${getDepartmentColor(emp.department)}`}>
                          {emp.department}
                        </span>
                        <p className="text-xs text-slate-600 font-medium mt-1">{emp.designation}</p>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      {getStatusBadge(emp.status)}
                    </td>

                    {/* Salary */}
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-800 text-xs">
                        ${emp.salary?.toLocaleString() || '0'}
                      </span>
                      <span className="text-[10px] text-slate-400 block">/ year</span>
                    </td>

                    {/* Location */}
                    <td className="py-3 px-4 text-xs text-slate-600">
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{emp.location || 'Remote'}</span>
                      </span>
                    </td>

                    {/* Joined Date */}
                    <td className="py-3 px-4 text-xs text-slate-500">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{emp.joiningDate || 'N/A'}</span>
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center space-x-1">
                        <button
                          onClick={() => onViewEmployee(emp)}
                          className="p-1.5 text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition"
                          title="View profile dossier"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onEditEmployee(emp)}
                          className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                          title="Edit employee record"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteEmployee(emp)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title="Delete employee"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      ) : (

        /* Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredEmployees.map((emp) => (
            <div
              key={emp.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <img
                    src={emp.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(emp.firstName + ' ' + emp.lastName)}&background=random`}
                    alt={emp.firstName}
                    className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-xs"
                  />
                  {getStatusBadge(emp.status)}
                </div>

                <div className="mt-4">
                  <h4 
                    onClick={() => onViewEmployee(emp)}
                    className="text-base font-bold text-slate-900 hover:text-brand-600 cursor-pointer transition"
                  >
                    {emp.firstName} {emp.lastName}
                  </h4>
                  <p className="text-xs font-medium text-slate-500 mt-0.5">{emp.designation}</p>
                </div>

                <div className="mt-3 flex items-center space-x-2">
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${getDepartmentColor(emp.department)}`}>
                    {emp.department}
                  </span>
                  <span className="text-xs font-bold text-slate-800">
                    ${emp.salary?.toLocaleString()}/yr
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-500">
                  <p className="flex items-center space-x-2 truncate">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{emp.email}</span>
                  </p>
                  <p className="flex items-center space-x-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{emp.location || 'Remote'}</span>
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => onViewEmployee(emp)}
                  className="text-xs font-semibold text-brand-600 hover:text-brand-700"
                >
                  View Details
                </button>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => onEditEmployee(emp)}
                    className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                    title="Edit"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteEmployee(emp)}
                    className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

      )}

    </div>
  );
}
