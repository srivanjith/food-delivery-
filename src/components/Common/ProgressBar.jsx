import React from 'react';

export default function ProgressBar({ value, max = 100, color = 'emerald', className = '', showLabel = false, label = '' }) {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const colorClasses = {
    emerald: 'bg-emerald-500 dark:bg-emerald-400',
    teal: 'bg-teal-500 dark:bg-teal-400',
    amber: 'bg-amber-500 dark:bg-amber-400',
    blue: 'bg-blue-500 dark:bg-blue-400'
  };

  const bgClasses = {
    emerald: 'bg-emerald-100 dark:bg-emerald-950/40',
    teal: 'bg-teal-100 dark:bg-teal-950/40',
    amber: 'bg-amber-100 dark:bg-amber-950/40',
    blue: 'bg-blue-100 dark:bg-blue-950/40'
  };

  const activeColor = colorClasses[color] || colorClasses.emerald;
  const activeBg = bgClasses[color] || bgClasses.emerald;

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400">
          <span>{label}</span>
          <span>{percentage}% ({value}/{max})</span>
        </div>
      )}
      <div className={`w-full h-3 rounded-full overflow-hidden ${activeBg}`}>
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out ${activeColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
