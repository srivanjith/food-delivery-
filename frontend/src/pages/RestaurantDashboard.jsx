import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Store, ClipboardList, TrendingUp, AlertCircle, Sparkles, CheckCircle2, Clock, Check, Plus, Edit, Trash2 } from 'lucide-react';
import Modal from '../components/Common/Modal';
import Alert from '../components/Common/Alert';
import { io } from 'socket.io-client';

export default function RestaurantDashboard() {
  const { user } = useAuth();
  const { getAuthHeaders, loadOrders, foodItems } = useApp();

  const [restaurant, setRestaurant] = useState(null);
  const [loadingRest, setLoadingRest] = useState(true);
  const [restOrders, setRestOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Onboarding form state
  const [restName, setRestName] = useState('');
  const [restImage, setRestImage] = useState('');
  const [restLocation, setRestLocation] = useState('');
  const [restAddress, setRestAddress] = useState('');
  const [restContact, setRestContact] = useState('');
  const [restTimings, setRestTimings] = useState('10:00 AM - 10:00 PM');
  const [restCerts, setRestCerts] = useState('Organic Sourced, Zero-Plastic');
  const [restDesc, setRestDesc] = useState('');
  
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    fetchRestaurantProfile();
  }, [user]);

  const fetchRestaurantProfile = async () => {
    if (!user) return;
    setLoadingRest(true);
    try {
      const response = await fetch('/api/restaurants');
      const data = await response.json();
      const matched = data.find(r => r.ownerId === user.id);
      if (matched) {
        setRestaurant(matched);
        fetchRestaurantOrders(matched.id);
      }
    } catch (err) {
      console.error('Error fetching restaurant profile:', err);
    } finally {
      setLoadingRest(false);
    }
  };

  const fetchRestaurantOrders = async (restaurantId) => {
    setLoadingOrders(true);
    try {
      const response = await fetch('/api/orders', {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      // Filter orders by restaurant ID
      const filtered = data.filter(o => o.restaurantId === restaurantId);
      setRestOrders(filtered);
    } catch (err) {
      console.error('Error fetching restaurant orders:', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  // Connect to Socket.io to receive live order updates placed at this restaurant
  useEffect(() => {
    if (!restaurant) return;

    const socket = io('http://localhost:5000');
    socket.on('connect', () => {
      // Room for this restaurant
      socket.emit('join-order-room', `restaurant:${restaurant.id}`);
    });

    // Real-time listener for new orders or status updates
    socket.on('orderStatusUpdated', () => {
      fetchRestaurantOrders(restaurant.id);
    });

    return () => {
      socket.disconnect();
    };
  }, [restaurant]);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const token = localStorage.getItem('token');
      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        headers,
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setRestImage(data.url);
        setSuccessMsg('Image uploaded successfully!');
        setTimeout(() => setSuccessMsg(''), 2000);
      } else {
        setErrorMsg('Upload failed.');
        setTimeout(() => setErrorMsg(''), 2000);
      }
    } catch (err) {
      setErrorMsg('Error connecting to upload service.');
      setTimeout(() => setErrorMsg(''), 2000);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleOnboardingSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    const certsArray = restCerts.split(',').map(c => c.trim()).filter(Boolean);
    const payload = {
      name: restName,
      image: restImage || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80',
      location: restLocation,
      address: restAddress,
      contact: restContact,
      timings: restTimings,
      description: restDesc,
      certifications: certsArray
    };

    try {
      const res = await fetch('http://localhost:5000/api/restaurants/register-owner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg('Restaurant registered successfully! Redirecting...');
        setRestaurant(data.restaurant);
        fetchRestaurantOrders(data.restaurant.id);
      } else {
        setErrorMsg(data.message || 'Onboarding failed.');
      }
    } catch (err) {
      setErrorMsg('Failed to connect to the server.');
    }
  };

  const handleStatusTransition = async (orderId, nextStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify({ status: nextStatus })
      });
      const data = await res.json();
      if (data.success) {
        // Refresh local orders
        setRestOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: nextStatus } : o));
        loadOrders();
      } else {
        alert('Failed to update status.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loadingRest) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center font-sans">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-emerald-500" />
      </div>
    );
  }

  // ONBOARDING WORKFLOW (If restaurant owner has not registered a hotel profile yet)
  if (!restaurant) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-[10%] left-[10%] w-[250px] h-[250px] bg-emerald-500/5 rounded-full filter blur-[80px]" />
          </div>

          <div className="text-center relative z-10">
            <div className="inline-flex p-3 bg-emerald-500 rounded-2xl text-white mb-4 shadow-lg shadow-emerald-500/20">
              <Store className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-white">Register Your Sustainable Hotel</h2>
            <p className="text-xs text-slate-400 mt-1">Provide details of your kitchen to start receiving zero-carbon delivery orders.</p>
          </div>

          {errorMsg && <Alert type="error" message={errorMsg} />}
          {successMsg && <Alert type="success" message={successMsg} />}

          <form onSubmit={handleOnboardingSubmit} className="space-y-4 text-xs font-semibold text-slate-300">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Hotel Name</label>
              <input required type="text" value={restName} onChange={e => setRestName(e.target.value)} placeholder="Organic Leaf Cafe" className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-205 focus:ring-emerald-500 focus:border-emerald-500" />
            </div>

            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Banner Image URL</label>
                <input required type="text" value={restImage} onChange={e => setRestImage(e.target.value)} placeholder="https://..." className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-205 focus:ring-emerald-500 focus:border-emerald-500" />
              </div>
              <div className="relative shrink-0">
                <input type="file" accept="image/*" id="onboard-upload" className="hidden" onChange={handleImageUpload} />
                <label htmlFor="onboard-upload" className="px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold cursor-pointer inline-block whitespace-nowrap">
                  {uploadingImage ? 'Uploading...' : 'Upload Image'}
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Location Zone (e.g. Indiranagar)</label>
                <input required type="text" value={restLocation} onChange={e => setRestLocation(e.target.value)} className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-205 focus:ring-emerald-500 focus:border-emerald-500" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Hours of Operations</label>
                <input required type="text" value={restTimings} onChange={e => setRestTimings(e.target.value)} className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-205 focus:ring-emerald-500 focus:border-emerald-500" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Contact Number</label>
                <input required type="text" value={restContact} onChange={e => setRestContact(e.target.value)} placeholder="+91 99999 xxxxx" className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-205 focus:ring-emerald-500 focus:border-emerald-500" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Certifications (Comma separated)</label>
                <input required type="text" value={restCerts} onChange={e => setRestCerts(e.target.value)} className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-205 focus:ring-emerald-500 focus:border-emerald-500" />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Full Postal Address</label>
              <input required type="text" value={restAddress} onChange={e => setRestAddress(e.target.value)} className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-205 focus:ring-emerald-500 focus:border-emerald-500" />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">About Description</label>
              <textarea required rows="3" value={restDesc} onChange={e => setRestDesc(e.target.value)} placeholder="Tell users about your eco-friendly cuisine, local sourcing methods..." className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-205 focus:ring-emerald-500 focus:border-emerald-500" />
            </div>

            <button type="submit" className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer mt-4">
              Submit Registration
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ACTIVE DASHBOARD PORTAL
  const activeOrders = restOrders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled');
  const completedOrdersCount = restOrders.filter(o => o.status === 'Delivered').length;
  const grossSales = restOrders.reduce((sum, o) => sum + (o.status === 'Delivered' ? o.total : 0), 0);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Profile Card Header */}
        <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          <div className="flex items-center space-x-4">
            <img src={restaurant.image} alt={restaurant.name} className="w-16 h-16 object-cover rounded-2xl shadow-md border-2 border-emerald-500/20" />
            <div>
              <h1 className="text-xl font-black text-slate-850 dark:text-white flex items-center">
                <Link to={`/restaurant/${restaurant.id}`} className="hover:text-emerald-500 hover:underline flex items-center gap-1.5" title="Click to view/manage menu">
                  {restaurant.name}
                  <span className="text-[10px] text-slate-400 font-normal italic font-sans hover:text-emerald-500">(Manage Menu)</span>
                </Link>
                <span className="ml-2 text-[10px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-450 px-2 py-0.5 rounded font-black font-sans font-sans">Hotel Owner Partner</span>
              </h1>
              <p className="text-xs text-slate-500 mt-1">{restaurant.location} • {restaurant.timings}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {restaurant.certifications.map((c, i) => (
              <span key={i} className="text-[9px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-450 px-2 py-0.5 rounded">
                🌱 {c}
              </span>
            ))}
          </div>
        </div>

        {/* Empty Menu Tip Alert */}
        {(() => {
          const myDishes = foodItems ? foodItems.filter(item => item.restaurantId === restaurant.id) : [];
          if (myDishes.length === 0) {
            return (
              <div className="mb-8 p-4 bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 rounded-3xl text-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <span>💡 <strong>Tip: Your restaurant menu is currently empty!</strong> Customers will not see any dishes under your kitchen on the home page.</span>
                <Link to={`/restaurant/${restaurant.id}`} className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl whitespace-nowrap cursor-pointer transition-all">
                  Manage Menu & Add Dishes
                </Link>
              </div>
            );
          }
          return null;
        })()}

        {/* Analytics metrics grids */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 p-5 rounded-2xl flex items-center space-x-4">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Gross Sales</span>
              <span className="text-lg font-black text-slate-850 dark:text-white mt-0.5">₹{grossSales}</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 p-5 rounded-2xl flex items-center space-x-4">
            <div className="p-3 bg-teal-50 dark:bg-teal-950/20 text-teal-500 rounded-xl">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Completed Orders</span>
              <span className="text-lg font-black text-slate-850 dark:text-white mt-0.5">{completedOrdersCount} orders</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 p-5 rounded-2xl flex items-center space-x-4">
            <div className="p-3 bg-amber-50 dark:bg-amber-950/20 text-amber-500 rounded-xl animate-pulse">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-sans">Active Orders</span>
              <span className="text-lg font-black text-amber-500 mt-0.5">{activeOrders.length} pipeline</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 p-5 rounded-2xl flex items-center space-x-4">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500 rounded-xl">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Commission Rate</span>
              <span className="text-lg font-black text-slate-850 dark:text-white mt-0.5">{(restaurant.commissionRate * 100).toFixed(0)}% standard</span>
            </div>
          </div>
        </div>

        {/* Orders Pipeline List */}
        <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-3xl p-6">
          <div className="flex justify-between items-center pb-5 border-b border-slate-100 dark:border-slate-800 mb-6">
            <h3 className="text-base font-bold text-slate-850 dark:text-white flex items-center">
              <ClipboardList className="w-5 h-5 mr-1.5 text-emerald-500" />
              Active Preparation Pipeline
            </h3>
            <span className="text-[10px] text-slate-400 font-bold">Auto-updates in real-time</span>
          </div>

          {loadingOrders ? (
            <div className="text-center py-12 text-xs text-slate-400 font-bold">Fetching pipeline data...</div>
          ) : activeOrders.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <Check className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p className="font-bold text-xs">No active orders remaining! All clear.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {activeOrders.map(order => (
                <div key={order.id} className="border border-slate-202 dark:border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row justify-between gap-6 hover:shadow-md transition-shadow">
                  
                  {/* Left Column: Details */}
                  <div className="space-y-3.5 max-w-xl">
                    <div className="flex items-center space-x-2.5">
                      <span className="text-xs font-black text-slate-808 dark:text-white">{order.id}</span>
                      <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                        order.status === 'Preparing' 
                          ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400' 
                          : order.status === 'Ready for Pickup'
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-450 animate-pulse'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-850 dark:text-slate-400'
                      }`}>
                        {order.status}
                      </span>
                    </div>

                    <div className="text-xs text-slate-655 dark:text-slate-350">
                      <span className="block font-bold mb-1">Items Ordered:</span>
                      <ul className="list-disc list-inside pl-1 space-y-0.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                        {order.items.map((item, idx) => (
                          <li key={idx}>{item.quantity}x {item.name} (₹{item.price})</li>
                        ))}
                      </ul>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-[10px] text-slate-455">
                      <div>
                        <span className="block text-slate-400 uppercase font-black">Customer Details</span>
                        <span className="font-bold text-slate-600 dark:text-slate-300">{order.customerName}</span>
                      </div>
                      <div>
                        <span className="block text-slate-400 uppercase font-black">Packaging & Delivery</span>
                        <span className="font-bold text-slate-600 dark:text-slate-300">{order.packagingChoice} • {order.deliveryMethod}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Controls */}
                  <div className="flex flex-col justify-between items-end gap-4 shrink-0">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block font-black uppercase">Order Total</span>
                      <span className="text-lg font-black text-slate-850 dark:text-white">₹{order.total}</span>
                    </div>

                    <div className="flex gap-2">
                      {order.status === 'Order Received' && (
                        <button
                          onClick={() => handleStatusTransition(order.id, 'Preparing')}
                          className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
                        >
                          Prepare Order
                        </button>
                      )}

                      {order.status === 'Preparing' && (
                        <button
                          onClick={() => handleStatusTransition(order.id, 'Ready for Pickup')}
                          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
                        >
                          Send Ready Signal to Office
                        </button>
                      )}

                      {order.status === 'Ready for Pickup' && (
                        <div className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-450 bg-emerald-50 dark:bg-emerald-950/40 px-3.5 py-2.5 rounded-xl border border-dashed border-emerald-250 flex items-center space-x-1.5 animate-pulse">
                          <span>🚀 Ready! Awaiting courier pickup...</span>
                        </div>
                      )}

                      <button
                        onClick={() => { if(confirm('Cancel order?')) handleStatusTransition(order.id, 'Cancelled'); }}
                        className="px-3.5 py-2 border border-slate-205 hover:bg-red-50 hover:text-red-500 dark:border-slate-800 dark:hover:bg-red-950/10 rounded-xl text-xs font-bold text-slate-550 transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
