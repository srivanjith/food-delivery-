import React from 'react';
import { Search, Compass, ShieldCheck } from 'lucide-react';

export default function Hero({ searchQuery, setSearchQuery }) {
  return (
    <div className="relative overflow-hidden bg-slate-900 py-12 md:py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Side: Copywriting & Search */}
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-emerald-950/40 border border-emerald-900/50 rounded-full text-xs font-bold text-emerald-400">
            <span>✨ Zero-Waste & Eco-Friendly Dining</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1] font-sans">
            Feast Locally. <br />
            <span className="bg-gradient-to-r from-emerald-400 to-amber-300 bg-clip-text text-transparent">Earn Rewards.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Order from local organic and eco-certified kitchens. Select green packaging, use low-emission logistics, and earn Eco Points to claim discounts on every order.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto lg:mx-0 shadow-lg shadow-black/30 rounded-2xl">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              id="restaurant-search-input"
              placeholder="Search organic kitchens, healthy bowls, or sourdough bakery..."
              className="block w-full pl-11 pr-4 py-4 bg-slate-800/80 border border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-slate-400 font-sans"
            />
          </div>

          {/* Core Green Badges */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-4 text-xs font-semibold text-slate-350 pt-2">
            <span className="flex items-center">
              <Compass className="w-4 h-4 text-emerald-400 mr-1.5" />
              100% Biodegradable Packaging
            </span>
            <span className="flex items-center">
              <ShieldCheck className="w-4 h-4 text-emerald-400 mr-1.5" />
              Eco-Certified Partners
            </span>
          </div>
        </div>

        {/* Right Side: Visual Artwork Box */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96 flex items-center justify-center animate-float">
            {/* Ambient Background Circles */}
            <div className="absolute w-60 h-60 sm:w-72 sm:h-72 bg-emerald-500/10 rounded-full filter blur-2xl" />
            <div className="absolute w-40 h-40 sm:w-52 sm:h-52 bg-teal-500/10 rounded-full filter blur-xl" />

            {/* Glowing card panel */}
            <div className="relative glass-card p-6 w-64 sm:w-72 bg-slate-900/90 border border-slate-800 shadow-2xl flex flex-col justify-between items-center text-center">
              <div className="p-3 bg-emerald-500 rounded-2xl text-white mb-4 shadow-lg shadow-emerald-500/20">
                <LeafIcon />
              </div>
              
              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400">
                Live Rewards Issued
              </span>
              
              <h3 className="text-3xl sm:text-4xl font-black text-white mt-1 mb-2 font-sans tracking-tight">
                1,284,530
              </h3>
              
              <p className="text-xs text-slate-300 leading-relaxed">
                Total Eco Points rewarded to the EcoEats community for sustainable choices.
              </p>

              <div className="w-full border-t border-slate-800 mt-4 pt-3 flex items-center justify-center text-xs font-bold text-slate-200 gap-1.5">
                <span>🌱 42,822 Green Deliveries Completed</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// Leaf icon helper
function LeafIcon() {
  return (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
    </svg>
  );
}
