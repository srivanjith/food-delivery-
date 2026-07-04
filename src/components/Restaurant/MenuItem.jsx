import React from 'react';
import { useCart } from '../../context/CartContext';
import EcoBadge from '../Common/EcoBadge';
import { ShoppingCart, Leaf, Star, Sparkles, Plus, Minus } from 'lucide-react';

export default function MenuItem({ item }) {
  const { cartItems, addItem, updateQuantity } = useCart();

  const cartItem = cartItems.find((i) => i.id === item.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const handleAdd = () => {
    addItem(item);
  };

  const handleIncrement = () => {
    updateQuantity(item.id, quantity + 1);
  };

  const handleDecrement = () => {
    updateQuantity(item.id, quantity - 1);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 flex flex-col md:flex-row gap-5 hover:shadow-md transition-all duration-300 font-sans">
      
      {/* Left/Top: Image & Indicators */}
      <div className="relative w-full md:w-40 h-40 md:h-auto rounded-2xl overflow-hidden bg-slate-105 shrink-0">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
        />
        {item.popular && (
          <div className="absolute top-2.5 left-2.5 bg-amber-500 text-white font-extrabold text-[9px] px-2 py-0.5 rounded-lg flex items-center shadow uppercase tracking-wider">
            <Sparkles className="w-2.5 h-2.5 mr-0.5" />
            Popular
          </div>
        )}
      </div>

      {/* Right/Bottom: Dish details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Header row */}
          <div className="flex justify-between items-start">
            <div>
              <h4 className="text-base font-bold text-slate-850 dark:text-white flex items-center">
                {item.name}
                {item.vegan && (
                  <span className="p-0.5 bg-emerald-50 dark:bg-emerald-950 text-emerald-650 dark:text-emerald-400 rounded-md ml-1.5" title="Vegan">
                    <Leaf className="w-3.5 h-3.5 fill-emerald-500" />
                  </span>
                )}
              </h4>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {/* Eco Score badge */}
                <EcoBadge type="score" value={item.ecoScore} />
                {/* Carbon footprint */}
                <EcoBadge type="carbon" value={item.carbonFootprint} />
                
                {/* Organic / Local tags */}
                {item.organic && <span className="text-[9px] font-bold bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300 px-2 py-0.5 rounded">Organic</span>}
                {item.localSourced && <span className="text-[9px] font-bold bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-300 px-2 py-0.5 rounded">Local</span>}
              </div>
            </div>

            {/* Rating */}
            {item.rating && (
              <div className="flex items-center text-xs font-bold text-slate-700 dark:text-slate-350 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-lg">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 mr-1" />
                {item.rating}
              </div>
            )}
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Price & Cart Add Button */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-805 flex items-center justify-between">
          <span className="text-lg font-black text-slate-800 dark:text-white">
            ₹{item.price}
          </span>

          {quantity > 0 ? (
            <div className="flex items-center space-x-3 bg-emerald-500 text-white rounded-xl px-2 py-1 shadow-md shadow-emerald-500/10">
              <button
                onClick={handleDecrement}
                className="p-1 hover:bg-emerald-600 rounded-lg transition-colors cursor-pointer"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-sm font-extrabold w-4 text-center">{quantity}</span>
              <button
                onClick={handleIncrement}
                className="p-1 hover:bg-emerald-600 rounded-lg transition-colors cursor-pointer"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAdd}
              className="flex items-center space-x-1.5 px-4.5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-all cursor-pointer"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Add to Cart</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
