import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const isError = toast.type === 'error';
  const isWarning = toast.type === 'warning';

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-200">
      <div className={`flex items-center space-x-3 px-4 py-3 rounded-2xl shadow-xl border ${
        isError 
          ? 'bg-rose-900 text-white border-rose-800' 
          : isWarning 
          ? 'bg-amber-900 text-white border-amber-800' 
          : 'bg-slate-900 text-white border-slate-800'
      }`}>
        {isError ? (
          <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
        ) : isWarning ? (
          <Info className="w-5 h-5 text-amber-400 flex-shrink-0" />
        ) : (
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
        )}
        
        <p className="text-xs font-semibold">{toast.message}</p>

        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded-lg"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
