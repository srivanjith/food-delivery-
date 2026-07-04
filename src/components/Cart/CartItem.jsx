import React from 'react';
import { useCart } from '../../context/CartContext';
import { Minus, Plus, Trash2 } from 'lucide-react';

export default function CartItem({ item }) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl gap-4 font-sans">
      
      {/* Item Image & Details */}
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        <img
          src={item.image}
          alt={item.name}
          className="w-16 h-16 rounded-xl object-cover bg-slate-100 shrink-0"
        />
        <div className="min-w-0">
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">
            {item.name}
          </h4>
          <span className="text-xs text-slate-500 font-bold block mt-0.5 md:hidden">
            ₹{item.price}
          </span>
        </div>
      </div>

      {/* Desktop Price */}
      <div className="hidden md:block text-sm font-black text-slate-805 dark:text-slate-200 w-16">
        ₹{item.price}
      </div>

      {/* Quantity Adjuster */}
      <div className="flex items-center space-x-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl px-2 py-1">
        <button
          onClick={() => updateQuantity(item.id, item.quantity - 1)}
          className="p-1 text-slate-500 hover:text-slate-800 dark:hover:text-white rounded transition-colors cursor-pointer"
          aria-label="Decrease quantity"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <span className="text-xs font-black text-slate-800 dark:text-slate-200 w-4 text-center">
          {item.quantity}
        </span>
        <button
          onClick={() => updateQuantity(item.id, item.quantity + 1)}
          className="p-1 text-slate-500 hover:text-slate-800 dark:hover:text-white rounded transition-colors cursor-pointer"
          aria-label="Increase quantity"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Total item price & delete */}
      <div className="flex items-center space-x-3">
        <span className="text-sm font-black text-slate-800 dark:text-white w-16 text-right">
          ₹{item.price * item.quantity}
        </span>
        
        <button
          onClick={() => removeItem(item.id)}
          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors cursor-pointer"
          title="Remove item"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
