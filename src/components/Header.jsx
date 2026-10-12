import React from 'react';
import { 
  Building2, 
  Plus, 
  Sparkles, 
  Wifi, 
  WifiOff, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

export default function Header({ 
  backendStatus, 
  onAddEmployee, 
  onSeedData, 
  activeTab 
}) {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold tracking-tight text-slate-900">WorkNest</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-brand-50 text-brand-700 border border-brand-200">
                  EMS Pro
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">Employee Management System</p>
            </div>
          </div>

          {/* Right Controls: Backend Status & Actions */}
          <div className="flex items-center space-x-3">
            
            {/* Backend connection pill */}
            <div 
              title={backendStatus === 'online' ? 'Connected to live REST backend on Render/Local' : 'Running with local fallback storage (Backend may be spinning up)'}
              className={`hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-medium border ${
                backendStatus === 'online'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}
            >
              {backendStatus === 'online' ? (
                <>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <Wifi className="w-3.5 h-3.5" />
                  <span>Render API: Connected</span>
                </>
              ) : (
                <>
                  <span className="h-2 w-2 rounded-full bg-amber-400"></span>
                  <WifiOff className="w-3.5 h-3.5" />
                  <span>Render API: Standby / Demo Mode</span>
                </>
              )}
            </div>

            {/* Quick Demo Data Seed Button */}
            <button
              onClick={onSeedData}
              className="hidden lg:inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
              title="Re-populate with sample employee records"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Load Sample Data</span>
            </button>

            {/* Primary Add Employee Button */}
            <button
              onClick={onAddEmployee}
              className="inline-flex items-center space-x-1.5 px-4 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 active:bg-brand-800 rounded-lg shadow-sm shadow-brand-500/25 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Add Employee</span>
            </button>

            {/* User Profile Mini Badge */}
            <div className="hidden sm:flex items-center pl-3 border-l border-slate-200 space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                AD
              </div>
              <div className="text-left text-xs">
                <p className="font-semibold text-slate-800 leading-none">Admin HR</p>
                <p className="text-slate-400 text-[10px]">WorkNest Org</p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
}
