import React from 'react';
import { Flame, Trees, RefreshCw, ChevronRight } from 'lucide-react';

export default function PromotionalBanners({ onSelectCategory }) {
  const promotions = [
    {
      id: 'promo-1',
      title: 'Surplus Food Rescue',
      description: 'Local bakeries and cafes sell delicious, unsold fresh food at 60% off daily. Prevent commercial food waste!',
      buttonText: 'Rescue Food',
      icon: <Flame className="w-6 h-6 text-amber-500" />,
      color: 'from-amber-500/10 to-amber-600/5 border-amber-500/20 dark:border-amber-900/30 text-amber-900 dark:text-amber-300',
      btnColor: 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/10',
      category: 'Surplus Rescue'
    },
    {
      id: 'promo-2',
      title: 'Returnable Bento Box',
      description: 'Opt for reusable stainless steel containers. Refundable deposit returned instantly on your next delivery.',
      buttonText: 'Learn More',
      icon: <RefreshCw className="w-6 h-6 text-teal-500" />,
      color: 'from-teal-500/10 to-teal-600/5 border-teal-500/20 dark:border-teal-900/30 text-teal-900 dark:text-teal-300',
      btnColor: 'bg-teal-500 hover:bg-teal-600 shadow-teal-500/10',
      category: 'Zero Waste'
    },
    {
      id: 'promo-3',
      title: 'Plant a Real Tree',
      description: 'Round up your order total at checkout to donate. Watch your tree grow in your private dashboard forest.',
      buttonText: 'Grow Forest',
      icon: <Trees className="w-6 h-6 text-emerald-500 animate-sway" />,
      color: 'from-emerald-500/10 to-emerald-600/5 border-emerald-500/20 dark:border-emerald-900/30 text-emerald-900 dark:text-emerald-300',
      btnColor: 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/10',
      category: 'Organic'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 font-sans">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {promotions.map((promo) => (
          <div
            key={promo.id}
            className={`border rounded-2xl p-6 bg-gradient-to-br ${promo.color} flex flex-col justify-between items-start gap-4 transition-all duration-300 hover:shadow-lg`}
          >
            <div className="space-y-2">
              <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl w-fit shadow-sm">
                {promo.icon}
              </div>
              <h4 className="text-lg font-bold text-slate-800 dark:text-white mt-2">
                {promo.title}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {promo.description}
              </p>
            </div>
            
            <button
              onClick={() => onSelectCategory && onSelectCategory(promo.category)}
              className={`flex items-center space-x-1 px-4 py-2 text-xs font-bold text-white rounded-xl shadow-md transition-all cursor-pointer ${promo.btnColor}`}
            >
              <span>{promo.buttonText}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
