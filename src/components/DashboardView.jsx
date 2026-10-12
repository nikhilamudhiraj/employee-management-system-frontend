import React from 'react';
import { 
  Users, 
  UserCheck, 
  UserX, 
  DollarSign, 
  Briefcase, 
  Plus, 
  Download, 
  ArrowRight,
  Database,
  Cloud,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import StatsCard from './StatsCard';

export default function DashboardView({ 
  stats, 
  employees, 
  onAddEmployee, 
  onViewAll, 
  onExportCSV,
  onSelectEmployee 
}) {
  const totalEmployees = stats?.totalEmployees ?? employees.length;
  const activeEmployees = stats?.activeEmployees ?? employees.filter(e => e.status === 'ACTIVE').length;
  const onLeaveEmployees = stats?.onLeaveEmployees ?? employees.filter(e => e.status === 'ON_LEAVE').length;
  
  const totalPayroll = stats?.totalPayroll ?? employees.reduce((acc, curr) => acc + (curr.salary || 0), 0);
  const formattedPayroll = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(totalPayroll);

  const activeRate = totalEmployees > 0 ? Math.round((activeEmployees / totalEmployees) * 100) : 0;

  // Department counts
  const deptBreakdown = stats?.departmentBreakdown || [];
  const recentEmployees = [...employees].slice(0, 5);

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-900 via-brand-800 to-indigo-900 text-white p-6 sm:p-8 shadow-lg">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-brand-200 text-xs font-semibold mb-3 border border-white/10">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>WorkNest Enterprise Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome to WorkNest EMS
          </h1>
          <p className="mt-2 text-sm sm:text-base text-brand-100/90 leading-relaxed">
            Centralized hub to manage your workforce, review department statistics, handle CRUD operations, and oversee team payroll.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={onAddEmployee}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-white text-brand-900 font-semibold text-sm hover:bg-brand-50 shadow-sm transition"
            >
              <Plus className="w-4 h-4 text-brand-600" />
              <span>Add New Employee</span>
            </button>
            <button
              onClick={onViewAll}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-brand-800/80 hover:bg-brand-700/80 text-white font-medium text-sm border border-brand-700/50 transition"
            >
              <span>View Full Directory</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Decorative background circles */}
        <div className="absolute right-0 top-0 -mt-12 -mr-12 w-80 h-80 rounded-full bg-brand-500/10 blur-3xl pointer-events-none"></div>
        <div className="absolute right-32 bottom-0 w-60 h-60 rounded-full bg-indigo-500/20 blur-2xl pointer-events-none"></div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Workforce"
          value={totalEmployees}
          change="+100% managed"
          icon={Users}
          color="blue"
        />
        <StatsCard
          title="Active Staff"
          value={activeEmployees}
          change={`${activeRate}% operational`}
          icon={UserCheck}
          color="emerald"
        />
        <StatsCard
          title="On Leave / Away"
          value={onLeaveEmployees}
          change="Pending return"
          icon={UserX}
          color="amber"
        />
        <StatsCard
          title="Annual Payroll Total"
          value={formattedPayroll}
          change="Real-time sum"
          icon={DollarSign}
          color="purple"
        />
      </div>

      {/* Main Grid: Department Breakdown & Recent Hires */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Department Distribution (2 cols on large) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Department Headcount</h2>
              <p className="text-xs text-slate-500">Distribution of talent across business units</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg">
              {deptBreakdown.length} Departments
            </span>
          </div>

          <div className="mt-5 space-y-4">
            {deptBreakdown.length === 0 ? (
              <p className="text-sm text-slate-400 py-4 text-center">No department records available.</p>
            ) : (
              deptBreakdown.map((item, idx) => {
                const count = item.count;
                const percentage = totalEmployees > 0 ? Math.round((count / totalEmployees) * 100) : 0;
                
                // Color palette cycle
                const colors = [
                  'bg-brand-500', 
                  'bg-emerald-500', 
                  'bg-purple-500', 
                  'bg-amber-500', 
                  'bg-cyan-500', 
                  'bg-pink-500'
                ];
                const barColor = colors[idx % colors.length];

                return (
                  <div key={item.department} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-700 font-semibold">{item.department}</span>
                      <span className="text-slate-500">
                        {count} {count === 1 ? 'member' : 'members'} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`h-2.5 rounded-full transition-all duration-500 ${barColor}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Quick Info Footer */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Synched with PostgreSQL Database</span>
            </span>
            <button
              onClick={onExportCSV}
              className="inline-flex items-center space-x-1 text-brand-600 hover:text-brand-700 font-medium"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Recent Additions Card (1 col on large) */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">Recent Members</h2>
              <button
                onClick={onViewAll}
                className="text-xs font-medium text-brand-600 hover:underline"
              >
                View all
              </button>
            </div>

            <div className="mt-4 divide-y divide-slate-100">
              {recentEmployees.map((emp) => (
                <div
                  key={emp.id}
                  onClick={() => onSelectEmployee(emp)}
                  className="py-3 flex items-center justify-between cursor-pointer group hover:bg-slate-50/80 -mx-2 px-2 rounded-lg transition"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={emp.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(emp.firstName + ' ' + emp.lastName)}&background=random`}
                      alt={emp.firstName}
                      className="w-9 h-9 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <p className="text-xs font-semibold text-slate-800 group-hover:text-brand-600 transition">
                        {emp.firstName} {emp.lastName}
                      </p>
                      <p className="text-[11px] text-slate-500">{emp.designation}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {emp.department}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button
              onClick={onAddEmployee}
              className="w-full py-2 px-3 text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-xl transition flex items-center justify-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Enroll New Team Member</span>
            </button>
          </div>
        </div>

      </div>

      {/* Deployment & Architecture Banner */}
      <div className="bg-slate-900 text-slate-200 rounded-2xl p-6 shadow-sm border border-slate-800">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-brand-500/20 text-brand-400 border border-brand-500/30 rounded">
                Live Deployment Stack
              </span>
              <span className="text-xs text-slate-400">Production Architecture</span>
            </div>
            <h3 className="text-lg font-bold text-white">Full-Stack Cloud Configuration</h3>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              Frontend deployed to <strong className="text-white">Vercel</strong> for ultra-fast Edge CDN delivery. Backend running on <strong className="text-white">Render</strong> containerizing Spring Boot 3 &amp; Java 17. Persistent relational data hosted on <strong className="text-white">PostgreSQL</strong>.
            </p>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <div className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700">
              <Cloud className="w-4 h-4 text-cyan-400" />
              <span>Vercel + Render</span>
            </div>
            <div className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700">
              <Database className="w-4 h-4 text-emerald-400" />
              <span>PostgreSQL</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
