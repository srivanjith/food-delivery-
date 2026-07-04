import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';
import EcoBadge from '../components/Common/EcoBadge';
import Modal from '../components/Common/Modal';
import Alert from '../components/Common/Alert';
import { ShieldAlert, BarChart3, Plus, Edit, Trash2, CheckCircle2, ChevronRight, Users, Utensils, ClipboardList, Store } from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const {
    restaurants,
    foodItems,
    orders,
    addRestaurant,
    updateRestaurant,
    deleteRestaurant,
    addFoodItem,
    updateFoodItem,
    deleteFoodItem,
    updateOrderStatus
  } = useApp();

  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics' | 'restaurants' | 'items' | 'orders' | 'users'
  const [successMsg, setSuccessMsg] = useState('');

  // Modals state
  const [isRestModalOpen, setIsRestModalOpen] = useState(false);
  const [isFoodModalOpen, setIsFoodModalOpen] = useState(false);
  
  // Restaurant form state
  const [restFormId, setRestFormId] = useState(null);
  const [restFormName, setRestFormName] = useState('');
  const [restFormImage, setRestFormImage] = useState('');
  const [restFormLocation, setRestFormLocation] = useState('');
  const [restFormEcoScore, setRestFormEcoScore] = useState('A');
  const [restFormFootprint, setRestFormFootprint] = useState(150);
  const [restFormDesc, setRestFormDesc] = useState('');
  const [restFormCerts, setRestFormCerts] = useState('Plastic Free, Local Ingredients');

  // Food form state
  const [foodFormId, setFoodFormId] = useState(null);
  const [foodFormRestId, setFoodFormRestId] = useState(restaurants[0]?.id || '');
  const [foodFormName, setFoodFormName] = useState('');
  const [foodFormPrice, setFoodFormPrice] = useState(250);
  const [foodFormDesc, setFoodFormDesc] = useState('');
  const [foodFormImage, setFoodFormImage] = useState('');
  const [foodFormCarbon, setFoodFormCarbon] = useState(100);
  const [foodFormEco, setFoodFormEco] = useState('A');
  const [foodFormOrganic, setFoodFormOrganic] = useState(true);
  const [foodFormVegan, setFoodFormVegan] = useState(true);
  const [foodFormLocal, setFoodFormLocal] = useState(true);

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center font-sans text-center px-4">
        <ShieldAlert className="w-16 h-16 text-amber-500 mb-4 animate-bounce" />
        <h2 className="text-2xl font-black text-slate-800 dark:text-white">Admin Authentication Required</h2>
        <p className="text-sm text-slate-500 mt-2 max-w-sm">
          Please login with administrator credentials (admin@ecoeats.com / admin123) to access inventories and sales analytics.
        </p>
        <Link
          to="/auth"
          className="mt-6 px-6 py-3 bg-emerald-500 text-white font-bold rounded-2xl shadow transition-all"
        >
          Access Login Portal
        </Link>
      </div>
    );
  }

  // Financial and environmental calculations
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const platformCarbonSavedTotal = orders.reduce((sum, o) => sum + (o.carbonSaved || 0), 0) + 1284530;
  const platformTreesPlantedTotal = orders.reduce((sum, o) => sum + (o.treesPlanted || 0), 0) + 4822;

  // Formatting helpers
  const formatCurrency = (val) => {
    return `₹${val.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  };

  const formatCarbon = (g) => {
    return `${(g / 1000).toLocaleString(undefined, { maximumFractionDigits: 0 })} kg`;
  };

  // RESTAURANTS CRUD HANDLERS
  const openRestAddModal = () => {
    setRestFormId(null);
    setRestFormName('');
    setRestFormImage('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80');
    setRestFormLocation('Sector 4, Green Glen Layout');
    setRestFormEcoScore('A');
    setRestFormFootprint(150);
    setRestFormDesc('');
    setRestFormCerts('Plastic Free, Compostable Only');
    setIsRestModalOpen(true);
  };

  const openRestEditModal = (rest) => {
    setRestFormId(rest.id);
    setRestFormName(rest.name);
    setRestFormImage(rest.image);
    setRestFormLocation(rest.location);
    setRestFormEcoScore(rest.ecoScore);
    setRestFormFootprint(rest.carbonFootprintAvg);
    setRestFormDesc(rest.description);
    setRestFormCerts(rest.certifications.join(', '));
    setIsRestModalOpen(true);
  };

  const handleRestSubmit = (e) => {
    e.preventDefault();
    const certsArray = restFormCerts.split(',').map(c => c.trim()).filter(Boolean);
    const payload = {
      name: restFormName,
      image: restFormImage,
      location: restFormLocation,
      ecoScore: restFormEcoScore,
      carbonFootprintAvg: parseInt(restFormFootprint, 10),
      description: restFormDesc,
      certifications: certsArray
    };

    if (restFormId) {
      updateRestaurant({ ...payload, id: restFormId });
      setSuccessMsg('Sustainable restaurant details updated successfully!');
    } else {
      addRestaurant(payload);
      setSuccessMsg('New sustainable restaurant registered successfully!');
    }

    setTimeout(() => {
      setSuccessMsg('');
      setIsRestModalOpen(false);
    }, 1500);
  };

  // FOOD ITEMS CRUD HANDLERS
  const openFoodAddModal = () => {
    setFoodFormId(null);
    setFoodFormRestId(restaurants[0]?.id || '');
    setFoodFormName('');
    setFoodFormPrice(250);
    setFoodFormDesc('');
    setFoodFormImage('https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80');
    setFoodFormCarbon(100);
    setFoodFormEco('A');
    setFoodFormOrganic(true);
    setFoodFormVegan(true);
    setFoodFormLocal(true);
    setIsFoodModalOpen(true);
  };

  const openFoodEditModal = (food) => {
    setFoodFormId(food.id);
    setFoodFormRestId(food.restaurantId);
    setFoodFormName(food.name);
    setFoodFormPrice(food.price);
    setFoodFormDesc(food.description);
    setFoodFormImage(food.image);
    setFoodFormCarbon(food.carbonFootprint);
    setFoodFormEco(food.ecoScore);
    setFoodFormOrganic(food.organic);
    setFoodFormVegan(food.vegan);
    setFoodFormLocal(food.localSourced);
    setIsFoodModalOpen(true);
  };

  const handleFoodSubmit = (e) => {
    e.preventDefault();
    const payload = {
      restaurantId: foodFormRestId,
      name: foodFormName,
      price: parseFloat(foodFormPrice),
      description: foodFormDesc,
      image: foodFormImage,
      carbonFootprint: parseInt(foodFormCarbon, 10),
      ecoScore: foodFormEco,
      organic: foodFormOrganic,
      vegan: foodFormVegan,
      localSourced: foodFormLocal
    };

    if (foodFormId) {
      updateFoodItem({ ...payload, id: foodFormId });
      setSuccessMsg('Inventory dish details updated successfully!');
    } else {
      addFoodItem(payload);
      setSuccessMsg('New dish registered in kitchen inventory!');
    }

    setTimeout(() => {
      setSuccessMsg('');
      setIsFoodModalOpen(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Title and stats summary */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-2 bg-emerald-500 rounded-xl text-white">
                🛡️
              </span>
              <h1 className="text-2xl font-black text-slate-850 dark:text-white font-sans tracking-tight">
                EcoEats Admin Control Panel
              </h1>
            </div>
            <p className="text-xs text-slate-505 dark:text-slate-400 mt-1">
              Moderating sustainable catalogs, circular packaging logistics, and carbon metrics.
            </p>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto scrollbar-none">
          {[
            { id: 'analytics', label: 'Impact Analytics', icon: <BarChart3 className="w-4 h-4 mr-1.5" /> },
            { id: 'restaurants', label: 'Restaurants', icon: <Store className="w-4 h-4 mr-1.5" /> },
            { id: 'items', label: 'Kitchen Menus', icon: <Utensils className="w-4 h-4 mr-1.5" /> },
            { id: 'orders', label: 'Logistics Orders', icon: <ClipboardList className="w-4 h-4 mr-1.5" /> },
            { id: 'users', label: 'User Directory', icon: <Users className="w-4 h-4 mr-1.5" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors duration-250 cursor-pointer ${
                activeTab === tab.id
                  ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-205'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Contents */}

        {/* TAB 1: ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="bg-white dark:bg-slate-900 border border-slate-202 dark:border-slate-800 p-6 rounded-3xl">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Gross Revenue</span>
                <span className="text-2xl font-black text-slate-855 dark:text-white mt-1 block">{formatCurrency(totalRevenue)}</span>
                <span className="text-[10px] text-emerald-500 font-bold block mt-1">₹{Math.round(totalRevenue * 0.05)} Platform Cut</span>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-202 dark:border-slate-800 p-6 rounded-3xl">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Green Orders placed</span>
                <span className="text-2xl font-black text-slate-855 dark:text-white mt-1 block">{orders.length} orders</span>
                <span className="text-[10px] text-slate-400 font-normal block mt-1">100% packaging compostable</span>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-202 dark:border-slate-800 p-6 rounded-3xl">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Aggregate CO₂ saved</span>
                <span className="text-2xl font-black text-emerald-605 dark:text-emerald-400 mt-1 block">{formatCarbon(platformCarbonSavedTotal)}</span>
                <span className="text-[10px] text-emerald-500 font-bold block mt-1">Sourcing & logistics offsets</span>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-202 dark:border-slate-800 p-6 rounded-3xl">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Trees Planted Total</span>
                <span className="text-2xl font-black text-teal-605 dark:text-teal-400 mt-1 block">{platformTreesPlantedTotal.toLocaleString()}</span>
                <span className="text-[10px] text-slate-400 font-normal block mt-1">Charity matching program</span>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: RESTAURANTS */}
        {activeTab === 'restaurants' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-3xl p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-slate-855 dark:text-white">Active Restaurants ({restaurants.length})</h3>
              <button
                onClick={openRestAddModal}
                id="add-restaurant-btn"
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-emerald-500 text-white text-xs font-bold rounded-xl hover:bg-emerald-600 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Restaurant</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="pb-3">Restaurant Details</th>
                    <th className="pb-3">Location</th>
                    <th className="pb-3">Eco Parameters</th>
                    <th className="pb-3">Certifications</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-semibold text-slate-700 dark:text-slate-350">
                  {restaurants.map(rest => (
                    <tr key={rest.id}>
                      <td className="py-4 flex items-center space-x-3 pr-2">
                        <img src={rest.image} alt={rest.name} className="w-12 h-12 object-cover rounded-xl shrink-0" />
                        <div>
                          <span className="block text-slate-805 dark:text-white font-bold">{rest.name}</span>
                          <span className="block text-[10px] text-slate-400 font-normal mt-0.5">{rest.tags.join(', ')}</span>
                        </div>
                      </td>
                      <td className="py-4 pr-2">{rest.location}</td>
                      <td className="py-4 pr-2 space-y-1">
                        <EcoBadge type="score" value={rest.ecoScore} />
                        <span className="block text-[10px] text-slate-400 font-normal">Avg {rest.carbonFootprintAvg}g CO₂e</span>
                      </td>
                      <td className="py-4 pr-2 max-w-[200px] truncate" title={rest.certifications.join(', ')}>
                        {rest.certifications.join(', ')}
                      </td>
                      <td className="py-4 text-right space-x-2">
                        <button
                          onClick={() => openRestEditModal(rest)}
                          className="p-1 bg-slate-100 dark:bg-slate-800 rounded text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => { if(confirm('Delete restaurant?')) deleteRestaurant(rest.id); }}
                          className="p-1 bg-red-50 dark:bg-red-950/20 rounded text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: FOOD ITEMS */}
        {activeTab === 'items' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-3xl p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-slate-855 dark:text-white">Kitchen Menu Catalog ({foodItems.length} Dishes)</h3>
              <button
                onClick={openFoodAddModal}
                id="add-food-btn"
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-emerald-500 text-white text-xs font-bold rounded-xl hover:bg-emerald-600 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Dish</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="pb-3">Dish Info</th>
                    <th className="pb-3">Restaurant ID</th>
                    <th className="pb-3">Price</th>
                    <th className="pb-3">Green stats</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-semibold text-slate-700 dark:text-slate-350">
                  {foodItems.map(item => (
                    <tr key={item.id}>
                      <td className="py-4 flex items-center space-x-3 pr-2">
                        <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-xl shrink-0" />
                        <div>
                          <span className="block text-slate-805 dark:text-white font-bold">{item.name}</span>
                          <span className="block text-[10px] text-slate-450 font-normal mt-0.5 line-clamp-1 max-w-[200px]">{item.description}</span>
                        </div>
                      </td>
                      <td className="py-4 pr-2">{item.restaurantId}</td>
                      <td className="py-4 pr-2 font-bold text-slate-800 dark:text-white">₹{item.price}</td>
                      <td className="py-4 pr-2 space-y-1">
                        <EcoBadge type="carbon" value={item.carbonFootprint} />
                        <div className="flex gap-1">
                          {item.vegan && <span className="text-[9px] bg-emerald-50 text-emerald-800 dark:bg-emerald-950 px-1 py-0.5 rounded font-bold">Vegan</span>}
                          {item.organic && <span className="text-[9px] bg-amber-50 text-amber-800 dark:bg-amber-950 px-1 py-0.5 rounded font-bold">Organic</span>}
                        </div>
                      </td>
                      <td className="py-4 text-right space-x-2">
                        <button
                          onClick={() => openFoodEditModal(item)}
                          className="p-1 bg-slate-100 dark:bg-slate-800 rounded text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => { if(confirm('Delete dish?')) deleteFoodItem(item.id); }}
                          className="p-1 bg-red-50 dark:bg-red-950/20 rounded text-red-500 hover:text-red-750 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: ORDERS */}
        {activeTab === 'orders' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-3xl p-6 space-y-6">
            <h3 className="text-base font-bold text-slate-855 dark:text-white">Orders Logistics pipeline ({orders.length} orders)</h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="pb-3">Order ID / Date</th>
                    <th className="pb-3">Address</th>
                    <th className="pb-3">Total Value</th>
                    <th className="pb-3">Current Status</th>
                    <th className="pb-3 text-right">Status Controls</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-semibold text-slate-700 dark:text-slate-350">
                  {orders.map(order => (
                    <tr key={order.id}>
                      <td className="py-4.5 pr-2">
                        <span className="block text-slate-805 dark:text-white font-bold">{order.id}</span>
                        <span className="block text-[10px] text-slate-400 font-normal">{order.restaurantName}</span>
                      </td>
                      <td className="py-4.5 pr-2 max-w-[200px] truncate" title={order.address || 'Mock address'}>
                        {order.address || 'Mock address'}
                      </td>
                      <td className="py-4.5 pr-2 font-bold text-slate-800 dark:text-white">₹{order.total}</td>
                      <td className="py-4.5 pr-2">
                        <span className={`inline-flex px-2 py-0.5 text-[9px] font-bold uppercase rounded-md ${
                          order.status === 'Delivered'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
                            : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4.5 text-right flex justify-end gap-1.5 flex-wrap">
                        {['Preparing', 'Out for Delivery', 'Delivered'].map(status => (
                          <button
                            key={status}
                            onClick={() => updateOrderStatus(order.id, status)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 text-[10px] font-bold text-slate-655 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 rounded border border-slate-205 dark:border-slate-700 cursor-pointer"
                          >
                            Set {status.split(' ')[0]}
                          </button>
                        ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: USERS DIRECTORY */}
        {activeTab === 'users' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-3xl p-6 space-y-6">
            <h3 className="text-base font-bold text-slate-855 dark:text-white">EcoEats User Directory</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center space-x-4">
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80" alt="Jane Avatar" className="w-12 h-12 rounded-full object-cover border border-emerald-500" />
                <div>
                  <span className="block text-xs font-bold text-slate-800 dark:text-white">Jane Eco-Citizen</span>
                  <span className="block text-[10px] text-slate-400">user@ecoeats.com (Customer)</span>
                  <div className="flex gap-2 mt-1.5 text-[9px] font-bold">
                    <span className="text-emerald-600">🌱 420 pts</span>
                    <span className="text-slate-500">🌲 2 Trees</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center space-x-4">
                <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80" alt="Admin avatar" className="w-12 h-12 rounded-full object-cover border border-slate-700" />
                <div>
                  <span className="block text-xs font-bold text-slate-800 dark:text-white">Admin Moderator</span>
                  <span className="block text-[10px] text-slate-400">admin@ecoeats.com (Administrator)</span>
                  <span className="inline-block mt-1 bg-slate-202 text-slate-700 px-2 py-0.5 rounded text-[8px] uppercase font-black">Controls Role</span>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* RESTAURANT CREATION MODAL */}
      <Modal
        isOpen={isRestModalOpen}
        onClose={() => setIsRestModalOpen(false)}
        title={restFormId ? 'Edit Restaurant Catalog' : 'Register New Sustainable Restaurant'}
      >
        <form onSubmit={handleRestSubmit} className="space-y-4 font-sans">
          {successMsg && <Alert type="success" message={successMsg} />}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Restaurant Name</label>
            <input required type="text" value={restFormName} onChange={e => setRestFormName(e.target.value)} className="w-full px-3 py-2 border border-slate-205 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-xl text-sm" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Unsplash Banner Image URL</label>
            <input required type="text" value={restFormImage} onChange={e => setRestFormImage(e.target.value)} className="w-full px-3 py-2 border border-slate-205 dark:border-slate-800 bg-white dark:bg-slate-955 rounded-xl text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Eco-Score</label>
              <select value={restFormEcoScore} onChange={e => setRestFormEcoScore(e.target.value)} className="w-full px-3 py-2 border border-slate-205 dark:border-slate-800 bg-white dark:bg-slate-955 rounded-xl text-sm">
                <option value="A+">A+</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Avg Footprint (g CO₂e)</label>
              <input required type="number" value={restFormFootprint} onChange={e => setRestFormFootprint(e.target.value)} className="w-full px-3 py-2 border border-slate-205 dark:border-slate-800 bg-white dark:bg-slate-955 rounded-xl text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Location / Zone</label>
            <input required type="text" value={restFormLocation} onChange={e => setRestFormLocation(e.target.value)} className="w-full px-3 py-2 border border-slate-205 dark:border-slate-800 bg-white dark:bg-slate-955 rounded-xl text-sm" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Sourcing Certifications (comma separated)</label>
            <input required type="text" value={restFormCerts} onChange={e => setRestFormCerts(e.target.value)} className="w-full px-3 py-2 border border-slate-205 dark:border-slate-800 bg-white dark:bg-slate-955 rounded-xl text-sm" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Description</label>
            <textarea required rows="3" value={restFormDesc} onChange={e => setRestFormDesc(e.target.value)} className="w-full p-3 border border-slate-205 dark:border-slate-800 bg-white dark:bg-slate-955 rounded-xl text-sm" />
          </div>
          <button type="submit" className="w-full py-3 bg-emerald-500 text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-emerald-600 transition-colors shadow">
            Save Restaurant
          </button>
        </form>
      </Modal>

      {/* FOOD CATALOG CREATION MODAL */}
      <Modal
        isOpen={isFoodModalOpen}
        onClose={() => setIsFoodModalOpen(false)}
        title={foodFormId ? 'Modify Catalog Dish' : 'Add Dish to Restaurant Menu'}
      >
        <form onSubmit={handleFoodSubmit} className="space-y-4 font-sans">
          {successMsg && <Alert type="success" message={successMsg} />}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Target Kitchen</label>
            <select value={foodFormRestId} onChange={e => setFoodFormRestId(e.target.value)} className="w-full px-3 py-2 border border-slate-205 dark:border-slate-850 bg-white dark:bg-slate-950 rounded-xl text-sm">
              {restaurants.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Dish Name</label>
            <input required type="text" value={foodFormName} onChange={e => setFoodFormName(e.target.value)} className="w-full px-3 py-2 border border-slate-205 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-xl text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Price (₹)</label>
              <input required type="number" value={foodFormPrice} onChange={e => setFoodFormPrice(e.target.value)} className="w-full px-3 py-2 border border-slate-205 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-xl text-sm" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Footprint (g CO₂e)</label>
              <input required type="number" value={foodFormCarbon} onChange={e => setFoodFormCarbon(e.target.value)} className="w-full px-3 py-2 border border-slate-205 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-xl text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Dish Image URL</label>
            <input required type="text" value={foodFormImage} onChange={e => setFoodFormImage(e.target.value)} className="w-full px-3 py-2 border border-slate-205 dark:border-slate-800 bg-white dark:bg-slate-955 rounded-xl text-sm" />
          </div>
          <div className="flex gap-4">
            <label className="flex items-center text-xs text-slate-655 font-bold cursor-pointer">
              <input type="checkbox" checked={foodFormVegan} onChange={e => setFoodFormVegan(e.target.checked)} className="mr-2" />
              100% Vegan
            </label>
            <label className="flex items-center text-xs text-slate-655 font-bold cursor-pointer">
              <input type="checkbox" checked={foodFormOrganic} onChange={e => setFoodFormOrganic(e.target.checked)} className="mr-2" />
              Organic Sourced
            </label>
            <label className="flex items-center text-xs text-slate-655 font-bold cursor-pointer">
              <input type="checkbox" checked={foodFormLocal} onChange={e => setFoodFormLocal(e.target.checked)} className="mr-2" />
              Locally Grown
            </label>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Dish Sourcing details / description</label>
            <textarea required rows="3" value={foodFormDesc} onChange={e => setFoodFormDesc(e.target.value)} className="w-full p-3 border border-slate-205 dark:border-slate-800 bg-white dark:bg-slate-955 rounded-xl text-sm" />
          </div>
          <button type="submit" className="w-full py-3 bg-emerald-500 text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-emerald-600 transition-colors shadow">
            Save Dish to Inventory
          </button>
        </form>
      </Modal>

    </div>
  );
}
