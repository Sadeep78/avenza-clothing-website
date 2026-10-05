/**
 * ====================================================================
 * AVENZA CLOTHING STORE - GLOBAL NOTIFICATION TOAST COMPONENT
 * File: frontend/src/components/Toast.jsx
 * 
 * 🎯 PURPOSE:
 *   Provides unified, non-intrusive floating feedback messages for:
 *   - Success events (Item added to cart, profile saved, order placed).
 *   - Warnings (Low stock notices, validation requirements).
 *   - Errors (Network dropouts, invalid credentials).
 * ====================================================================
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const Toast = () => {
  const { toast, setToast } = useApp();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-sky-500 shrink-0" />
  };

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] max-w-lg w-auto px-4 pointer-events-none animate-in fade-in slide-in-from-top-4 duration-300">
      <div 
        onClick={() => setToast && setToast(null)}
        className="pointer-events-auto flex items-center justify-between gap-3.5 px-5 py-3.5 rounded-2xl shadow-2xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white cursor-pointer hover:border-amber-500/50 transition-all duration-200 group"
      >
        <div className="flex items-center gap-3">
          {icons[toast.type] || icons.info}
          <span className="text-xs sm:text-sm font-semibold tracking-tight">{toast.message}</span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (setToast) setToast(null);
          }}
          className="p-1 -mr-1 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer shrink-0"
          title="Dismiss"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
