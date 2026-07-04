import React from 'react';
import { Search, Leaf, Sparkles, MapPin, Grid } from 'lucide-react';

export default function MenuFilter({ searchQuery, setSearchQuery, activeFilter, setActiveFilter }) {
  const filters = [
    { id: 'all', label: 'All Dishes', icon: <Grid className="w-3.5 h-3.5" /> },
    { id: 'vegan', label: '100% Vegan', icon: <Leaf className="w-3.5 h-3.5" /> },
    { id: 'organic', label: 'Organic', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'local', label: 'Locally Sourced', icon: <MapPin className="w-3.5 h-3.5" /> }
  ];

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-6 border-b border-slate-100 dark:border-slate-800 font-sans">
      
      {/* Filters group */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
        {filters.map((filter) => {
          const isActive = activeFilter === filter.id;
          return (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all duration-200 shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-emerald-500 text-white border-emerald-550 shadow-md shadow-emerald-500/10'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-350 border-slate-205 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850'
              }`}
            >
              {filter.icon}
              <span>{filter.label}</span>
            </button>
          );
        })}
      </div>

      {/* Menu Search */}
      <div className="relative w-full md:max-w-xs shadow-sm rounded-xl">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-slate-400 dark:text-slate-500" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search this menu..."
          className="block w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1.5 focus:ring-emerald-500 focus:border-transparent text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 font-sans"
        />
      </div>

    </div>
  );
}
