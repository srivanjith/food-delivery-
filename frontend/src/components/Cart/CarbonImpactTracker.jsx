import React from 'react';
import { useCart } from '../../context/CartContext';
import { Leaf, Truck, Gift } from 'lucide-react';

export default function CarbonImpactTracker() {
  const {
    packagingChoice,
    setPackagingChoice,
    deliveryMethod,
    setDeliveryMethod,
    offsetCarbon,
    setOffsetCarbon,
    ecoPointsEarned
  } = useCart();

  const packagingOptions = [
    { id: 'compostable', label: 'Compostable Paper', cost: 0, pointsBonus: '+0 pts', icon: '📄', description: 'Plastic-free organic bag' },
    { id: 'seaweed', label: 'Seaweed Biodegradable', cost: 15, pointsBonus: '+30 pts', icon: '🍃', description: 'Edible, seaweed-derived wrap' },
    { id: 'reusable', label: 'Reusable Bento Box', cost: 50, pointsBonus: '+50 pts', icon: '🍱', description: '₹50 refundable deposit returned' }
  ];

  const deliveryOptions = [
    { id: 'pickup', label: 'Self-Pickup', cost: 0, pointsBonus: '+40 pts', icon: '🏃', description: 'Pick up yourself & earn extra bonus points' },
    { id: 'bicycle', label: 'Bicycle Courier', cost: 20, pointsBonus: '+20 pts', icon: '🚲', description: 'Pure pedal power (Zero emissions)' },
    { id: 'ev', label: 'Electric Vehicle', cost: 35, pointsBonus: '+10 pts', icon: '⚡', description: 'Eco electric car or scooter' },
    { id: 'drone', label: 'Solar Drone', cost: 60, pointsBonus: '+0 pts', icon: '🛸', description: 'Autonomous electric drone' }
  ];

  return (
    <div className="space-y-6 font-sans">
      
      {/* Dynamic Points Indicator Dashboard */}
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute right-0 top-0 w-24 h-24 bg-white/10 rounded-full filter blur-xl" />
        <div className="absolute left-10 bottom-0 w-16 h-16 bg-white/5 rounded-full filter blur-lg" />
        
        <div className="relative flex flex-col md:flex-row justify-between gap-6 items-center">
          <div className="text-center md:text-left">
            <span className="text-[10px] bg-white/20 px-2.5 py-1 rounded-full uppercase font-bold tracking-wider">
              Green Logistics & Rewards Tracker
            </span>
            <h4 className="text-2xl font-black mt-2">Eco Points Rewards</h4>
            <p className="text-xs text-emerald-100 mt-1">
              Select eco-friendly packaging and green delivery options below to maximize your rewards.
            </p>
          </div>

          <div className="bg-white/15 border border-white/25 backdrop-blur-sm rounded-2xl p-4 shrink-0 min-w-[130px] text-center">
            <span className="block text-[10px] uppercase font-bold tracking-wider text-emerald-105 mb-1">Points For Order</span>
            <span className="block text-2xl font-black text-amber-300">🌱 {ecoPointsEarned} pts</span>
          </div>
        </div>
      </div>

      {/* 1. Packaging upgrades */}
      <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-3xl p-6">
        <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider mb-4 flex items-center">
          <Leaf className="w-4 h-4 mr-1.5 text-emerald-500" />
          1. Choose Packaging Material
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {packagingOptions.map((opt) => {
            const isSelected = packagingChoice === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setPackagingChoice(opt.id)}
                className={`flex flex-col justify-between items-start text-left p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-50/50 border-emerald-500 dark:bg-emerald-950/20 dark:border-emerald-700'
                    : 'bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-855 border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex justify-between items-center w-full mb-1">
                  <span className="text-2xl">{opt.icon}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                     isSelected 
                       ? 'bg-emerald-500 text-white' 
                       : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  }`}>
                    {opt.pointsBonus}
                  </span>
                </div>
                <div className="mt-2">
                  <span className="block text-xs font-bold text-slate-800 dark:text-slate-100">{opt.label}</span>
                  <span className="block text-[10px] text-slate-400 mt-0.5 leading-snug">{opt.description}</span>
                </div>
                <span className="block text-xs font-extrabold text-slate-800 dark:text-slate-300 mt-3">
                  {opt.cost === 0 ? 'Free' : `+₹${opt.cost}`}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Shipping/Logistics configuration */}
      <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-3xl p-6">
        <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider mb-4 flex items-center">
          <Truck className="w-4 h-4 mr-1.5 text-emerald-500" />
          2. Select Delivery Mode
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {deliveryOptions.map((opt) => {
            const isSelected = deliveryMethod === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setDeliveryMethod(opt.id)}
                className={`flex flex-col justify-between items-start text-left p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-50/50 border-emerald-500 dark:bg-emerald-950/20 dark:border-emerald-700'
                    : 'bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-855 border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex justify-between items-center w-full mb-1">
                  <span className="text-2xl">{opt.icon}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    isSelected 
                      ? 'bg-emerald-500 text-white' 
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  }`}>
                    {opt.pointsBonus}
                  </span>
                </div>
                <div className="mt-2 text-wrap">
                  <span className="block text-xs font-bold text-slate-800 dark:text-slate-100">{opt.label}</span>
                  <span className="block text-[9px] text-slate-400 mt-0.5 leading-snug">{opt.description}</span>
                </div>
                <span className="block text-xs font-extrabold text-slate-800 dark:text-slate-300 mt-3">
                  {opt.cost === 0 ? 'Free' : `+₹${opt.cost}`}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Composting & Soil Enrichment Program */}
      <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-3xl p-5">
        <label className="flex items-start cursor-pointer select-none">
          <input
            type="checkbox"
            checked={offsetCarbon}
            onChange={(e) => setOffsetCarbon(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-500 focus:ring-emerald-500 shrink-0 cursor-pointer"
          />
          <div className="ml-3">
            <span className="flex items-center text-xs md:text-sm font-bold text-slate-800 dark:text-slate-100">
              <Gift className="w-4 h-4 mr-1 text-emerald-500" />
              Round up for composting & organic farming (+₹10 donation)
            </span>
            <span className="block text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Donate ₹10 to support local organic composting and agricultural soil enrichment programs. We will match your donation to restore nutrient cycles, and you receive +20 bonus Eco-Points.
            </span>
          </div>
        </label>
      </div>
    </div>
  );
}
