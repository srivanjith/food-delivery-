import React from 'react';
import ProgressBar from '../Common/ProgressBar';
import { Footprints, Trash2, ShieldCheck, Flame, Compass } from 'lucide-react';

export default function EmissionAnalytics({ orders = [] }) {
  // Calculate analytics metrics from user orders
  const totalCarbonSaved = orders.reduce((acc, o) => acc + (o.carbonSaved || 0), 0);
  const totalCarbonFootprint = orders.reduce((acc, o) => acc + (o.carbonFootprint || 0), 0);
  const totalOrders = orders.length;

  const surplusMealsRescued = orders.reduce((acc, o) => {
    // Count items starting with 'deal-' (surplus deals)
    const surplusCount = o.items ? o.items.filter(item => item.id.startsWith('deal-')).reduce((sum, item) => sum + item.quantity, 0) : 0;
    return acc + surplusCount;
  }, 0);

  const reusableContainersUsed = orders.filter(o => o.packagingChoice === 'Reusable Bento Box').length;
  
  // Calculate average footprint per order
  const avgFootprint = totalOrders > 0 ? Math.round(totalCarbonFootprint / totalOrders) : 0;
  const avgCarbonSaved = totalOrders > 0 ? Math.round(totalCarbonSaved / totalOrders) : 0;

  // Let's compute a simple emission share breakdown (Food vs Packaging vs Delivery Transport)
  // Food emissions are generally ~75% of sustainable meals. Packaging: ~10%. Delivery: ~15%.
  const foodEmissionsPercent = totalCarbonFootprint > 0 ? 75 : 0;
  const packagingEmissionsPercent = totalCarbonFootprint > 0 ? 10 : 0;
  const deliveryEmissionsPercent = totalCarbonFootprint > 0 ? 15 : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
      
      {/* Carbon Ticker & Savings Summary */}
      <div className="lg:col-span-2 glass-card p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <span className="p-2 bg-emerald-105 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <Footprints className="w-5 h-5" />
            </span>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 font-sans">My Carbon Footprint Analytics</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-slate-50 dark:bg-slate-850 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
              <span className="block text-2xl font-black text-slate-800 dark:text-slate-100">
                {(totalCarbonFootprint / 1000).toFixed(1)} kg
              </span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mt-1">Total Emitted</span>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-950/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-900/40">
              <span className="block text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {(totalCarbonSaved / 1000).toFixed(1)} kg
              </span>
              <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider block mt-1">CO₂ Offset Savings</span>
            </div>
            <div className="bg-teal-50 dark:bg-teal-950/20 p-4 rounded-xl border border-teal-100 dark:border-teal-900/40 col-span-2 md:col-span-1">
              <span className="block text-2xl font-black text-teal-600 dark:text-teal-400">
                {totalOrders > 0 ? Math.round((totalCarbonSaved / (totalCarbonSaved + totalCarbonFootprint)) * 100) : 0}%
              </span>
              <span className="text-[10px] font-bold text-teal-800 dark:text-teal-300 uppercase tracking-wider block mt-1">Offset Efficiency</span>
            </div>
          </div>
        </div>

        {/* Emission share progress metrics */}
        <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Carbon Source Breakdown</h4>
          
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-655 dark:text-slate-400 mb-1">
              <span>Kitchen Prep & Sourcing</span>
              <span>{foodEmissionsPercent}%</span>
            </div>
            <ProgressBar value={foodEmissionsPercent} max={100} color="emerald" className="h-2" />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-655 dark:text-slate-400 mb-1">
              <span>Packaging Footprint</span>
              <span>{packagingEmissionsPercent}%</span>
            </div>
            <ProgressBar value={packagingEmissionsPercent} max={100} color="teal" className="h-2" />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-655 dark:text-slate-400 mb-1">
              <span>Delivery Transport Logistics</span>
              <span>{deliveryEmissionsPercent}%</span>
            </div>
            <ProgressBar value={deliveryEmissionsPercent} max={100} color="blue" className="h-2" />
          </div>
        </div>
      </div>

      {/* Circular Economy Stats Card */}
      <div className="glass-card p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <span className="p-2 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <Compass className="w-5 h-5" />
            </span>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 font-sans">Circular Economy</h3>
          </div>
          <p className="text-xs text-slate-500 mb-6">
            EcoEats promotes a circular economy through surplus food rescue programs and reusable, returnable delivery containers.
          </p>

          <div className="space-y-4">
            {/* Surplus rescues */}
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-100 dark:border-slate-800">
              <div className="flex items-center">
                <span className="p-2 bg-amber-100 dark:bg-amber-950 text-amber-500 rounded-lg mr-3">
                  <Flame className="w-4 h-4" />
                </span>
                <div>
                  <span className="block text-sm font-bold text-slate-800 dark:text-slate-200">Surplus Meals Rescued</span>
                  <span className="text-[10px] text-slate-400">Prevented food waste</span>
                </div>
              </div>
              <span className="text-lg font-extrabold text-amber-600 dark:text-amber-400">x{surplusMealsRescued}</span>
            </div>

            {/* Reusable container */}
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-100 dark:border-slate-800">
              <div className="flex items-center">
                <span className="p-2 bg-teal-100 dark:bg-teal-950 text-teal-500 rounded-lg mr-3">
                  <Trash2 className="w-4 h-4" />
                </span>
                <div>
                  <span className="block text-sm font-bold text-slate-800 dark:text-slate-200">Reusable Containers</span>
                  <span className="text-[10px] text-slate-400">Stainless Bento box orders</span>
                </div>
              </div>
              <span className="text-lg font-extrabold text-teal-600 dark:text-teal-400">x{reusableContainersUsed}</span>
            </div>
          </div>
        </div>

        {/* Circular certificate */}
        <div className="mt-6 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center">
          <ShieldCheck className="w-5 h-5 text-emerald-500 mr-2.5 shrink-0" />
          <span className="text-[10px] md:text-xs text-emerald-800 dark:text-emerald-300 font-semibold leading-snug">
            {totalOrders > 0 
              ? 'EcoEats Certified Waste Warrior. Keep up the clean dining!' 
              : 'Start ordering to unlock your green certificates.'}
          </span>
        </div>
      </div>

    </div>
  );
}
