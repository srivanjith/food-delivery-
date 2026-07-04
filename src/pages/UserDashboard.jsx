import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';
import VirtualForest from '../components/Dashboard/VirtualForest';
import EmissionAnalytics from '../components/Dashboard/EmissionAnalytics';
import EcoBadge from '../components/Common/EcoBadge';
import { User, MapPin, ClipboardList, Settings, Trees, ShieldCheck, Trash2 } from 'lucide-react';

export default function UserDashboard() {
  const { user, removeAddress } = useAuth();
  const { orders } = useApp();

  if (!user) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center font-sans text-center px-4">
        <span className="text-5xl">🔐</span>
        <h2 className="text-2xl font-black text-slate-800 dark:text-white mt-4">Access Denied</h2>
        <p className="text-sm text-slate-500 mt-2 max-w-sm">
          Please login to view your personal dashboard, track virtual forests, and inspect carbon savings invoices.
        </p>
        <Link
          to="/auth"
          className="mt-6 px-6 py-3 bg-emerald-500 text-white font-bold rounded-2xl shadow transition-all"
        >
          Sign In Now
        </Link>
      </div>
    );
  }

  // Format date strings
  const formatDate = (isoString) => {
    const d = new Date(isoString);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Profile Card Header */}
        <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center text-center md:text-left gap-4">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-20 h-20 rounded-full object-cover border-2 border-emerald-500 shadow-md"
            />
            <div>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white">{user.name}</h1>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 text-[10px] font-bold uppercase rounded-md tracking-wider">
                  Verified Eco-Citizen
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{user.email}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-3 text-xs text-slate-500">
                <span className="flex items-center text-emerald-605 dark:text-emerald-400 font-bold">
                  🌱 {user.ecoPoints} Eco-Points
                </span>
                <span>•</span>
                <span className="flex items-center text-slate-655 dark:text-slate-350">
                  🌲 {user.treesPlantedCount} Real Trees Planted
                </span>
              </div>
            </div>
          </div>

          <div className="flex space-x-2">
            <button className="px-4 py-2 border border-slate-202 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-655 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850 cursor-pointer">
              Edit Profile
            </button>
            <button className="p-2 border border-slate-202 dark:border-slate-800 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850 cursor-pointer">
              <Settings className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

        {/* 1. Virtual Forest Reforestation Panel */}
        <VirtualForest ecoPoints={user.ecoPoints} treesPlanted={user.treesPlantedCount} />

        {/* 2. Emissions & Circular Economy Analytics */}
        <EmissionAnalytics orders={orders} />

        {/* 3. Address Book & Order History Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Saved addresses - left column */}
          <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-sm font-black text-slate-850 dark:text-white uppercase tracking-wider flex items-center">
              <MapPin className="w-4 h-4 mr-1.5 text-emerald-500" />
              Saved Addresses
            </h3>
            
            <div className="space-y-3">
              {user.savedAddresses && user.savedAddresses.length === 0 ? (
                <div className="text-center py-4 text-xs text-slate-400">
                  No addresses saved yet.
                </div>
              ) : (
                user.savedAddresses && user.savedAddresses.map(addr => (
                  <div key={addr.id} className="p-3 bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 rounded-2xl flex justify-between gap-3">
                    <div className="min-w-0">
                      <span className="block text-xs font-bold text-slate-750 dark:text-white uppercase tracking-wider">{addr.label}</span>
                      <span className="block text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-normal truncate max-w-[200px]" title={addr.address}>
                        {addr.address}
                      </span>
                    </div>
                    <button
                      onClick={() => removeAddress(addr.id)}
                      className="p-1 text-slate-400 hover:text-red-500 rounded self-center shrink-0 cursor-pointer"
                      title="Delete address"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Past Orders checklist - right column */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-3xl p-6">
            <h3 className="text-sm font-black text-slate-850 dark:text-white uppercase tracking-wider mb-6 flex items-center">
              <ClipboardList className="w-4 h-4 mr-1.5 text-emerald-500" />
              Dining Order History
            </h3>

            {orders.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs">
                You haven't ordered anything yet. Start ordering sustainable meals!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                      <th className="pb-3 pr-2">Date / ID</th>
                      <th className="pb-3 pr-2">Kitchen</th>
                      <th className="pb-3 pr-2">Offset Details</th>
                      <th className="pb-3 pr-2">Total Invoice</th>
                      <th className="pb-3 pr-2">Status</th>
                      <th className="pb-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-semibold text-slate-700 dark:text-slate-300">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/20">
                        <td className="py-4.5 pr-2">
                          <span className="block text-slate-800 dark:text-white font-bold">{order.id}</span>
                          <span className="block text-[10px] text-slate-400 font-normal">{formatDate(order.date)}</span>
                        </td>
                        <td className="py-4.5 pr-2">
                          <span className="block text-slate-800 dark:text-white font-bold">{order.restaurantName}</span>
                          <span className="block text-[10px] text-slate-400 font-normal">{order.items ? order.items.length : 0} items</span>
                        </td>
                        <td className="py-4.5 pr-2">
                          <div className="flex flex-col gap-0.5">
                            <span className="block text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">Saved {order.carbonSaved}g CO₂</span>
                            {order.treesPlanted > 0 && <span className="block text-[9px] text-teal-600 dark:text-teal-400">🌲 planted x{order.treesPlanted}</span>}
                          </div>
                        </td>
                        <td className="py-4.5 pr-2 font-black text-slate-850 dark:text-white">
                          ₹{order.total}
                        </td>
                        <td className="py-4.5 pr-2">
                          <span className={`inline-flex px-2 py-0.5 text-[9px] font-bold uppercase rounded-md ${
                            order.status === 'Delivered'
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
                              : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 animate-pulse-slow'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-4.5 text-right">
                          <Link
                            to={`/order-tracking/${order.id}`}
                            className="inline-flex px-2.5 py-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[10px] rounded-lg shadow-sm transition-colors"
                          >
                            Track Logistics
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
