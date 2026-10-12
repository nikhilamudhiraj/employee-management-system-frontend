import React from 'react';
import { 
  Building2, 
  Users, 
  DollarSign, 
  TrendingUp, 
  ArrowRight,
  ShieldAlert,
  Briefcase
} from 'lucide-react';
import { DEPARTMENTS } from '../data/mockEmployees';

export default function DepartmentAnalyticsView({ 
  employees, 
  onFilterByDepartment 
}) {
  const departmentStats = DEPARTMENTS.map((dept) => {
    const deptEmployees = employees.filter(e => e.department?.toLowerCase() === dept.toLowerCase());
    const count = deptEmployees.length;
    const totalPayroll = deptEmployees.reduce((sum, e) => sum + (e.salary || 0), 0);
    const avgSalary = count > 0 ? totalPayroll / count : 0;
    const activeCount = deptEmployees.filter(e => e.status === 'ACTIVE').length;

    return {
      name: dept,
      count,
      activeCount,
      totalPayroll,
      avgSalary,
      employees: deptEmployees
    };
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Department Analytics &amp; Budgets</h2>
            <p className="text-xs text-slate-500 mt-1">
              Analyze organizational structure, payroll allocation, and operational capacity by unit.
            </p>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <span className="px-3 py-1.5 rounded-xl bg-slate-100 font-semibold text-slate-700">
              {DEPARTMENTS.length} Active Departments
            </span>
          </div>
        </div>
      </div>

      {/* Grid of Department Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {departmentStats.map((dept) => (
          <div
            key={dept.name}
            className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2.5 rounded-xl bg-brand-50 text-brand-600">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{dept.name}</h3>
                    <p className="text-[11px] text-slate-500">
                      {dept.activeCount} active • {dept.count - dept.activeCount} away
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                  {dept.count} {dept.count === 1 ? 'member' : 'members'}
                </span>
              </div>

              {/* Metrics */}
              <div className="mt-5 grid grid-cols-2 gap-2.5">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-[10px] font-semibold uppercase text-slate-400 block">Avg Compensation</span>
                  <p className="text-sm font-bold text-slate-800 mt-0.5">
                    ${Math.round(dept.avgSalary).toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-[10px] font-semibold uppercase text-slate-400 block">Annual Budget</span>
                  <p className="text-sm font-bold text-emerald-700 mt-0.5">
                    ${Math.round(dept.totalPayroll).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Members Avatars preview */}
              <div className="mt-4 pt-4 border-t border-slate-100">
                <span className="text-[11px] font-medium text-slate-400 block mb-2">Team Roster:</span>
                {dept.employees.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No staff assigned yet</p>
                ) : (
                  <div className="flex -space-x-2 overflow-hidden">
                    {dept.employees.slice(0, 6).map((emp) => (
                      <img
                        key={emp.id}
                        src={emp.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(emp.firstName + ' ' + emp.lastName)}&background=random`}
                        alt={emp.firstName}
                        title={`${emp.firstName} ${emp.lastName} (${emp.designation})`}
                        className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                      />
                    ))}
                    {dept.employees.length > 6 && (
                      <div className="flex items-center justify-center h-8 w-8 rounded-full ring-2 ring-white bg-slate-200 text-slate-700 text-[10px] font-bold">
                        +{dept.employees.length - 6}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Filter action button */}
            <div className="mt-5 pt-3 border-t border-slate-100">
              <button
                onClick={() => onFilterByDepartment(dept.name)}
                className="w-full inline-flex items-center justify-center space-x-1 py-2 text-xs font-semibold text-brand-600 hover:text-brand-700 hover:bg-brand-50 rounded-xl transition"
              >
                <span>Filter Staff in Directory</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
