import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { CheckCircle2, Navigation, Clock, Sparkles, Map, RefreshCw } from 'lucide-react';
import { io } from 'socket.io-client';

export default function OrderTracking() {
  const { id } = useParams();
  const { orders, updateOrderStatus, loadOrders, restaurants } = useApp();
  
  const order = orders.find(o => o.id === id);
  const restaurant = restaurants?.find(r => r.id === order?.restaurantId);
  const deliveryIcon = order ? ({
    Bicycle: '🚲',
    'Electric Vehicle': '⚡',
    'Solar Drone': '🛸'
  }[order.deliveryMethod] || '🚚') : '🚚';

  // Simulation steps
  const statusSteps = ['Order Received', 'Preparing', 'Ready for Pickup', 'Out for Delivery', 'Delivered'];
  
  const [localStatus, setLocalStatus] = useState(order?.status || 'Order Received');
  const [leafletLoaded, setLeafletLoaded] = useState(false);

  // Keep localStatus in sync with context order.status when it loads or changes
  useEffect(() => {
    if (order) {
      setLocalStatus(order.status);
    }
  }, [order?.status]);

  // Connect to Socket.io for live status updates
  useEffect(() => {
    if (!id) return;
    
    // Connect to WebSocket server on port 5000 (proxied or direct)
    const socket = io('http://localhost:5000');

    socket.on('connect', () => {
      console.log(`🔌 [WEBSOCKET CLIENT] Connected to server. Joining room order:${id}...`);
      socket.emit('join-order-room', id);
    });

    socket.on('orderStatusUpdated', (data) => {
      console.log('🔌 [WEBSOCKET CLIENT] Received live order status update:', data);
      if (data.orderId === id) {
        setLocalStatus(data.status);
        // Refresh context orders list to keep the rest of the application synchronized
        loadOrders();
      }
    });

    return () => {
      console.log(`🔌 [WEBSOCKET CLIENT] Disconnecting socket for order:${id}...`);
      socket.disconnect();
    };
  }, [id, loadOrders]);

  useEffect(() => {
    // Dynamically load Leaflet.js assets
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

  useEffect(() => {
    if (!leafletLoaded || !order) return;

    const L = window.L;
    const mapElement = document.getElementById('osm-map');
    if (!mapElement || mapElement._leaflet_id) return; // Already loaded

    const restCoords = [restaurant?.lat || 12.9279, restaurant?.lng || 77.6271];
    const customerCoords = [12.9716, 77.5946];

    // Center map between restaurant and customer
    const centerLat = (restCoords[0] + customerCoords[0]) / 2;
    const centerLng = (restCoords[1] + customerCoords[1]) / 2;
    
    const map = L.map('osm-map', { zoomControl: false }).setView([centerLat, centerLng], 12);
    
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Setup Custom Icons
    const restIcon = L.divIcon({
      className: 'custom-div-icon',
      html: `<div class="bg-emerald-500 text-white p-2 rounded-full shadow-lg border-2 border-white text-sm">🏪</div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    const destIcon = L.divIcon({
      className: 'custom-div-icon',
      html: `<div class="bg-red-500 text-white p-2 rounded-full shadow-lg border-2 border-white text-sm">🏡</div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    // Add Markers
    L.marker(restCoords, { icon: restIcon }).addTo(map).bindPopup(`<strong>${order.restaurantName}</strong><br/>Pickup`);
    L.marker(customerCoords, { icon: destIcon }).addTo(map).bindPopup('<strong>Customer Address</strong><br/>Delivery Point');

    // Add dashed polyline path
    L.polyline([restCoords, customerCoords], {
      color: '#10b981',
      weight: 4,
      dashArray: '5, 10',
      opacity: 0.8
    }).addTo(map);

    // Calculate courier marker placement
    let progress = 0;
    if (localStatus === 'Preparing') progress = 0.15;
    else if (localStatus === 'Ready for Pickup') progress = 0.35;
    else if (localStatus === 'Out for Delivery') progress = 0.7;
    else if (localStatus === 'Delivered') progress = 1.0;

    const courierLat = restCoords[0] + (customerCoords[0] - restCoords[0]) * progress;
    const courierLng = restCoords[1] + (customerCoords[1] - restCoords[1]) * progress;

    const courierIcon = L.divIcon({
      className: 'custom-div-icon',
      html: `<div class="bg-slate-900 border-2 border-emerald-400 text-white p-2 rounded-full shadow-2xl text-base animate-pulse">${deliveryIcon}</div>`,
      iconSize: [36, 36],
      iconAnchor: [18, 18]
    });

    L.marker([courierLat, courierLng], { icon: courierIcon }).addTo(map).bindPopup('<strong>Courier</strong>');

    // Fit boundary bounds
    const bounds = L.latLngBounds([restCoords, customerCoords]);
    map.fitBounds(bounds, { padding: [50, 50] });

    return () => {
      map.remove();
    };
  }, [leafletLoaded, order, localStatus, restaurant, deliveryIcon]);

  // Simulate progress manually or via timer
  const handleSimulateStep = () => {
    if (!order) return;
    const currentIndex = statusSteps.indexOf(localStatus);
    
    if (currentIndex < statusSteps.length - 1) {
      const nextStatus = statusSteps[currentIndex + 1];
      updateOrderStatus(order.id, nextStatus);
    }
  };

  const resetSimulation = () => {
    if (!order) return;
    updateOrderStatus(order.id, 'Order Received');
  };

  if (!order) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center font-sans text-center px-4">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Order Not Found</h2>
        <p className="text-sm text-slate-500 mt-2">The order ID "{id}" is invalid or has expired.</p>
        <Link to="/" className="mt-5 px-5 py-3 bg-emerald-500 text-white font-bold rounded-xl shadow">
          Back to Listings
        </Link>
      </div>
    );
  }

  const currentStepIndex = statusSteps.indexOf(localStatus);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Title row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-2 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-xl">
                <Navigation className="w-5 h-5 animate-pulse-slow" />
              </span>
              <h1 className="text-2xl font-black text-slate-850 dark:text-white font-sans tracking-tight">
                Track Current Order
              </h1>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Order ID: <span className="font-bold text-slate-700 dark:text-slate-350">{order.id}</span> | Sourced from {order.restaurantName}
            </p>
          </div>
 
          {/* Simulator controls */}
          <div className="flex space-x-2 shrink-0">
            <button
              onClick={handleSimulateStep}
              disabled={localStatus === 'Delivered'}
              className={`px-4.5 py-2 rounded-xl text-xs font-bold transition-all border flex items-center cursor-pointer ${
                localStatus === 'Delivered'
                  ? 'bg-slate-100 text-slate-400 border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-500 cursor-not-allowed'
                  : 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-950/50'
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1" />
              Advance Status
            </button>
            <button
              onClick={resetSimulation}
              className="px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-202 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-655 dark:text-slate-350 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
            >
              Reset
            </button>
          </div>
        </div>
 
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Timeline & Map */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Live status timeline card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-3xl p-6">
              <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider mb-6 flex items-center">
                <Clock className="w-4 h-4 mr-1.5 text-emerald-500" />
                Live Status Timeline
              </h3>
 
              {/* Graphical timeline */}
              <div className="grid grid-cols-4 gap-2 relative mb-8">
                {/* Horizontal progress bar */}
                <div className="absolute top-4 left-[12%] right-[12%] h-1 bg-slate-100 dark:bg-slate-800 rounded z-0 flex items-center">
                  <div
                    className="h-full bg-emerald-500 rounded transition-all duration-1000 ease-out relative"
                    style={{ width: `${(currentStepIndex / 3) * 100}%` }}
                  >
                    {/* Tiny moving vehicle on upper line */}
                    <div 
                      className="absolute -right-3.5 -top-3 bg-emerald-600 dark:bg-emerald-500 text-white rounded-full p-1 shadow-md border border-white dark:border-slate-800 text-[10px] transition-all duration-500 animate-pulse"
                    >
                      {deliveryIcon}
                    </div>
                  </div>
                </div>
 
                {statusSteps.map((step, index) => {
                  const isCompleted = index <= currentStepIndex;
                  const isCurrent = index === currentStepIndex;
                  
                  return (
                    <div key={step} className="flex flex-col items-center text-center z-10">
                      <div className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all ${
                        isCompleted
                          ? 'bg-emerald-500 border-emerald-600 text-white shadow-md shadow-emerald-500/10'
                          : 'bg-white dark:bg-slate-900 border-slate-202 dark:border-slate-800 text-slate-400'
                      } ${isCurrent ? 'ring-4 ring-emerald-500/20 scale-105' : ''}`}>
                        {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <span className="text-xs font-bold">{index + 1}</span>}
                      </div>
                      <span className={`text-[10px] sm:text-xs font-extrabold mt-3 block ${
                        isCurrent 
                          ? 'text-emerald-500 dark:text-emerald-400' 
                          : (isCompleted ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400')
                      }`}>
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>
 
              {/* Status descriptive summary */}
              <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-start">
                <span className="text-xl mr-2.5">🌿</span>
                <div className="text-xs text-slate-550 dark:text-slate-400">
                  {localStatus === 'Order Received' && 'We have dispatched your checkout data to the eco-kitchen. Preparing to select biodegradable packaging materials.'}
                  {localStatus === 'Preparing' && 'The kitchen is sorting organic locally sourced ingredients. Preparing items to pack in returnable Bento boxes/Compostable containers.'}
                  {localStatus === 'Out for Delivery' && `Your ${order.deliveryMethod} delivery courier is en route. Emitting zero emissions along the path.`}
                  {localStatus === 'Delivered' && 'The order has been handed over! Reusable Bento containers can be returned on your next dining order. Thank you for eating green!'}
                </div>
              </div>
            </div>
 
            {/* OpenStreetMap Logistics Board */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden relative z-10">
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                <h3 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center">
                  <Map className="w-4 h-4 mr-1.5 text-emerald-500" />
                  OpenStreetMap Zero-Carbon Logistics
                </h3>
                <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                  Live Route Map
                </span>
              </div>

              {/* OSM Map Div container */}
              <div id="osm-map" className="h-72 w-full bg-slate-100 dark:bg-slate-950 relative z-10" style={{ minHeight: '300px' }} />
            </div>

          </div>

          {/* Right Column: Order Summary info */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-5">
              <h3 className="text-sm font-black text-slate-850 dark:text-white uppercase tracking-wider pb-3 border-b border-slate-100 dark:border-slate-800">
                Logistics Summary
              </h3>

              <div className="space-y-3.5 text-xs text-slate-655 dark:text-slate-350">
                <div className="flex justify-between">
                  <span className="font-semibold">Sourced Kitchen</span>
                  <span className="font-bold text-slate-800 dark:text-slate-100">{order.restaurantName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Logistics Fleet</span>
                  <span className="font-bold text-slate-800 dark:text-slate-100">{order.deliveryMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Packaging Class</span>
                  <span className="font-bold text-slate-800 dark:text-slate-100">{order.packagingChoice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Delivery Address</span>
                  <span className="font-bold text-slate-800 dark:text-slate-100 truncate max-w-[150px]" title={order.address}>
                    {order.address}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Invoice Paid</span>
                  <span className="font-extrabold text-slate-800 dark:text-slate-100">₹{order.total}</span>
                </div>
              </div>

              {/* Green Logistics Status */}
              <div className="border border-dashed border-slate-205 dark:border-slate-800 rounded-2xl p-4 space-y-2">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Green Logistics Status</h4>
                <div className="flex items-center text-[10px] font-extrabold text-emerald-605 dark:text-emerald-400">
                  <Sparkles className="w-3.5 h-3.5 mr-1" />
                  Eco Logistics Active
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal">
                  This order uses sustainable packaging and low-emission courier logistics to ensure a minimal footprint.
                </p>
              </div>

              <Link
                to="/"
                className="w-full mt-6 py-3 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm rounded-xl flex items-center justify-center shadow shadow-emerald-500/10 cursor-pointer"
              >
                Back to Home Listings
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
