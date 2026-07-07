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
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 py-6 border-b border-slate-100 dark:border-slate-800 font-sans">
      
      {/* Filters group - wraps cleanly to prevent clipping */}
      <div className="flex flex-wrap items-center gap-2">
        {filters.map((filter) => {
          const isActive = activeFilter === filter.id;
          return (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`transition-all duration-200 shrink-0 ${
                isActive
                  ? 'neumo-button-active'
                  : 'neumo-button'
              }`}
            >
              {filter.icon}
              <span>{filter.label}</span>
            </button>
          );
        })}
      </div>

      {/* Menu Search */}
      <div className="relative w-full lg:max-w-xs shadow-sm rounded-xl">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-slate-400 dark:text-slate-500" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search this menu..."
          className="block w-full pl-10 pr-4 py-2.5 neumo-input rounded-xl placeholder-slate-400 font-sans"
        />
      </div>

    </div>
  );
}
