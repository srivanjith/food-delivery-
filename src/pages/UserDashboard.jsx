import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';
import { MapPin, ClipboardList, Settings, Trash2, Edit, Plus, Camera } from 'lucide-react';
import Modal from '../components/Common/Modal';

export default function UserDashboard() {
  const { user, removeAddress, addAddress, updateProfile } = useAuth();
  const { orders } = useApp();

  const [editingAddressId, setEditingAddressId] = useState(null);
  const [editLabel, setEditLabel] = useState('');
  const [editValue, setEditValue] = useState('');
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newValue, setNewValue] = useState('');

  // Profile Edit State
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editAvatar, setEditAvatar] = useState('');

  const handleOpenEditProfile = () => {
    setEditName(user?.name || '');
    setEditAvatar(user?.avatar || '');
    setIsEditProfileOpen(true);
  };

  const handleSaveProfile = async () => {
    if (!editName.trim()) return;
    const success = await updateProfile({ name: editName, avatar: editAvatar });
    if (success) {
      setIsEditProfileOpen(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('File is too large! Please select an image under 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!user) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center font-sans text-center px-4">
        <span className="text-5xl">🔐</span>
        <h2 className="text-2xl font-black text-slate-800 dark:text-white mt-4">Access Denied</h2>
        <p className="text-sm text-slate-505 mt-2 max-w-sm">
          Please login to view your personal dashboard, track rewards, and inspect discount invoices.
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

  const getEcoLevel = (points) => {
    if (points >= 1200) return { name: 'Eco Legend 👑', color: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900/30' };
    if (points >= 600) return { name: 'Gold User 🥇', color: 'bg-amber-50 dark:bg-amber-950/40 text-amber-650 dark:text-amber-400 border border-amber-200 dark:border-amber-900/30' };
    if (points >= 200) return { name: 'Silver User 🥈', color: 'bg-slate-100 dark:bg-slate-800 text-slate-650 dark:text-slate-200 border border-slate-200 dark:border-slate-700' };
    return { name: 'Bronze User 🥉', color: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-650 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30' };
  };

  const getNextLevelInfo = (points) => {
    if (points >= 1200) return "Max Level!";
    if (points >= 600) return `${1200 - points} pts to Eco Legend 👑`;
    if (points >= 200) return `${600 - points} pts to Gold User 🥇`;
    return `${200 - points} pts to Silver User 🥈`;
  };

  const ecoLevel = getEcoLevel(user.ecoPoints || 0);

  const startEditingAddress = (addr) => {
    setEditingAddressId(addr.id);
    setEditLabel(addr.label);
    setEditValue(addr.address);
  };

  const handleSaveEditAddress = (addressId) => {
    if (!editLabel.trim() || !editValue.trim()) return;
    const updated = user.savedAddresses.map(addr =>
      addr.id === addressId ? { ...addr, label: editLabel, address: editValue } : addr
    );
    updateProfile({ savedAddresses: updated });
    setEditingAddressId(null);
  };

  const handleAddNewAddress = () => {
    if (!newLabel.trim() || !newValue.trim()) return;
    addAddress(newLabel, newValue);
    setIsAddingAddress(false);
  };

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
            <div className="relative group cursor-pointer shrink-0" onClick={handleOpenEditProfile} title="Change Profile Photo">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-emerald-500 shadow-md group-hover:brightness-90 transition-all duration-300"
              />
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Camera className="w-5 h-5 text-white" />
              </div>
            </div>
            <div>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white flex items-center gap-1">
                  {user.name}
                </h1>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 text-[10px] font-bold uppercase rounded-md tracking-wider">
                  Verified Eco-Citizen
                </span>
                <span className={`px-2 py-0.5 text-[10px] font-extrabold uppercase rounded-md tracking-wider border ${ecoLevel.color}`}>
                  {ecoLevel.name}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{user.email}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-3 text-xs text-slate-500">
                <span className="flex items-center text-emerald-605 dark:text-emerald-400 font-bold">
                  🌱 {user.ecoPoints} Eco-Points
                </span>
                <span className="text-slate-400 dark:text-slate-500 font-medium">
                  ({getNextLevelInfo(user.ecoPoints || 0)})
                </span>
              </div>
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => {
                const el = document.getElementById('address-book-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
            >
              Edit Addresses
            </button>
            <button 
              onClick={handleOpenEditProfile}
              className="px-4 py-2 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30 rounded-xl text-xs font-bold hover:bg-emerald-100 dark:hover:bg-emerald-900/50 cursor-pointer flex items-center gap-1.5"
            >
              <Edit className="w-3.5 h-3.5" />
              Edit Profile
            </button>
            <button className="p-2 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">
              <Settings className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

        {/* 1. Eco Points Loyalty & Rewards Card */}
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden font-sans">
          <div className="absolute right-0 top-0 w-40 h-40 bg-white/10 rounded-full filter blur-2xl" />
          <div className="absolute left-20 bottom-0 w-24 h-24 bg-white/5 rounded-full filter blur-xl" />
          
          <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <span className="text-[10px] bg-white/20 px-3 py-1 rounded-full uppercase font-bold tracking-wider">
                Loyalty Rewards Program
              </span>
              <h2 className="text-3xl font-black mt-3 flex items-center gap-2">
                <span>🌱 {user.ecoPoints} Points</span>
                <span className="text-xs bg-amber-400 text-slate-900 font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                  {ecoLevel.name.split(' ')[0]} User
                </span>
              </h2>
              <p className="text-xs text-emerald-100 mt-2 max-w-lg leading-relaxed font-sans">
                Save on every purchase! Select Self-Pickup or eco-packaging options to boost your rewards. Convert points to discounts at checkout (10 points = ₹1).
              </p>
            </div>
            
            <div className="bg-white/10 border border-white/25 backdrop-blur-md rounded-2xl p-4 shrink-0 min-w-[220px]">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-2">Rewards Tier Progress</h4>
              <div className="text-xs font-extrabold flex justify-between mb-1 text-emerald-50">
                <span>Level Status</span>
                <span>{getNextLevelInfo(user.ecoPoints || 0)}</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2 mt-1.5 overflow-hidden">
                <div 
                  className="bg-amber-400 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, (user.ecoPoints / 1200) * 100)}%` }} 
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10 text-xs">
            <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
              <span className="block font-black text-amber-350">🥉 Bronze User</span>
              <span className="block text-[10px] text-emerald-100 mt-0.5">Start level: &lt; 200 pts</span>
            </div>
            <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
              <span className="block font-black text-amber-355">🥈 Silver User</span>
              <span className="block text-[10px] text-emerald-100 mt-0.5">200 - 599 pts</span>
            </div>
            <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
              <span className="block font-black text-amber-355">🥇 Gold User</span>
              <span className="block text-[10px] text-emerald-100 mt-0.5">600 - 1199 pts</span>
            </div>
            <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
              <span className="block font-black text-amber-355">👑 Eco Legend</span>
              <span className="block text-[10px] text-emerald-100 mt-0.5">1200+ pts</span>
            </div>
          </div>
        </div>

        {/* 2. Address Book & Order History Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Saved addresses - left column */}
          <div id="address-book-section" className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-3xl p-6 space-y-4">
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
                  <div key={addr.id} className="p-3 bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 rounded-2xl space-y-2">
                    {editingAddressId === addr.id ? (
                      <div className="space-y-2 text-xs">
                        <input
                          type="text"
                          className="w-full px-2 py-1 border border-slate-250 dark:border-slate-750 bg-white dark:bg-slate-900 rounded-lg text-slate-800 dark:text-slate-100 font-sans"
                          value={editLabel}
                          onChange={(e) => setEditLabel(e.target.value)}
                          placeholder="Label (e.g. Home)"
                        />
                        <textarea
                          className="w-full p-2 border border-slate-250 dark:border-slate-750 bg-white dark:bg-slate-900 rounded-lg text-[11px] text-slate-800 dark:text-slate-100 font-sans"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          placeholder="Address details"
                          rows="2"
                        />
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => setEditingAddressId(null)}
                            className="px-2 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg font-bold text-[10px] cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveEditAddress(addr.id)}
                            className="px-2 py-1 bg-emerald-500 text-white rounded-lg font-bold text-[10px] cursor-pointer"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between gap-3">
                        <div className="min-w-0">
                          <span className="block text-xs font-bold text-slate-755 dark:text-white uppercase tracking-wider">{addr.label}</span>
                          <span className="block text-[11px] text-slate-550 dark:text-slate-400 mt-1 leading-normal break-words max-w-[200px]" title={addr.address}>
                            {addr.address}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1.5 shrink-0 self-center">
                          <button
                            onClick={() => startEditingAddress(addr)}
                            className="p-1 text-slate-400 hover:text-emerald-555 rounded cursor-pointer"
                            title="Edit address"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => removeAddress(addr.id)}
                            className="p-1 text-slate-400 hover:text-red-500 rounded cursor-pointer"
                            title="Delete address"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Add address control */}
            {!isAddingAddress ? (
              <button
                onClick={() => {
                  setIsAddingAddress(true);
                  setNewLabel('');
                  setNewValue('');
                }}
                className="w-full py-2 border border-dashed border-slate-205 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-600 rounded-2xl text-xs font-bold text-slate-500 hover:text-emerald-500 flex items-center justify-center gap-1 cursor-pointer transition-colors mt-2"
              >
                <Plus className="w-3.5 h-3.5" />
                Add New Address
              </button>
            ) : (
              <div className="p-3 bg-slate-50 dark:bg-slate-850 border border-dashed border-emerald-500/30 rounded-2xl space-y-2 text-xs mt-2">
                <span className="block font-bold text-slate-700 dark:text-slate-300">Add New Address</span>
                <input
                  type="text"
                  className="w-full px-2 py-1 border border-slate-205 dark:border-slate-750 bg-white dark:bg-slate-900 rounded-lg text-slate-805 dark:text-white"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="Label (e.g. Home)"
                />
                <textarea
                  className="w-full p-2 border border-slate-205 dark:border-slate-750 bg-white dark:bg-slate-900 rounded-lg text-[11px] text-slate-805 dark:text-white"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  placeholder="Address details"
                  rows="2"
                />
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setIsAddingAddress(false)}
                    className="px-2 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-202 rounded-lg font-bold text-[10px] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddNewAddress}
                    className="px-2 py-1 bg-emerald-500 text-white rounded-lg font-bold text-[10px] cursor-pointer"
                  >
                    Add Address
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Past Orders checklist - right column */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-3xl p-6">
            <h3 className="text-sm font-black text-slate-850 dark:text-white uppercase tracking-wider mb-6 flex items-center">
              <ClipboardList className="w-4 h-4 mr-1.5 text-emerald-500" />
              Dining Order History
            </h3>

            {orders.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs">
                You haven't ordered anything yet. Start ordering meals to earn eco points!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                      <th className="pb-3 pr-2">Date / ID</th>
                      <th className="pb-3 pr-2">Kitchen</th>
                      <th className="pb-3 pr-2">Delivery Details</th>
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
                          <div className="flex flex-col gap-0.5 text-[10px] text-slate-500">
                            <span>{order.packagingChoice || 'Standard Packaging'}</span>
                            <span>{order.deliveryMethod || 'Eco Courier'}</span>
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

      {/* EDIT PROFILE MODAL */}
      <Modal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        title="Edit Eco-Citizen Profile"
        size="md"
      >
        <div className="space-y-6">
          {/* Avatar Preview */}
          <div className="flex flex-col items-center">
            <img
              src={editAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
              alt="Avatar Preview"
              className="w-24 h-24 rounded-full object-cover border-4 border-emerald-500 shadow-lg"
            />
            <span className="text-[10px] font-extrabold text-slate-400 mt-2 uppercase tracking-wider">Avatar Preview</span>
          </div>

          {/* Name Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Display Name
            </label>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Your full name"
              className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-slate-805 dark:text-slate-100 font-sans text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>          {/* Local File Upload Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Upload Profile Photo from Computer
            </label>
            <div className="flex flex-wrap items-center gap-3">
              <label className="flex items-center justify-center px-4 py-2 border border-emerald-500 text-emerald-600 dark:text-emerald-455 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 rounded-xl text-xs font-bold cursor-pointer transition-colors gap-1.5">
                <Camera className="w-4 h-4" />
                Choose Image File
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              <span className="text-[10px] text-slate-400">
                Supports JPG, PNG or WEBP (Max 2MB)
              </span>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setIsEditProfileOpen(false)}
              className="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-850 cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveProfile}
              className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-emerald-500/10 transition-all cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
