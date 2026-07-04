import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import CartItem from '../components/Cart/CartItem';
import CarbonImpactTracker from '../components/Cart/CarbonImpactTracker';
import { ArrowLeft, Trash2, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Cart() {
  const {
    cartItems,
    clearCart,
    subtotal,
    packagingChoice,
    packagingCharge,
    deliveryMethod,
    deliveryCharge,
    gst,
    offsetFee,
    grandTotal,
    offsetCarbon
  } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center font-sans text-center px-4">
        <span className="text-6xl animate-bounce-slow">🍃</span>
        <h2 className="text-2xl font-black text-slate-800 dark:text-white mt-4">Your Sustainable Cart is Empty</h2>
        <p className="text-sm text-slate-500 mt-2 max-w-sm">
          Browse our organic and zero-waste menus to order meals with tracked carbon footprint statistics.
        </p>
        <Link
          to="/"
          className="mt-6 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/10 transition-all hover:shadow-emerald-500/25 cursor-pointer"
        >
          Explore Restaurants
        </Link>
      </div>
    );
  }

  const packagingName = {
    compostable: 'Compostable Paper',
    seaweed: 'Seaweed Biodegradable',
    reusable: 'Reusable Bento Box'
  }[packagingChoice];

  const deliveryName = {
    bicycle: 'Bicycle Courier',
    ev: 'Electric Vehicle',
    drone: 'Solar Drone'
  }[deliveryMethod];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/"
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-500 hover:text-emerald-500 dark:text-slate-400 dark:hover:text-emerald-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Ordering</span>
          </Link>
          
          <button
            onClick={clearCart}
            id="clear-cart-btn"
            className="inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Cart</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Cart items & Environmental Tracker options */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Cart Items list */}
            <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-3xl p-6 space-y-4">
              <h3 className="text-base font-bold text-slate-850 dark:text-white">
                Review Items ({cartItems.reduce((acc, item) => acc + item.quantity, 0)})
              </h3>
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
            </div>

            {/* Environmental Tracker adjustments */}
            <CarbonImpactTracker />

          </div>

          {/* Right Column: Checkout Billing summary */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
              <h3 className="text-base font-bold text-slate-850 dark:text-white mb-6 pb-3 border-b border-slate-100 dark:border-slate-800">
                Eco-Billing Summary
              </h3>

              <div className="space-y-4 text-xs font-semibold text-slate-600 dark:text-slate-400">
                
                {/* Subtotal */}
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-extrabold text-slate-805 dark:text-slate-200">₹{subtotal}</span>
                </div>

                {/* Packaging Fee */}
                <div className="flex justify-between">
                  <div>
                    <span>Eco-Packaging Upgrades</span>
                    <span className="block text-[10px] text-slate-400 font-normal">{packagingName}</span>
                  </div>
                  <span className="font-extrabold text-slate-805 dark:text-slate-200">
                    {packagingCharge === 0 ? 'Free' : `₹${packagingCharge}`}
                  </span>
                </div>

                {/* Delivery Fee */}
                <div className="flex justify-between">
                  <div>
                    <span>Sustainable Logistics Fee</span>
                    <span className="block text-[10px] text-slate-400 font-normal">{deliveryName}</span>
                  </div>
                  <span className="font-extrabold text-slate-855 dark:text-slate-200">₹{deliveryCharge}</span>
                </div>

                {/* GST */}
                <div className="flex justify-between">
                  <span>GST (5%)</span>
                  <span className="font-extrabold text-slate-855 dark:text-slate-205">₹{gst}</span>
                </div>

                {/* Reforestation round up offset */}
                {offsetCarbon && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                    <span>Reforestation Contribution</span>
                    <span>₹{offsetFee}</span>
                  </div>
                )}

                {/* Divider */}
                <hr className="border-slate-100 dark:border-slate-800" />

                {/* Grand Total */}
                <div className="flex justify-between text-base font-black text-slate-805 dark:text-white pt-2">
                  <span>Grand Total</span>
                  <span>₹{grandTotal}</span>
                </div>

              </div>

              {/* Bento Box Warning */}
              {packagingChoice === 'reusable' && (
                <div className="mt-5 p-3.5 bg-teal-50 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-900 rounded-2xl text-[10px] text-teal-800 dark:text-teal-300 leading-normal">
                  💡 <strong>Bento Box Refundable deposit</strong> includes ₹50 per container. This will be credited back instantly as Eco-Points or refunded when the courier retrieves it on your next delivery.
                </div>
              )}

              {/* Secure Checkout Button */}
              <Link
                to="/checkout"
                id="checkout-btn"
                className="w-full mt-6 flex items-center justify-center space-x-2 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/25 transition-all cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              {/* Trust Callout */}
              <div className="mt-4 flex items-center justify-center text-[10px] font-bold text-slate-400 dark:text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-500" />
                Carbon-Neutral Checkout Guarantee
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
