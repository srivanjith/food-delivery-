import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Navigation, ClipboardList, Map, ShieldAlert, Sparkles, CheckCircle2, Clock, Check, Coins, ArrowRight, Phone } from 'lucide-react';
import Alert from '../components/Common/Alert';
import { io } from 'socket.io-client';

export default function DeliveryDashboard() {
  const { user } = useAuth();
  const { getAuthHeaders, loadOrders, restaurants } = useApp();

  const [pendingJobs, setPendingJobs] = useState([]);
  const [activeJobs, setActiveJobs] = useState([]);
  const [completedJobs, setCompletedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wallet, setWallet] = useState({ coins: 0, fiat: 0 });
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchDeliveryData();
    fetchWalletBalance();
  }, [user]);

  // Sync real-time package updates via WebSockets
  useEffect(() => {
    const socket = io('http://localhost:5000');
    socket.on('connect', () => {
      socket.emit('join-order-room', 'delivery-pool');
    });

    socket.on('orderStatusUpdated', () => {
      fetchDeliveryData();
    });

    // Alert courier that a new order is ready for pickup
    socket.on('newOrderReady', ({ orderId, restaurantName, order }) => {
      setPendingJobs(prev => {
        if (prev.some(j => j.id === orderId)) return prev;
        return [order, ...prev];
      });
      setNotification({
        id: orderId,
        message: `🔔 New Order ready at ${restaurantName}! (Order #${orderId})`
      });
      // Clear toast after 6 seconds
      setTimeout(() => setNotification(null), 6000);
    });

    // Remote close/remove order suggestions claimed by another courier
    socket.on('orderClaimed', ({ orderId }) => {
      setPendingJobs(prev => prev.filter(job => job.id !== orderId));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Dynamically load Leaflet JS/CSS CDN
  useEffect(() => {
    const loadLeaflet = () => {
      if (window.L) {
        setLeafletLoaded(true);
        return;
      }
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => setLeafletLoaded(true);
      document.body.appendChild(script);
    };
    loadLeaflet();
  }, []);

  // Initialize maps for all active deliveries
  useEffect(() => {
    if (!leafletLoaded || activeJobs.length === 0) return;

    const L = window.L;
    const initializedMaps = [];

    activeJobs.forEach(job => {
      const mapContainerId = `delivery-map-${job.id}`;
      const element = document.getElementById(mapContainerId);
      if (!element || element._leaflet_id) return;

      // Rest coords (using default Bangalore coords as fallback/lookup)
      const matchedRest = restaurants?.find(r => r.name === job.restaurantName || r.id === job.restaurantId);
      const restCoords = matchedRest ? [matchedRest.lat, matchedRest.lng] : [12.9279, 77.6271];
      const customerCoords = [12.9716, 77.5946];

      const centerLat = (restCoords[0] + customerCoords[0]) / 2;
      const centerLng = (restCoords[1] + customerCoords[1]) / 2;

      const map = L.map(mapContainerId, { zoomControl: false }).setView([centerLat, centerLng], 12);
      initializedMaps.push(map);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap'
      }).addTo(map);

      const restIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div class="bg-emerald-500 text-white p-1 rounded-full shadow border border-white text-xs">🏪</div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const destIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div class="bg-red-500 text-white p-1 rounded-full shadow border border-white text-xs">🏡</div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      L.marker(restCoords, { icon: restIcon }).addTo(map);
      L.marker(customerCoords, { icon: destIcon }).addTo(map);
      
      L.polyline([restCoords, customerCoords], {
        color: '#10b981',
        weight: 3,
        dashArray: '4, 8'
      }).addTo(map);

      // Fit map bounds
      const bounds = L.latLngBounds([restCoords, customerCoords]);
      map.fitBounds(bounds, { padding: [20, 20] });
    });

    return () => {
      initializedMaps.forEach(m => m.remove());
    };
  }, [leafletLoaded, activeJobs]);

  const fetchWalletBalance = async () => {
    try {
      const res = await fetch('/api/auth/profile', {
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (data.success && data.wallet) {
        setWallet(data.wallet);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDeliveryData = async () => {
    setLoading(true);
    try {
      // 1. Fetch available unclaimed orders (Ready for Pickup)
      const resPending = await fetch('/api/orders/delivery/pending', {
        headers: getAuthHeaders()
      });
      const dataPending = await resPending.json();
      setPendingJobs(dataPending || []);

      // 2. Fetch all orders (we will filter those assigned to this courier)
      const resAll = await fetch('/api/orders', {
        headers: getAuthHeaders()
      });
      const dataAll = await resAll.json();
      
      const active = dataAll.filter(o => o.deliveryBoyId === user.id && o.status === 'Out for Delivery');
      const completed = dataAll.filter(o => o.deliveryBoyId === user.id && o.status === 'Delivered');

      setActiveJobs(active);
      setCompletedJobs(completed);
    } catch (err) {
      console.error('Error fetching delivery jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimJob = async (orderId) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/assign-courier`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        }
      });
      const data = await res.json();
      if (data.success) {
        // Refresh lists
        fetchDeliveryData();
        loadOrders();
      } else {
        alert(data.message || 'Failed to claim delivery job.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeliverJob = async (orderId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify({ status: 'Delivered' })
      });
      const data = await res.json();
      if (data.success) {
        fetchDeliveryData();
        fetchWalletBalance();
        loadOrders();
      } else {
        alert('Failed to mark order as delivered.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center font-sans">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-emerald-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Real-time Order Ready Notification */}
        {notification && (
          <div className="mb-6 p-4 bg-emerald-550 dark:bg-emerald-600 text-white rounded-2xl shadow-xl flex items-center justify-between border border-emerald-400/20 animate-bounce">
            <div className="flex items-center space-x-2">
              <span className="animate-ping inline-flex h-2.5 w-2.5 rounded-full bg-emerald-100 opacity-75"></span>
              <span className="text-xs font-black tracking-wide font-sans">{notification.message}</span>
            </div>
            <button 
              onClick={() => setNotification(null)} 
              className="text-emerald-100 hover:text-white font-bold text-xs cursor-pointer ml-4"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Header Banner */}
        <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-450 rounded-2xl">
              <Navigation className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-850 dark:text-white">
                Eco-Courier Panel: {user.name}
              </h1>
              <p className="text-xs text-slate-500 mt-1">Zero-emission logistics dispatch agent</p>
            </div>
          </div>

          {/* Earnings summary */}
          <div className="flex space-x-6">
            <div className="text-center">
              <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Eco-Coins Balance</span>
              <span className="text-lg font-black text-emerald-505 flex items-center justify-center gap-1 mt-0.5">
                🪙 {wallet.coins}
              </span>
            </div>
            <div className="text-center">
              <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Completed Deliveries</span>
              <span className="text-lg font-black text-slate-850 dark:text-white mt-0.5">
                📦 {completedJobs.length}
              </span>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Active and Available Jobs */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Active Deliveries */}
            <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-3xl p-6">
              <h3 className="text-sm font-black text-slate-805 dark:text-white uppercase tracking-wider pb-3 border-b border-slate-100 dark:border-slate-800 mb-6 flex items-center">
                <Clock className="w-4.5 h-4.5 mr-1.5 text-amber-500 animate-pulse" />
                Active Deliveries In Route ({activeJobs.length})
              </h3>

              {activeJobs.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400 font-bold">You have no active runs. Claim an available job below!</div>
              ) : (
                <div className="space-y-6">
                  {activeJobs.map(job => (
                    <div key={job.id} className="border border-slate-202 dark:border-slate-850 p-5 rounded-2xl space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-808 dark:text-white">{job.id}</span>
                        <span className="px-2 py-0.5 text-[9px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-455 uppercase rounded">En Route</span>
                      </div>

                      {/* Route specs */}
                      <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4 text-xs">
                        <div className="bg-slate-50 dark:bg-slate-850 p-3 rounded-xl">
                          <span className="block text-[8px] uppercase tracking-wider text-slate-400 font-bold">Pickup Kitchen</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">{job.restaurantName}</span>
                        </div>
                        <div className="flex justify-center text-slate-400">
                          <ArrowRight className="w-4 h-4 hidden md:block" />
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-850 p-3 rounded-xl">
                          <span className="block text-[8px] uppercase tracking-wider text-slate-400 font-bold">Customer Address</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 block truncate" title={job.address}>{job.address}</span>
                        </div>
                      </div>

                      {/* Active Run Map */}
                      <div 
                        id={`delivery-map-${job.id}`} 
                        className="h-48 w-full rounded-xl overflow-hidden mt-3 relative z-10 border border-slate-200 dark:border-slate-800" 
                      />

                      <div className="flex justify-between items-center pt-2">
                        <div className="text-xs text-slate-500 font-medium">
                          Packaging choice: <span className="font-bold text-slate-700 dark:text-slate-350">{job.packagingChoice}</span>
                        </div>
                        <button
                          onClick={() => handleDeliverJob(job.id)}
                          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
                        >
                          Mark as Delivered
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Available Jobs list */}
            <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-3xl p-6">
              <h3 className="text-sm font-black text-slate-855 dark:text-white uppercase tracking-wider pb-3 border-b border-slate-100 dark:border-slate-800 mb-6 flex items-center">
                <ClipboardList className="w-4.5 h-4.5 mr-1.5 text-emerald-500" />
                Available Dispatch Board ({pendingJobs.length})
              </h3>

              {pendingJobs.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <Check className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  <p className="font-bold text-xs">No pending orders. Awaiting ready signals from restaurants...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingJobs.map(job => (
                    <div key={job.id} className="border border-slate-202 dark:border-slate-800/80 p-5 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4 hover:shadow-md transition-shadow">
                      <div>
                        <div className="flex items-center space-x-2.5">
                          <span className="text-xs font-bold text-slate-850 dark:text-white">{job.id}</span>
                          <span className="text-[9px] bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 font-bold px-2 py-0.5 rounded">Ready for Pickup</span>
                        </div>
                        <div className="text-xs text-slate-500 font-semibold mt-2.5 space-y-1">
                          <p>🏪 Kitchen: <strong className="text-slate-808 dark:text-slate-200">{job.restaurantName}</strong></p>
                          <p>🏡 Deliver to: <span className="text-slate-455 font-medium">{job.address}</span></p>
                          <p>🚲 Transit class: <span className="text-slate-655 dark:text-slate-350">{job.deliveryMethod} ({job.packagingChoice})</span></p>
                        </div>
                      </div>

                      <div className="text-right flex flex-col md:items-end justify-between h-full gap-3">
                        <span className="text-xs font-black text-slate-850 dark:text-white">Pay reward: 🪙 50 coins</span>
                        <button
                          onClick={() => handleClaimJob(job.id)}
                          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer whitespace-nowrap"
                        >
                          Accept & Navigate
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Right: Logistics details and Guidelines */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-3xl p-6 space-y-4">
              <h3 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-widest pb-2.5 border-b border-slate-100 dark:border-slate-800">
                Logistics Guidelines
              </h3>
              
              <ul className="space-y-3.5 text-xs text-slate-505 dark:text-slate-400">
                <li className="flex items-start">
                  <span className="text-emerald-500 mr-2">🌱</span>
                  <span><strong>Zero Emission Transit:</strong> Always use low-carbon transit methods (bicycles, walking, or electric vehicles).</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-500 mr-2">🍱</span>
                  <span><strong>Reusable Container Loop:</strong> If the order contains returnable Bento boxes, double-check that the customer is registered and explain return options.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-500 mr-2">⏱️</span>
                  <span><strong>Prompt updates:</strong> Click 'Mark as Delivered' immediately upon handover to ensure correct timestamp calculations and payout deposits.</span>
                </li>
              </ul>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
