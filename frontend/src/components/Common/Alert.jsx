import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info } from 'lucide-react';

export default function Alert({ type = 'info', message, className = '' }) {
  const styles = {
    success: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/20',
      border: 'border-emerald-200 dark:border-emerald-900/50',
      text: 'text-emerald-800 dark:text-emerald-300',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-500 mr-3 shrink-0" />
    },
    warning: {
      bg: 'bg-amber-50 dark:bg-amber-950/20',
      border: 'border-amber-200 dark:border-amber-900/50',
      text: 'text-amber-800 dark:text-amber-300',
      icon: <AlertTriangle className="w-5 h-5 text-amber-500 mr-3 shrink-0" />
    },
    error: {
      bg: 'bg-red-50 dark:bg-red-950/20',
      border: 'border-red-200 dark:border-red-900/50',
      text: 'text-red-800 dark:text-red-300',
      icon: <AlertCircle className="w-5 h-5 text-red-500 mr-3 shrink-0" />
    },
    info: {
      bg: 'bg-blue-50 dark:bg-blue-950/20',
      border: 'border-blue-200 dark:border-blue-900/50',
      text: 'text-blue-800 dark:text-blue-300',
      icon: <Info className="w-5 h-5 text-blue-500 mr-3 shrink-0" />
    }
  };

  const current = styles[type] || styles.info;

  return (
    <div className={`flex items-start p-4 rounded-xl border ${current.bg} ${current.border} ${current.text} ${className}`}>
      {current.icon}
      <div className="text-sm font-medium">{message}</div>
    </div>
  );
}
