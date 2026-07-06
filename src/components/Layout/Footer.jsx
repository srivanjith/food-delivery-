import React from 'react';
import { Leaf, Heart, Globe, Footprints } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 font-sans">
      {/* Community Impact Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-center md:text-left gap-4">
          <div className="flex items-center space-x-3 justify-center md:justify-start">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
              <Globe className="w-6 h-6 animate-pulse-slow" />
            </div>
            <div>
              <h4 className="font-bold text-base md:text-lg">Our Community's Green Footprint</h4>
              <p className="text-emerald-100 text-xs md:text-sm">Every meal ordered helps heal the planet.</p>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-6 md:gap-10">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-2 text-center min-w-[120px]">
              <div className="text-emerald-400 font-extrabold text-lg md:text-xl flex items-center justify-center">
                <Footprints className="w-4.5 h-4.5 mr-1" />
                42,822
              </div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-emerald-200">Green Deliveries</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-2 text-center min-w-[120px]">
              <div className="text-teal-400 font-extrabold text-lg md:text-xl flex items-center justify-center">
                🌱 1,284,530
              </div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-teal-200">Points Rewarded</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-emerald-500 rounded-lg text-white">
                <Leaf className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">EcoEats</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Pioneering sustainable, low-emission food delivery. Partnering exclusively with local eco-certified kitchens and organic growers.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Sustainable Sourcing</h5>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#/" className="hover:text-emerald-400 transition-colors">100% Organic Farms</a></li>
              <li><a href="#/" className="hover:text-emerald-400 transition-colors">Zero-Waste Kitchen Standards</a></li>
              <li><a href="#/" className="hover:text-emerald-400 transition-colors">Self-Pickup Rewards</a></li>
              <li><a href="#/" className="hover:text-emerald-400 transition-colors">Eco-Packaging Materials</a></li>
            </ul>
          </div>

          {/* Delivery & Tech */}
          <div>
            <h5 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Green Fleet</h5>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#/" className="hover:text-emerald-400 transition-colors">Bicycle Couriers</a></li>
              <li><a href="#/" className="hover:text-emerald-400 transition-colors">Electric Vehicles</a></li>
              <li><a href="#/" className="hover:text-emerald-400 transition-colors">Solar Drone Delivery</a></li>
              <li><a href="#/" className="hover:text-emerald-400 transition-colors">Low Emission Routing</a></li>
            </ul>
          </div>

          {/* Contact / Newsletter */}
          <div>
            <h5 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Join the Movement</h5>
            <p className="text-sm text-slate-400 mb-4 leading-relaxed">Subscribe to get zero-waste recipes, green dining tips, and exclusive discounts.</p>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter email"
                className="w-full px-3 py-2 bg-slate-800 text-white rounded-l-lg border border-slate-700 focus:outline-none focus:border-emerald-500 text-sm"
              />
              <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-r-lg text-sm transition-colors cursor-pointer">
                Join
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-8 border-slate-800" />

        {/* Bottom Area */}
        <div className="flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 gap-4 font-sans">
          <p>© {new Date().getFullYear()} EcoEats Technologies Pvt Ltd. All rights reserved.</p>
          <p className="flex items-center">
            Made with <Heart className="w-3 h-3 text-red-500 mx-1 animate-pulse" /> for a healthier planet.
          </p>
        </div>
      </div>
    </footer>
  );
}
