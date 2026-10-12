import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  PieChart, 
  Layers
} from 'lucide-react';

export default function NavigationTabs({ activeTab, setActiveTab, counts = {} }) {
  const tabs = [
    { 
      id: 'dashboard', 
      label: 'Overview Dashboard', 
      icon: LayoutDashboard,
      badge: null
    },
    { 
      id: 'directory', 
      label: 'Employee Directory', 
      icon: Users,
      badge: counts.total || null
    },
    { 
      id: 'departments', 
      label: 'Departments & Analytics', 
      icon: PieChart,
      badge: counts.departments || null
    }
  ];

  return (
    <div className="border-b border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-2 sm:space-x-8 -mb-px overflow-x-auto py-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group inline-flex items-center py-3 px-3 sm:px-1 border-b-2 font-medium text-sm transition whitespace-nowrap ${
                  isActive
                    ? 'border-brand-600 text-brand-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                }`}
              >
                <Icon
                  className={`-ml-0.5 mr-2 h-4 w-4 ${
                    isActive ? 'text-brand-600' : 'text-slate-400 group-hover:text-slate-500'
                  }`}
                />
                <span>{tab.label}</span>
                {tab.badge !== null && tab.badge !== undefined && (
                  <span
                    className={`ml-2 py-0.5 px-2 rounded-full text-xs font-semibold ${
                      isActive
                        ? 'bg-brand-100 text-brand-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
