import React from 'react';
import { useCart } from '../../context/CartContext';
import EcoBadge from '../Common/EcoBadge';
import { Flame, ShoppingCart, Sparkles } from 'lucide-react';

export default function SurplusRescue({ deals = [] }) {
  const { addItem, cartItems } = useCart();

  const handleAdd = (deal) => {
    // Map deal format to standard menu item format
    const item = {
      id: deal.id,
      restaurantId: deal.restaurantId,
      name: deal.name,
      price: deal.price,
      image: deal.image,
      carbonFootprint: deal.carbonFootprint || 120,
      ecoScore: deal.ecoScore || 'A+'
    };
    addItem(item);
  };

  const getCartQuantity = (id) => {
    const existing = cartItems.find(item => item.id === id);
    return existing ? existing.quantity : 0;
  };

  if (deals.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <span className="p-2 bg-amber-100 dark:bg-amber-950 text-amber-500 rounded-xl">
            <Flame className="w-5 h-5 animate-pulse" />
          </span>
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 font-sans">
              Surplus Rescue Hub
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Fresh food rescue: Save up to 70% and prevent high-quality meals from going to waste.
            </p>
          </div>
        </div>
        <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-900">
          Act Fast! Limited Stock
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {deals.map((deal) => {
          const cartQty = getCartQuantity(deal.id);
          
          return (
            <div
              key={deal.id}
              className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              {/* Image & Badges */}
              <div className="relative h-48 overflow-hidden bg-slate-105">
                <img
                  src={deal.image}
                  alt={deal.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                
                {/* Score badge */}
                <div className="absolute top-3 left-3">
                  <EcoBadge type="score" value={deal.ecoScore} />
                </div>

                {/* Percentage Discount Overlay */}
                <div className="absolute bottom-3 right-3 bg-amber-550 text-white font-extrabold text-xs px-2.5 py-1 rounded-xl shadow-md flex items-center">
                  <Sparkles className="w-3 h-3 mr-1" />
                  {Math.round(((deal.originalPrice - deal.price) / deal.originalPrice) * 100)}% OFF
                </div>
              </div>

              {/* Deal Info */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-550 block">
                    {deal.restaurantName}
                  </span>
                  <h4 className="text-base font-bold text-slate-800 dark:text-slate-100 mt-0.5 line-clamp-1">
                    {deal.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2">
                    {deal.description}
                  </p>
                </div>

                {/* Footprint badge */}
                <div className="mt-4 flex flex-wrap gap-2">
                  <EcoBadge type="carbon" value={deal.carbonFootprint} />
                  <span className="text-[10px] font-bold text-red-500 bg-red-50 dark:bg-red-950/30 px-2 py-0.5 rounded">
                    Only {deal.quantityLeft} left
                  </span>
                </div>

                {/* Pricing & Add Button */}
                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-baseline space-x-1.5">
                    <span className="text-lg font-black text-slate-800 dark:text-white">
                      ₹{deal.price}
                    </span>
                    <span className="text-xs text-slate-400 line-through">
                      ₹{deal.originalPrice}
                    </span>
                  </div>

                  <button
                    onClick={() => handleAdd(deal)}
                    disabled={cartQty >= deal.quantityLeft}
                    className={`flex items-center space-x-1.5 px-4.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                      cartQty >= deal.quantityLeft
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed dark:bg-slate-800'
                        : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-md shadow-emerald-500/10'
                    }`}
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>{cartQty > 0 ? `Added (${cartQty})` : 'Rescue Meal'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
