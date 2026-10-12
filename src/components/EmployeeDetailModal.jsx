import React from 'react';
import { 
  X, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Briefcase, 
  Building2, 
  Clock, 
  Edit3, 
  Trash2,
  ExternalLink
} from 'lucide-react';

export default function EmployeeDetailModal({ 
  employee, 
  isOpen, 
  onClose, 
  onEdit, 
  onDelete 
}) {
  if (!isOpen || !employee) return null;

  // Calculate approximate tenure
  const calculateTenure = (dateStr) => {
    if (!dateStr) return 'N/A';
    const start = new Date(dateStr);
    const now = new Date();
    const diffMonths = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
    if (diffMonths < 1) return 'Less than 1 month';
    const years = Math.floor(diffMonths / 12);
    const months = diffMonths % 12;
    if (years === 0) return `${months} ${months === 1 ? 'month' : 'months'}`;
    return `${years} ${years === 1 ? 'yr' : 'yrs'} ${months > 0 ? `${months} mo` : ''}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Cover banner */}
        <div className="h-28 bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-white/80 hover:text-white bg-black/20 hover:bg-black/30 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Card Body */}
        <div className="px-6 pb-6 relative">
          
          {/* Avatar floating over banner */}
          <div className="-mt-14 flex items-end justify-between">
            <img
              src={employee.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(employee.firstName + ' ' + employee.lastName)}&background=random`}
              alt={employee.firstName}
              className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-md bg-white"
            />
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  onClose();
                  onEdit(employee);
                }}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
              <button
                onClick={() => {
                  onClose();
                  onDelete(employee);
                }}
                className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl border border-rose-100 transition"
                title="Delete Record"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Name & Designation */}
          <div className="mt-4">
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-slate-900">
                {employee.firstName} {employee.lastName}
              </h2>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                employee.status === 'ACTIVE' 
                  ? 'bg-emerald-100 text-emerald-800' 
                  : employee.status === 'ON_LEAVE' 
                  ? 'bg-amber-100 text-amber-800' 
                  : 'bg-slate-100 text-slate-600'
              }`}>
                {employee.status || 'ACTIVE'}
              </span>
            </div>
            <p className="text-sm font-medium text-slate-500 mt-0.5">{employee.designation}</p>
          </div>

          {/* Key Facts Grid */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center space-x-1">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Department</span>
              </span>
              <p className="text-sm font-bold text-slate-800 mt-1">{employee.department}</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center space-x-1">
                <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                <span>Annual Salary</span>
              </span>
              <p className="text-sm font-bold text-emerald-700 mt-1">
                ${employee.salary?.toLocaleString() || '0'} USD
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Joining Date</span>
              </span>
              <p className="text-sm font-bold text-slate-800 mt-1">{employee.joiningDate || 'N/A'}</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-indigo-500" />
                <span>Tenure</span>
              </span>
              <p className="text-sm font-bold text-slate-800 mt-1">{calculateTenure(employee.joiningDate)}</p>
            </div>
          </div>

          {/* Contact Details */}
          <div className="mt-4 p-4 rounded-xl border border-slate-200/80 bg-white space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Direct Contact</h4>
            
            <a 
              href={`mailto:${employee.email}`}
              className="flex items-center justify-between text-xs font-medium text-slate-700 hover:text-brand-600 group"
            >
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-slate-400 group-hover:text-brand-600" />
                <span>{employee.email}</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-300 group-hover:text-brand-600" />
            </a>

            {employee.phone && (
              <a 
                href={`tel:${employee.phone}`}
                className="flex items-center justify-between text-xs font-medium text-slate-700 hover:text-brand-600 group"
              >
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-slate-400 group-hover:text-brand-600" />
                  <span>{employee.phone}</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-300 group-hover:text-brand-600" />
              </a>
            )}

            <div className="flex items-center space-x-2 text-xs font-medium text-slate-600">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span>{employee.location || 'Remote / Unassigned'}</span>
            </div>
          </div>

          {/* Footer close */}
          <div className="mt-5 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
            >
              Close
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
