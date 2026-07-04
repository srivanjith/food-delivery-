import React from 'react';
import { Compass, Leaf, Sparkles, Trash2, MapPin } from 'lucide-react';

export default function Categories({ selectedCategory, onSelectCategory }) {
  const categoriesList = [
    { name: 'All', icon: <Compass className="w-4 h-4" /> },
    { name: 'Vegan', icon: <Leaf className="w-4 h-4" /> },
    { name: 'Organic', icon: <Sparkles className="w-4 h-4" /> },
    { name: 'Zero Waste', icon: <Trash2 className="w-4 h-4" /> },
    { name: 'Locally Sourced', icon: <MapPin className="w-4 h-4" /> }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans">
      <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">
        Browse by Green Category
      </h3>
      <div className="flex items-center space-x-3 overflow-x-auto pb-3 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
        {categoriesList.map((category) => {
          const isSelected = selectedCategory === category.name;
          
          return (
            <button
              key={category.name}
              onClick={() => onSelectCategory(category.name)}
              className={`flex items-center space-x-2 px-5 py-3 rounded-2xl border text-sm font-semibold transition-all duration-200 shrink-0 cursor-pointer ${
                isSelected
                  ? 'bg-emerald-500 text-white border-emerald-550 shadow-md shadow-emerald-500/10'
                  : 'bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
              }`}
            >
              {category.icon}
              <span>{category.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
