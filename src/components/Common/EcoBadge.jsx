import React from 'react';
import { Leaf, Award, ShieldAlert, Sparkles, Footprints } from 'lucide-react';

export default function EcoBadge({ type = 'score', value, className = '' }) {
  if (type === 'score') {
    const score = value || 'A';
    let colors = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
    let icon = <Leaf className="w-3.5 h-3.5 mr-1 animate-pulse-slow" />;

    if (score === 'A+') {
      colors = 'bg-emerald-500 text-white dark:bg-emerald-600 dark:text-emerald-50 border-emerald-600 dark:border-emerald-700 font-bold';
      icon = <Sparkles className="w-3.5 h-3.5 mr-1" />;
    } else if (score.startsWith('B')) {
      colors = 'bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300 border-teal-200 dark:border-teal-900';
      icon = <Leaf className="w-3.5 h-3.5 mr-1" />;
    } else if (score.startsWith('C') || score.startsWith('D')) {
      colors = 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-900';
      icon = <ShieldAlert className="w-3.5 h-3.5 mr-1" />;
    }

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colors} ${className}`}>
        {icon}
        Eco-Score {score}
      </span>
    );
  }

  if (type === 'carbon') {
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-305 border border-slate-200 dark:border-slate-700 ${className}`}>
        <Footprints className="w-3.5 h-3.5 mr-1 text-slate-500 dark:text-slate-450" />
        {value}g CO₂e
      </span>
    );
  }

  if (type === 'saving') {
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-900/50 ${className}`}>
        <Sparkles className="w-3.5 h-3.5 mr-1 text-emerald-500" />
        Saved {value}g CO₂e!
      </span>
    );
  }

  // General certification badge
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 ${className}`}>
      <Award className="w-3 h-3 mr-1 text-emerald-500" />
      {value}
    </span>
  );
}
