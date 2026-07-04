import React from 'react';
import ProgressBar from '../Common/ProgressBar';
import { Leaf, Trees, Trophy, Sparkles } from 'lucide-react';

export default function VirtualForest({ ecoPoints = 0, treesPlanted = 0 }) {
  const pointsPerTree = 200;
  const fullyGrownTrees = Math.floor(ecoPoints / pointsPerTree);
  const currentTreeProgress = ecoPoints % pointsPerTree;
  
  // Calculate growth stage of the active tree
  let activeStage = 'seed';
  if (currentTreeProgress > 150) activeStage = 'mature';
  else if (currentTreeProgress > 100) activeStage = 'sapling';
  else if (currentTreeProgress > 40) activeStage = 'sprout';

  // Generate list of trees to draw in the forest grid
  const forestItems = [];
  
  // Add fully grown trees
  for (let i = 0; i < fullyGrownTrees; i++) {
    forestItems.push({ id: `mature-${i}`, stage: 'mature', label: `Tree #${i + 1}` });
  }
  
  // Add the currently growing tree (if any progress)
  if (currentTreeProgress > 0) {
    forestItems.push({ id: 'active-tree', stage: activeStage, label: 'Growing...', active: true });
  }

  // Visual SVG elements for tree stages
  const renderTreeIcon = (stage, isActive) => {
    const activePulse = isActive ? 'animate-pulse' : '';
    
    switch (stage) {
      case 'seed':
        return (
          <svg className={`w-12 h-12 text-amber-600 ${activePulse}`} viewBox="0 0 24 24" fill="currentColor">
            {/* Ground */}
            <path d="M2,20 C8,19 16,19 22,20 C22,21 2,21 2,20 Z" fill="#78350f" />
            {/* Small seed shoot */}
            <path d="M12,20 C12,18 11.5,16 11,15 C11,15 12,14.5 13,15.5 C13,15.5 13,18 12,20 Z" fill="#10b981" />
            <path d="M11,16 C10,15 9,15 8.5,15.5 C8.5,15.5 9.5,16.5 11,16 Z" fill="#34d399" />
          </svg>
        );
      case 'sprout':
        return (
          <svg className={`w-12 h-12 text-emerald-500 ${activePulse}`} viewBox="0 0 24 24" fill="currentColor">
            {/* Ground */}
            <path d="M2,20 H22" stroke="#78350f" strokeWidth="2" />
            {/* Stem */}
            <path d="M12,20 C12,16 13,13 13,11" stroke="#84cc16" strokeWidth="2.5" strokeLinecap="round" />
            {/* Leaves */}
            <path d="M13,11 C11.5,11.5 9,10 9,10 C9,10 10.5,8.5 13,11 Z" fill="#22c55e" />
            <path d="M13,12 C14.5,12.5 17,11.5 17,11.5 C17,11.5 16,9.5 13,12 Z" fill="#10b981" />
          </svg>
        );
      case 'sapling':
        return (
          <svg className={`w-14 h-14 text-emerald-500 animate-sway ${activePulse}`} viewBox="0 0 24 24" fill="currentColor">
            <path d="M2,20 H22" stroke="#78350f" strokeWidth="2" />
            {/* Trunk */}
            <path d="M12,20 L12,12" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />
            {/* Small branches */}
            <path d="M12,15 L9,13" stroke="#78350f" strokeWidth="2" />
            <path d="M12,14 L15,12" stroke="#78350f" strokeWidth="2" />
            {/* Foliage */}
            <circle cx="12" cy="10" r="4.5" fill="#22c55e" />
            <circle cx="8" cy="12" r="3" fill="#10b981" />
            <circle cx="15" cy="11" r="3.5" fill="#059669" />
          </svg>
        );
      case 'mature':
      default:
        return (
          <svg className="w-16 h-16 text-emerald-600 animate-sway hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2,20 H22" stroke="#451a03" strokeWidth="2" />
            {/* Robust Trunk */}
            <path d="M12,20 L12,10" stroke="#78350f" strokeWidth="4.5" strokeLinecap="round" />
            <path d="M12,16 Q9,14 8,11" stroke="#78350f" strokeWidth="2.5" />
            <path d="M12,14 Q15,12 16,9" stroke="#78350f" strokeWidth="2.5" />
            {/* Large lush canopy */}
            <circle cx="12" cy="7.5" r="5" fill="#15803d" />
            <circle cx="8.5" cy="10.5" r="4" fill="#16a34a" />
            <circle cx="15.5" cy="9.5" r="4.5" fill="#047857" />
            <circle cx="12" cy="11" r="3.5" fill="#22c55e" />
          </svg>
        );
    }
  };

  return (
    <div className="glass-card p-6 md:p-8 font-sans">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <Trees className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 font-sans">My Virtual Forest</h2>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Grow a virtual tree by ordering sustainable meals. For every tree you grow, a real tree is planted through our reforestation partners!
          </p>
        </div>

        {/* stats summary */}
        <div className="flex space-x-4">
          <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900 rounded-xl px-4 py-3 text-center min-w-[100px]">
            <span className="block text-2xl font-black text-emerald-600 dark:text-emerald-400">{treesPlanted}</span>
            <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">Trees Grown</span>
          </div>
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900 rounded-xl px-4 py-3 text-center min-w-[100px]">
            <span className="block text-2xl font-black text-amber-600 dark:text-amber-400">{ecoPoints}</span>
            <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">Eco-Points</span>
          </div>
        </div>
      </div>

      {/* Progress to next tree */}
      <div className="bg-slate-50 dark:bg-slate-850/50 rounded-2xl p-4 md:p-5 border border-slate-100 dark:border-slate-800 mb-8">
        <div className="flex items-center justify-between text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
          <span className="flex items-center">
            <Leaf className="w-4 h-4 mr-1 text-emerald-500" />
            Next Tree Progress
          </span>
          <span className="text-slate-500">{currentTreeProgress} / {pointsPerTree} pts</span>
        </div>
        <ProgressBar value={currentTreeProgress} max={pointsPerTree} color="emerald" className="h-4" />
        <span className="block text-[11px] text-slate-500 dark:text-slate-400 mt-2 text-right">
          Earn {pointsPerTree - currentTreeProgress} more points to plant your next tree!
        </span>
      </div>

      {/* Forest Visual Grid */}
      <div className="border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-6 bg-slate-50/50 dark:bg-slate-900/10">
        <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-6 text-center">
          Forest Sanctuary
        </h4>
        
        {forestItems.length === 0 ? (
          <div className="text-center py-8">
            <span className="text-4xl">🌱</span>
            <p className="text-sm font-semibold text-slate-650 mt-2">Your forest is empty.</p>
            <p className="text-xs text-slate-400">Place your first order to plant a seed!</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6 justify-items-center">
            {forestItems.map((item) => (
              <div key={item.id} className="flex flex-col items-center group">
                <div className="h-20 flex items-end justify-center mb-1">
                  {renderTreeIcon(item.stage, item.active)}
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  item.active 
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' 
                    : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                }`}>
                  {item.label}
                </span>
              </div>
            ))}
            
            {/* Locked/Empty slot for visual guidance */}
            <div className="flex flex-col items-center opacity-30 select-none">
              <div className="h-20 flex items-center justify-center mb-1">
                <div className="w-10 h-10 rounded-full border-2 border-dashed border-slate-400 flex items-center justify-center font-bold text-lg text-slate-500">
                  +
                </div>
              </div>
              <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                Locked
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
