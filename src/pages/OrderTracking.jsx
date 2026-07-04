import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import ProgressBar from '../components/Common/ProgressBar';
import EcoBadge from '../components/Common/EcoBadge';
import { CheckCircle2, Navigation, Clock, ShieldAlert, Sparkles, Map, RefreshCw } from 'lucide-react';

export default function OrderTracking() {
  const { id } = useParams();
  const { orders, updateOrderStatus } = useApp();
  
  const order = orders.find(o => o.id === id);

  // Simulation steps
  const statusSteps = ['Order Received', 'Preparing', 'Out for Delivery', 'Delivered'];
  
  // Custom mock map animation state (progress along delivery route: 0 to 100)
  const [mapProgress, setMapProgress] = useState(15);
  
  useEffect(() => {
    if (!order) return;

    // Set initial map progress based on order status
    if (order.status === 'Order Received') setMapProgress(10);
    else if (order.status === 'Preparing') setMapProgress(35);
    else if (order.status === 'Out for Delivery') setMapProgress(70);
    else if (order.status === 'Delivered') setMapProgress(100);
  }, [order]);

  // Simulate progress manually or via timer
  const handleSimulateStep = () => {
    if (!order) return;
    const currentIndex = statusSteps.indexOf(order.status);
    
    if (currentIndex < statusSteps.length - 1) {
      const nextStatus = statusSteps[currentIndex + 1];
      updateOrderStatus(order.id, nextStatus);
      
      // Update map tracking progress
      if (nextStatus === 'Preparing') setMapProgress(35);
      if (nextStatus === 'Out for Delivery') setMapProgress(70);
      if (nextStatus === 'Delivered') setMapProgress(100);
    }
  };

  const resetSimulation = () => {
    if (!order) return;
    updateOrderStatus(order.id, 'Order Received');
    setMapProgress(10);
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

  const currentStepIndex = statusSteps.indexOf(order.status);

  // Determine delivery icon
  const deliveryIcon = {
    Bicycle: '🚲',
    'Electric Vehicle': '⚡',
    'Solar Drone': '🛸'
  }[order.deliveryMethod] || '🚚';

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
              disabled={order.status === 'Delivered'}
              className={`px-4.5 py-2 rounded-xl text-xs font-bold transition-all border flex items-center cursor-pointer ${
                order.status === 'Delivered'
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
                <div className="absolute top-4 left-[12%] right-[12%] h-1 bg-slate-100 dark:bg-slate-800 rounded z-0">
                  <div
                    className="h-full bg-emerald-500 rounded transition-all duration-1000 ease-out"
                    style={{ width: `${(currentStepIndex / 3) * 100}%` }}
                  />
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
                  {order.status === 'Order Received' && 'We have dispatched your checkout data to the eco-kitchen. Preparing to select biodegradable packaging materials.'}
                  {order.status === 'Preparing' && 'The kitchen is sorting organic locally sourced ingredients. Preparing items to pack in returnable Bento boxes/Compostable containers.'}
                  {order.status === 'Out for Delivery' && `Your ${order.deliveryMethod} delivery courier is en route. Emitting zero emissions along the path.`}
                  {order.status === 'Delivered' && 'The order has been handed over! Reusable Bento containers can be returned on your next dining order. Thank you for eating green!'}
                </div>
              </div>
            </div>

            {/* Google Maps Simulation Visual Board */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden">
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                <h3 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center">
                  <Map className="w-4 h-4 mr-1.5 text-emerald-500" />
                  Google Maps Logistics Tracker
                </h3>
                <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                  Live coordinates
                </span>
              </div>

              {/* Simulated Map Canvas */}
              <div className="relative h-64 bg-slate-100 dark:bg-slate-950 overflow-hidden flex items-center justify-center p-4">
                
                {/* Mock Grid Lines */}
                <div className="absolute inset-0 grid grid-cols-12 grid-rows-6 opacity-30 select-none pointer-events-none">
                  {Array.from({ length: 72 }).map((_, i) => (
                    <div key={i} className="border-r border-b border-slate-300 dark:border-slate-800/80" />
                  ))}
                </div>

                {/* Simulated Green Park / Forest Graphic */}
                <div className="absolute w-24 h-16 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full filter blur-md left-[10%] top-[30%]" />
                <div className="absolute w-32 h-20 bg-teal-500/10 dark:bg-teal-500/5 rounded-full filter blur-lg right-[20%] bottom-[15%]" />

                {/* Dotted Delivery Route Path */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M 120, 80 Q 250, 160 380, 70 T 640, 180" 
                    fill="none" 
                    stroke="#10b981" 
                    strokeWidth="3.5" 
                    strokeDasharray="6, 6" 
                    className="opacity-70"
                    id="route-path"
                  />
                </svg>

                {/* Restaurant Marker */}
                <div className="absolute left-[120px] top-[80px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
                  <div className="bg-emerald-500 text-white p-2 rounded-full shadow-lg shadow-emerald-500/25 border-2 border-white dark:border-slate-900">
                    🏪
                  </div>
                  <span className="text-[9px] font-bold text-slate-700 bg-white/90 dark:bg-slate-900/90 dark:text-slate-300 px-1.5 py-0.5 rounded shadow mt-1 whitespace-nowrap">
                    {order.restaurantName.split(' ')[0]}
                  </span>
                </div>

                {/* User Address Destination Marker */}
                <div className="absolute left-[640px] top-[180px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
                  <div className="bg-red-500 text-white p-2 rounded-full shadow-lg shadow-red-500/25 border-2 border-white dark:border-slate-900">
                    🏡
                  </div>
                  <span className="text-[9px] font-bold text-slate-700 bg-white/90 dark:bg-slate-900/90 dark:text-slate-300 px-1.5 py-0.5 rounded shadow mt-1 whitespace-nowrap">
                    Destination
                  </span>
                </div>

                {/* Animated Courier Courier Moving marker */}
                <div
                  className="absolute z-20 -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ease-out"
                  style={{
                    // Approximate path positioning using linear interpolation
                    left: `${120 + (640 - 120) * (mapProgress / 100)}px`,
                    top: `${80 + (180 - 80) * (mapProgress / 100) + Math.sin((mapProgress / 100) * Math.PI) * 40}px`
                  }}
                >
                  <div className="h-10 w-10 bg-slate-900 dark:bg-slate-800 text-xl border-2 border-emerald-400 rounded-full flex items-center justify-center shadow-2xl animate-bounce-slow">
                    {deliveryIcon}
                  </div>
                </div>

                <div className="absolute bottom-3 left-4 text-[10px] text-slate-400 dark:text-slate-500 font-bold bg-white/80 dark:bg-slate-900/80 px-2 py-0.5 rounded">
                  EV Fleet Carbon Factor: 20g/km
                </div>
              </div>
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

              {/* Reforestation summary badge */}
              <div className="border border-dashed border-slate-205 dark:border-slate-800 rounded-2xl p-4 space-y-2">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Environmental Impact</h4>
                <div className="flex flex-wrap gap-1.5">
                  <EcoBadge type="carbon" value={order.carbonFootprint} />
                  <EcoBadge type="saving" value={order.carbonSaved} />
                </div>
                {order.treesPlanted > 0 && (
                  <div className="flex items-center text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 pt-1">
                    <Sparkles className="w-3.5 h-3.5 mr-1" />
                    Planted {order.treesPlanted} real sapling!
                  </div>
                )}
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
