import React, { useState } from 'react';
import { Sparkles, Heart } from 'lucide-react';
import BorderGlowCard from '../Common/BorderGlowCard';

export default function FeatureShowcase() {
  const [liked, setLiked] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 font-sans">
      <div className="mb-8">
        <span className="text-[10px] font-extrabold text-purple-600 dark:text-purple-400 uppercase tracking-widest bg-purple-50 dark:bg-purple-950/40 px-2.5 py-1 rounded-md">
          Premium UI Preview
        </span>
        <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-2.5 tracking-tight font-sans">
          Interactive Component Glows
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Try hovering near the borders of these cards to see their custom colored glows track your mouse movements.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start justify-items-center md:justify-items-stretch">
        
        {/* Card 1: Exact Replication of User Mockup */}
        <div className="flex flex-col space-y-3 w-full max-w-[340px]">
          <BorderGlowCard 
            glowColor="rgba(139, 92, 246, 0.40)" // Purple glow
            className="p-8 aspect-square flex flex-col justify-between bg-[#0f111a] border border-slate-900"
          >
            {/* Top row */}
            <div className="flex justify-between items-center w-full z-20">
              <span className="bg-purple-900/35 text-purple-400 border border-purple-500/25 text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md">
                New
              </span>
              <button 
                onClick={(e) => { e.preventDefault(); setLiked(!liked); }}
                className={`p-2.5 rounded-full border border-slate-800/80 bg-slate-950/40 hover:bg-slate-900/60 transition-all cursor-pointer ${
                  liked ? 'text-red-500 border-red-500/25 bg-red-500/10' : 'text-slate-400'
                }`}
              >
                <Heart className={`w-4 h-4 ${liked ? 'fill-red-500' : ''}`} />
              </button>
            </div>

            {/* Middle Content */}
            <div className="space-y-4 my-auto z-20">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 text-purple-400 shadow-[0_0_20px_rgba(139,92,246,0.15)]">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-lg font-bold text-white font-sans tracking-tight">
                  Hover Near the Edges
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed font-normal">
                  Move your cursor close to the card border to see the colored glow effect follow your pointer direction.
                </p>
              </div>
            </div>
          </BorderGlowCard>

          {/* Labels below the card */}
          <div className="pl-2 space-y-0.5">
            <h5 className="text-sm font-bold text-slate-800 dark:text-slate-100">Border Glow</h5>
            <p className="text-xs text-slate-550 dark:text-slate-400">Components</p>
          </div>
        </div>

        {/* Card 2: Reward Coin System Promotion */}
        <div className="flex flex-col space-y-3 w-full max-w-[340px]">
          <BorderGlowCard 
            glowColor="rgba(16, 185, 129, 0.40)" // Emerald green glow
            className="p-8 aspect-square flex flex-col justify-between bg-[#0f111a] border border-slate-900"
          >
            {/* Top row */}
            <div className="flex justify-between items-center w-full z-20">
              <span className="bg-emerald-900/35 text-emerald-400 border border-emerald-500/25 text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md">
                Active
              </span>
              <span className="text-[10px] font-black text-emerald-400">
                100 Coins = ₹1
              </span>
            </div>

            {/* Middle Content */}
            <div className="space-y-4 my-auto z-20">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.15)] text-xl">
                🪙
              </div>
              <div className="space-y-1.5">
                <h4 className="text-lg font-bold text-white font-sans tracking-tight">
                  Loyalty Coins Wallet
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed font-normal">
                  Earn eco points on every successful delivery. Redeem coins for instant billing discounts at checkout.
                </p>
              </div>
            </div>
          </BorderGlowCard>

          {/* Labels below the card */}
          <div className="pl-2 space-y-0.5">
            <h5 className="text-sm font-bold text-slate-800 dark:text-slate-100">Reward Coins</h5>
            <p className="text-xs text-slate-550 dark:text-slate-400">Loyalty Program</p>
          </div>
        </div>

        {/* Card 3: Platform Settlements Info */}
        <div className="flex flex-col space-y-3 w-full max-w-[340px]">
          <BorderGlowCard 
            glowColor="rgba(249, 115, 22, 0.40)" // Orange glow
            className="p-8 aspect-square flex flex-col justify-between bg-[#0f111a] border border-slate-900"
          >
            {/* Top row */}
            <div className="flex justify-between items-center w-full z-20">
              <span className="bg-orange-900/35 text-orange-400 border border-orange-500/25 text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md">
                Ledger
              </span>
              <span className="text-[10px] font-black text-orange-400">
                15% Commission
              </span>
            </div>

            {/* Middle Content */}
            <div className="space-y-4 my-auto z-20">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20 text-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.15)] text-xl">
                💼
              </div>
              <div className="space-y-1.5">
                <h4 className="text-lg font-bold text-white font-sans tracking-tight">
                  Settlements Ledger
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed font-normal">
                  Track partner commission balances, platform revenue settings, and pending payout approval lists.
                </p>
              </div>
            </div>
          </BorderGlowCard>

          {/* Labels below the card */}
          <div className="pl-2 space-y-0.5">
            <h5 className="text-sm font-bold text-slate-800 dark:text-slate-100">Commission & Payouts</h5>
            <p className="text-xs text-slate-550 dark:text-slate-400">Revenue Flow</p>
          </div>
        </div>

      </div>
    </div>
  );
}
