import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';
import Modal from '../components/Common/Modal';
import Alert from '../components/Common/Alert';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);
import { 
  ShieldAlert, 
  LayoutDashboard, 
  Store, 
  Utensils, 
  Folder, 
  ClipboardList, 
  Gift, 
  Star, 
  BarChart3, 
  Plus, 
  Edit, 
  Trash2, 
  Tag, 
  Clock, 
  Phone, 
  MapPin, 
  Search, 
  Check, 
  X,
  FileText,
  Package,
  Users,
  ShoppingCart,
  Flame,
  AlertCircle,
  TrendingUp
} from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const {
    restaurants,
    foodItems,
    orders,
    reviews,
    addRestaurant,
    updateRestaurant,
    deleteRestaurant,
    updateOrderStatus,
    addFoodItem,
    updateFoodItem,
    deleteFoodItem
  } = useApp();

  const [activeTab, setActiveTab] = useState('dashboard'); 
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  // Modals state
  const [isRestModalOpen, setIsRestModalOpen] = useState(false);
  const [isFoodModalOpen, setIsFoodModalOpen] = useState(false);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // Restaurant form state
  const [restFormId, setRestFormId] = useState(null);
  const [restFormName, setRestFormName] = useState('');
  const [restFormImage, setRestFormImage] = useState('');
  const [restFormLocation, setRestFormLocation] = useState('');
  const [restFormAddress, setRestFormAddress] = useState('');
  const [restFormContact, setRestFormContact] = useState('');
  const [restFormTimings, setRestFormTimings] = useState('');
  const [restFormDesc, setRestFormDesc] = useState('');
  const [restFormCerts, setRestFormCerts] = useState('Plastic Free, Local Ingredients');

  // Food Item form state
  const [foodFormId, setFoodFormId] = useState(null);
  const [foodFormName, setFoodFormName] = useState('');
  const [foodFormPrice, setFoodFormPrice] = useState('');
  const [foodFormDesc, setFoodFormDesc] = useState('');
  const [foodFormImage, setFoodFormImage] = useState('');
  const [foodFormRestId, setFoodFormRestId] = useState('');
  const [foodFormOrganic, setFoodFormOrganic] = useState(false);
  const [foodFormVegan, setFoodFormVegan] = useState(false);
  const [foodFormLocal, setFoodFormLocal] = useState(false);
  const [foodFormPopular, setFoodFormPopular] = useState(false);

  // Categories list in state
  const [categories, setCategories] = useState([
    'Salads', 'Bowls', 'Smoothies', 'Healthy', 'Burgers', 'Pasta', 'Coffee', 'Desserts', 'Pizzas', 'Vegan Tacos'
  ]);
  const [categoryFormName, setCategoryFormName] = useState('');
  const [editCategoryIndex, setEditCategoryIndex] = useState(null);

  // Offers list in state
  const [offers, setOffers] = useState([
    { id: 'off-1', code: 'ECOEATS20', discount: '20% OFF', description: '20% discount on order value above ₹500', active: true },
    { id: 'off-2', code: 'GREENFRIDAY', discount: '₹100 OFF', description: 'Flat ₹100 discount on select organic restaurants', active: true },
    { id: 'off-3', code: 'FREECOMMUTE', discount: 'Free Delivery', description: 'Zero delivery fee for EV/Bicycle options', active: false }
  ]);
  const [offerFormId, setOfferFormId] = useState(null);
  const [offerFormCode, setOfferFormCode] = useState('');
  const [offerFormDiscount, setOfferFormDiscount] = useState('');
  const [offerFormDesc, setOfferFormDesc] = useState('');
  const [offerFormActive, setOfferFormActive] = useState(true);

  // Search queries
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [foodSearchQuery, setFoodSearchQuery] = useState('');

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center font-sans text-center px-4">
        <ShieldAlert className="w-16 h-16 text-amber-500 mb-4 animate-bounce" />
        <h2 className="text-2xl font-black text-slate-800 dark:text-white">Admin Authentication Required</h2>
        <p className="text-sm text-slate-500 mt-2 max-w-sm">
          Please login with administrator credentials (admin@ecoeats.com / password) to access inventories and sales analytics.
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

  const getLocalDateString = (dateInput) => {
    if (!dateInput) return '';
    const str = String(dateInput).trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
      return str;
    }
    try {
      const d = new Date(str);
      if (isNaN(d.getTime())) return '';
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch (e) {
      return '';
    }
  };

  // Dynamic date-based filtering
  const filteredOrdersByDate = selectedDate
    ? orders.filter(o => o.date && getLocalDateString(o.date) === selectedDate)
    : orders;

  const filteredReviewsByDate = selectedDate
    ? reviews.filter(r => r.date && getLocalDateString(r.date) === selectedDate)
    : reviews;

  // Financial and loyalty rewards calculations based on filtered results
  const totalRevenue = filteredOrdersByDate.reduce((sum, o) => sum + o.total, 0);
  const totalPointsRedeemed = filteredOrdersByDate.length * 110 + (selectedDate ? 0 : 450); 
  const averageOrderValue = filteredOrdersByDate.length ? totalRevenue / filteredOrdersByDate.length : 0;

  // Dynamic Best Selling Item calculation
  let bestSellingItem = 'None';
  let maxQty = 0;
  const dishSales = {};
  filteredOrdersByDate.forEach(o => {
    o.items?.forEach(item => {
      dishSales[item.name] = (dishSales[item.name] || 0) + item.quantity;
    });
  });
  Object.entries(dishSales).forEach(([name, qty]) => {
    if (qty > maxQty) {
      maxQty = qty;
      bestSellingItem = name;
    }
  });
  if (bestSellingItem === 'None' && filteredOrdersByDate.length === 0) {
    bestSellingItem = 'N/A';
  } else if (bestSellingItem === 'None') {
    bestSellingItem = 'Avocabo Salad'; // Default fallback
  }

  // ChartJS Data Configurations
  const salesChartData = {
    labels: selectedDate 
      ? ['09:00', '12:00', '15:00', '18:00', '21:00']
      : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Sales (₹)',
        data: selectedDate
          ? (() => {
              const hourly = [0, 0, 0, 0, 0];
              filteredOrdersByDate.forEach(o => {
                try {
                  const h = new Date(o.date).getHours();
                  if (h < 11) hourly[0] += o.total;
                  else if (h < 14) hourly[1] += o.total;
                  else if (h < 17) hourly[2] += o.total;
                  else if (h < 20) hourly[3] += o.total;
                  else hourly[4] += o.total;
                } catch (err) {
                  hourly[2] += o.total;
                }
              });
              return hourly;
            })()
          : [2100, 1400, 3100, 2400, 3800, 4500, 3500],
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.3,
        pointBackgroundColor: '#10B981',
        pointHoverRadius: 6
      }
    ]
  };

  const salesChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { cornerRadius: 8, backgroundColor: '#0B0F19' }
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#94A3B8', font: { family: 'Outfit', size: 10 } } },
      y: { grid: { color: 'rgba(148, 163, 184, 0.08)' }, ticks: { color: '#94A3B8', font: { family: 'Outfit', size: 10 } } }
    }
  };

  const orderChartData = {
    labels: selectedDate
      ? ['Bicycle 🚲', 'EV ⚡', 'Eco-Walk 🚶']
      : ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Orders',
        data: selectedDate
          ? (() => {
              const delivery = [0, 0, 0];
              filteredOrdersByDate.forEach(o => {
                const method = (o.deliveryMethod || '').toLowerCase();
                if (method.includes('bicycle')) delivery[0]++;
                else if (method.includes('electric') || method.includes('ev')) delivery[1]++;
                else delivery[2]++;
              });
              return delivery;
            })()
          : [14, 26, 20, 36],
        backgroundColor: '#0EA5E9',
        borderRadius: 6,
        barThickness: selectedDate ? 24 : 16
      }
    ]
  };

  const orderChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { cornerRadius: 8, backgroundColor: '#0B0F19' }
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#94A3B8', font: { family: 'Outfit', size: 10 } } },
      y: { grid: { color: 'rgba(148, 163, 184, 0.08)' }, ticks: { color: '#94A3B8', font: { family: 'Outfit', size: 10 } } }
    }
  };

  const formatCurrency = (val) => {
    return `₹${val.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  };

  // RESTAURANTS CRUD HANDLERS
  const openRestAddModal = () => {
    setRestFormId(null);
    setRestFormName('');
    setRestFormImage('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80');
    setRestFormLocation('Sector 4, Green Glen Layout');
    setRestFormAddress('Plot 15, Emerald Plaza, Green Glen Layout, Bengaluru');
    setRestFormContact('+91 98765 43210');
    setRestFormTimings('09:00 AM - 10:00 PM');
    setRestFormDesc('');
    setRestFormCerts('Plastic Free, Compostable Only');
    setIsRestModalOpen(true);
  };

  const openRestEditModal = (rest) => {
    setRestFormId(rest.id);
    setRestFormName(rest.name);
    setRestFormImage(rest.image);
    setRestFormLocation(rest.location);
    setRestFormAddress(rest.address || 'Plot 15, Emerald Plaza, Green Glen Layout, Bengaluru');
    setRestFormContact(rest.contact || '+91 98765 43210');
    setRestFormTimings(rest.timings || '09:00 AM - 10:00 PM');
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
      address: restFormAddress,
      contact: restFormContact,
      timings: restFormTimings,
      description: restFormDesc,
      certifications: certsArray
    };

    if (restFormId) {
      updateRestaurant({ ...payload, id: restFormId });
      setSuccessMsg('Sustainable hotel details updated successfully!');
    } else {
      addRestaurant(payload);
      setSuccessMsg('New sustainable hotel registered successfully!');
    }

    setTimeout(() => {
      setSuccessMsg('');
      setIsRestModalOpen(false);
    }, 1500);
  };

  // FOOD ITEMS CRUD HANDLERS
  const openFoodAddModal = () => {
    setFoodFormId(null);
    setFoodFormName('');
    setFoodFormPrice('');
    setFoodFormDesc('');
    setFoodFormImage('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80');
    setFoodFormRestId(restaurants[0]?.id || '');
    setFoodFormOrganic(true);
    setFoodFormVegan(true);
    setFoodFormLocal(true);
    setFoodFormPopular(false);
    setIsFoodModalOpen(true);
  };

  const openFoodEditModal = (item) => {
    setFoodFormId(item.id);
    setFoodFormName(item.name);
    setFoodFormPrice(item.price);
    setFoodFormDesc(item.description);
    setFoodFormImage(item.image);
    setFoodFormRestId(item.restaurantId);
    setFoodFormOrganic(item.organic);
    setFoodFormVegan(item.vegan);
    setFoodFormLocal(item.localSourced);
    setFoodFormPopular(item.popular);
    setIsFoodModalOpen(true);
  };

  const handleFoodSubmit = (e) => {
    e.preventDefault();
    const payload = {
      name: foodFormName,
      price: Number(foodFormPrice),
      description: foodFormDesc,
      image: foodFormImage,
      restaurantId: foodFormRestId,
      organic: foodFormOrganic,
      vegan: foodFormVegan,
      localSourced: foodFormLocal,
      popular: foodFormPopular
    };

    if (foodFormId) {
      updateFoodItem({ ...payload, id: foodFormId });
      setSuccessMsg('Food menu item updated successfully!');
    } else {
      addFoodItem(payload);
      setSuccessMsg('New food menu item added successfully!');
    }

    setTimeout(() => {
      setSuccessMsg('');
      setIsFoodModalOpen(false);
    }, 1500);
  };

  // CATEGORIES HANDLERS
  const openCategoryAddModal = () => {
    setEditCategoryIndex(null);
    setCategoryFormName('');
    setIsCategoryModalOpen(true);
  };

  const openCategoryEditModal = (index) => {
    setEditCategoryIndex(index);
    setCategoryFormName(categories[index]);
    setIsCategoryModalOpen(true);
  };

  const handleCategorySubmit = (e) => {
    e.preventDefault();
    if (!categoryFormName.trim()) return;

    if (editCategoryIndex !== null) {
      const updated = [...categories];
      updated[editCategoryIndex] = categoryFormName.trim();
      setCategories(updated);
      setSuccessMsg('Category updated successfully!');
    } else {
      setCategories([...categories, categoryFormName.trim()]);
      setSuccessMsg('New category added successfully!');
    }

    setTimeout(() => {
      setSuccessMsg('');
      setIsCategoryModalOpen(false);
    }, 1200);
  };

  const deleteCategory = (index) => {
    if (confirm('Are you sure you want to delete this category?')) {
      setCategories(categories.filter((_, idx) => idx !== index));
      setSuccessMsg('Category removed.');
      setTimeout(() => setSuccessMsg(''), 1000);
    }
  };

  // OFFERS HANDLERS
  const openOfferAddModal = () => {
    setOfferFormId(null);
    setOfferFormCode('');
    setOfferFormDiscount('');
    setOfferFormDesc('');
    setOfferFormActive(true);
    setIsOfferModalOpen(true);
  };

  const openOfferEditModal = (offer) => {
    setOfferFormId(offer.id);
    setOfferFormCode(offer.code);
    setOfferFormDiscount(offer.discount);
    setOfferFormDesc(offer.description);
    setOfferFormActive(offer.active);
    setIsOfferModalOpen(true);
  };

  const handleOfferSubmit = (e) => {
    e.preventDefault();
    const payload = {
      id: offerFormId || `off-${Date.now()}`,
      code: offerFormCode.toUpperCase(),
      discount: offerFormDiscount,
      description: offerFormDesc,
      active: offerFormActive
    };

    if (offerFormId) {
      setOffers(offers.map(o => o.id === offerFormId ? payload : o));
      setSuccessMsg('Discount coupon code updated!');
    } else {
      setOffers([...offers, payload]);
      setSuccessMsg('New discount coupon registered!');
    }

    setTimeout(() => {
      setSuccessMsg('');
      setIsOfferModalOpen(false);
    }, 1200);
  };

  const deleteOffer = (id) => {
    if (confirm('Delete this coupon code?')) {
      setOffers(offers.filter(o => o.id !== id));
      setSuccessMsg('Coupon removed.');
      setTimeout(() => setSuccessMsg(''), 1000);
    }
  };

  const handleStatusUpdate = async (orderId, status) => {
    try {
      const data = await updateOrderStatus(orderId, status);
      if (data && data.success) {
        if (status === 'Delivered') {
          const recipient = data.recipient || 'user@ecoeats.com';
          setSuccessMsg(`📧 Feedback Request successfully sent to customer (${recipient})!`);
          setTimeout(() => {
            setSuccessMsg('');
          }, 6000);
        } else {
          setSuccessMsg(`Order status updated to "${status}" successfully!`);
          setTimeout(() => {
            setSuccessMsg('');
          }, 3000);
        }
      } else {
        setErrorMsg(data?.message || 'Failed to update order status.');
        setTimeout(() => setErrorMsg(''), 3000);
      }
    } catch (err) {
      setErrorMsg('Error updating order status.');
      setTimeout(() => setErrorMsg(''), 3000);
    }
  };

  // Filtering
  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
    o.restaurantName.toLowerCase().includes(orderSearchQuery.toLowerCase())
  );

  const filteredFoodItems = foodItems.filter(item => 
    item.name.toLowerCase().includes(foodSearchQuery.toLowerCase()) ||
    (restaurants.find(r => r.id === item.restaurantId)?.name || '').toLowerCase().includes(foodSearchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Title Block */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-2 bg-emerald-500 rounded-xl text-white">
                🛡️
              </span>
              <h1 className="text-2xl font-black text-slate-805 dark:text-white font-sans tracking-tight">
                EcoEats Operations Control
              </h1>
            </div>
            <p className="text-xs text-slate-450 dark:text-slate-400 mt-1">
              Authorized backend management of sustainable hotel assets, menu inventory, discount incentives, and operations pipeline.
            </p>
          </div>
        </div>

        {/* Alerts Banner */}
        {successMsg && (
          <div className="mb-4">
            <Alert type="success" message={successMsg} />
          </div>
        )}
        {errorMsg && (
          <div className="mb-4">
            <Alert type="error" message={errorMsg} />
          </div>
        )}

        {/* Tab Selection Row */}
        <div className="flex border-b border-slate-205 dark:border-slate-800 overflow-x-auto scrollbar-none gap-1">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4 mr-1.5" /> },
            { id: 'hotels', label: 'Hotel Details', icon: <Store className="w-4 h-4 mr-1.5" /> },
            { id: 'orders', label: 'Orders Pipeline', icon: <ClipboardList className="w-4 h-4 mr-1.5" /> },
            { id: 'offers', label: 'Offers', icon: <Gift className="w-4 h-4 mr-1.5" /> },
            { id: 'reviews', label: 'Reviews', icon: <Star className="w-4 h-4 mr-1.5" /> },
            { id: 'reports', label: 'Reports', icon: <BarChart3 className="w-4 h-4 mr-1.5" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors duration-250 cursor-pointer ${
                activeTab === tab.id
                  ? 'border-emerald-500 text-emerald-600 dark:text-emerald-450'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

               {/* SECTION 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            
            {/* Date Selector Row */}
            <div className="neumo-card p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-805 dark:text-white">Filter Dashboard Analytics</h4>
                <p className="text-[10px] text-slate-400">Select a specific calendar day to isolate revenue, logistics, and customer scores.</p>
              </div>
              <div className="flex items-center space-x-3 w-full sm:w-auto">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={e => setSelectedDate(e.target.value)}
                  className="px-3.5 py-1.5 text-xs neumo-input rounded-xl text-slate-800 dark:text-white focus:outline-none w-full sm:w-auto"
                />
                {selectedDate && (
                  <button
                    onClick={() => setSelectedDate('')}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-[10px] font-bold text-slate-655 dark:text-slate-300 rounded-xl transition-all cursor-pointer whitespace-nowrap"
                  >
                    Clear Filter
                  </button>
                )}
              </div>
            </div>

            {/* Main Dashboard Cards */}
            <div>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Main Dashboard Cards</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                <div className="neumo-card p-6 rounded-3xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Total Orders</span>
                    <span className="text-2xl font-black text-slate-800 dark:text-white mt-1 block">{filteredOrdersByDate.length}</span>
                  </div>
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/20 text-blue-500 dark:text-blue-450 rounded-2xl">
                    <Package className="w-6 h-6" />
                  </div>
                </div>

                <div className="neumo-card p-6 rounded-3xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Total Revenue</span>
                    <span className="text-2xl font-black text-slate-805 dark:text-white mt-1 block">{formatCurrency(totalRevenue)}</span>
                  </div>
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 dark:text-emerald-450 rounded-2xl">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                </div>

                <div className="neumo-card p-6 rounded-3xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Today's Orders</span>
                    <span className="text-2xl font-black text-slate-805 dark:text-white mt-1 block">
                      {filteredOrdersByDate.filter(o => o.status === 'Preparing').length}
                    </span>
                  </div>
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/20 text-amber-500 dark:text-amber-450 rounded-2xl">
                    <ShoppingCart className="w-6 h-6" />
                  </div>
                </div>

                <div className="neumo-card p-6 rounded-3xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Total Customers</span>
                    <span className="text-2xl font-black text-slate-805 dark:text-white mt-1 block">
                      {selectedDate
                        ? new Set(filteredOrdersByDate.map(o => o.userName)).size
                        : Math.max(12, new Set(orders.map(o => o.userName)).size)}
                    </span>
                  </div>
                  <div className="p-3 bg-teal-50 dark:bg-teal-950/20 text-teal-500 dark:text-teal-450 rounded-2xl">
                    <Users className="w-6 h-6" />
                  </div>
                </div>

              </div>
            </div>

            {/* Quick Statistics */}
            <div>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Quick Statistics</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                <div className="neumo-card p-5 rounded-2xl flex items-center space-x-3.5">
                  <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 dark:text-emerald-400 rounded-xl">
                    <Utensils className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
                      {selectedDate ? 'Dishes Sold' : 'Total Food Items'}
                    </span>
                    <span className="text-base font-black text-slate-805 dark:text-white block mt-0.5">
                      {selectedDate
                        ? filteredOrdersByDate.flatMap(o => o.items || []).reduce((sum, item) => sum + item.quantity, 0)
                        : (foodItems.length || 28)}
                    </span>
                  </div>
                </div>

                <div className="neumo-card p-5 rounded-2xl flex items-center space-x-3.5">
                  <div className="p-2.5 bg-amber-50 dark:bg-amber-950/20 text-amber-500 dark:text-amber-400 rounded-xl">
                    <Star className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Average Rating</span>
                    <span className="text-base font-black text-slate-805 dark:text-white block mt-0.5">
                      {filteredReviewsByDate.length 
                        ? (filteredReviewsByDate.reduce((sum, r) => sum + r.rating, 0) / filteredReviewsByDate.length).toFixed(1)
                        : 'N/A'} {filteredReviewsByDate.length ? '/ 5.0' : ''}
                    </span>
                  </div>
                </div>

                <div className="neumo-card p-5 rounded-2xl flex items-center space-x-3.5">
                  <div className="p-2.5 bg-orange-50 dark:bg-orange-950/20 text-orange-500 dark:text-orange-400 rounded-xl">
                    <Flame className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Best Selling Item</span>
                    <span className="text-xs font-bold text-slate-805 dark:text-white block mt-0.5 truncate max-w-[140px]" title={bestSellingItem}>
                      {bestSellingItem}
                    </span>
                  </div>
                </div>

                <div className="neumo-card p-5 rounded-2xl flex items-center space-x-3.5">
                  <div className="p-2.5 bg-red-50 dark:bg-red-950/20 text-red-500 dark:text-red-400 rounded-xl">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Out of Stock Items</span>
                    <span className="text-base font-black text-slate-805 dark:text-white block mt-0.5">0 items</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="neumo-card p-6 rounded-3xl space-y-4">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center">
                  <ClipboardList className="w-4 h-4 mr-1.5 text-emerald-500" />
                  Recent Orders
                </h3>
                <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  {filteredOrdersByDate.length === 0 ? (
                    <div className="py-8 text-center text-slate-400 font-bold">No orders recorded on this date.</div>
                  ) : (
                    filteredOrdersByDate.slice(0, 4).map((o, idx) => (
                      <div key={idx} className="py-3 flex justify-between items-center">
                        <div>
                          <span className="font-bold text-slate-805 dark:text-white">Order {o.id}</span>
                          <span className="block text-[9px] text-slate-400 font-normal mt-0.5">{o.restaurantName} • {o.status}</span>
                        </div>
                        <span className="font-bold text-slate-805 dark:text-white">{formatCurrency(o.total)}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="neumo-card p-6 rounded-3xl space-y-4">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center">
                  <Star className="w-4 h-4 mr-1.5 text-amber-500" />
                  Latest Customer Reviews
                </h3>
                <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  {filteredReviewsByDate.length === 0 ? (
                    <div className="py-8 text-center text-slate-400 font-bold">No reviews posted on this date.</div>
                  ) : (
                    filteredReviewsByDate.slice(0, 3).map((r, idx) => {
                      const matchedRest = restaurants.find(res => res.id === r.restaurantId);
                      return (
                        <div key={idx} className="py-2.5 space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-slate-805 dark:text-white">{r.user}</span>
                            <span className="text-[10px] text-amber-500 font-bold">★ {r.rating}.0</span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-455 italic">"{r.comment}"</p>
                          <span className="block text-[8px] text-slate-400">on {matchedRest?.name || 'Sustainable dining'}</span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

             {/* Charts Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="neumo-card p-6 rounded-3xl space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center">
                    <BarChart3 className="w-4 h-4 mr-1.5 text-emerald-500" />
                    {selectedDate ? 'Sales Overview (Hourly Breakdown)' : 'Sales Overview (Daily/Weekly/Monthly)'}
                  </h3>
                  <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-450 uppercase bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">Growth +12%</span>
                </div>
                {/* ChartJS Line Chart */}
                <div className="h-48 pt-2">
                  <Line data={salesChartData} options={salesChartOptions} />
                </div>
              </div>

              <div className="neumo-card p-6 rounded-3xl space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center">
                    <FileText className="w-4 h-4 mr-1.5 text-teal-500" />
                    {selectedDate ? 'Logistics Dispatch Split' : 'Order Trends'}
                  </h3>
                  <span className="text-[9px] font-bold text-teal-605 dark:text-teal-450 uppercase bg-teal-50 dark:bg-teal-950/40 px-2 py-0.5 rounded">High Vol</span>
                </div>
                {/* ChartJS Bar Chart */}
                <div className="h-48 pt-2">
                  <Bar data={orderChartData} options={orderChartOptions} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 2: HOTEL DETAILS */}
        {activeTab === 'hotels' && (
          <div className="neumo-card rounded-3xl p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-slate-850 dark:text-white">Sustainable Hotels ({restaurants.length})</h3>
              <button
                onClick={openRestAddModal}
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 skeuo-button-primary text-xs font-bold rounded-xl"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Hotel</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-205 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="pb-3">Hotel Details</th>
                    <th className="pb-3">Location / Address</th>
                    <th className="pb-3">Contact & Timings</th>
                    <th className="pb-3">Certifications</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-semibold text-slate-700 dark:text-slate-300">
                  {restaurants.map(rest => (
                    <tr key={rest.id}>
                      <td className="py-4 flex items-center space-x-3 pr-2">
                        <img src={rest.image} alt={rest.name} className="w-12 h-12 object-cover rounded-xl shrink-0" />
                        <div>
                          <Link
                            to={`/restaurant/${rest.id}`}
                            className="block text-slate-800 dark:text-white font-bold hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
                          >
                            {rest.name}
                          </Link>
                          <span className="block text-[10px] text-slate-400 font-normal mt-0.5">{rest.tags.join(', ')}</span>
                        </div>
                      </td>
                      <td className="py-4 pr-2">
                        <span className="block text-slate-800 dark:text-white">{rest.location}</span>
                        <span className="block text-[10px] text-slate-400 font-normal mt-0.5">{rest.address || 'Address not listed'}</span>
                      </td>
                      <td className="py-4 pr-2">
                        <span className="block text-slate-800 dark:text-white flex items-center"><Phone className="w-3 h-3 mr-1 text-slate-400" /> {rest.contact || '+91 98765 43210'}</span>
                        <span className="block text-[10px] text-slate-400 font-normal mt-0.5 flex items-center"><Clock className="w-3 h-3 mr-1 text-slate-400" /> {rest.timings || '10:00 AM - 10:00 PM'}</span>
                      </td>
                      <td className="py-4 pr-2 max-w-[150px] truncate" title={rest.certifications.join(', ')}>
                        {rest.certifications.map((c, i) => (
                          <span key={i} className="inline-block bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-[9px] px-1.5 py-0.5 rounded mr-1 mb-1 font-bold">
                            {c}
                          </span>
                        ))}
                      </td>
                      <td className="py-4 text-right space-x-2">
                        <button
                          onClick={() => openRestEditModal(rest)}
                          className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-550 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => { if(confirm('Delete hotel?')) deleteRestaurant(rest.id); }}
                          className="p-1.5 bg-red-50 dark:bg-red-950/20 rounded-lg text-red-500 hover:text-red-750 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>        )}

        {/* SECTION 5: ORDERS */}
        {activeTab === 'orders' && (
          <div className="neumo-card rounded-3xl p-6 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h3 className="text-base font-bold text-slate-850 dark:text-white">Active Orders Logistics ({orders.length})</h3>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search orders by ID or Hotel name..."
                  value={orderSearchQuery}
                  onChange={e => setOrderSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs neumo-input rounded-xl w-full"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-205 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="pb-3">Order ID / Date</th>
                    <th className="pb-3">Address</th>
                    <th className="pb-3">Total Value</th>
                    <th className="pb-3">Current Status</th>
                    <th className="pb-3 text-right">Status Controls</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-semibold text-slate-700 dark:text-slate-350">
                  {filteredOrders.map(order => (
                    <tr key={order.id}>
                      <td className="py-4 pr-2">
                        <span className="block text-slate-805 dark:text-white font-bold">{order.id}</span>
                        <span className="block text-[10px] text-slate-400 font-normal">{order.restaurantName}</span>
                      </td>
                      <td className="py-4 pr-2 max-w-[200px] truncate" title={order.address}>
                        {order.address}
                      </td>
                      <td className="py-4 pr-2 font-bold text-slate-800 dark:text-white">₹{order.total}</td>
                      <td className="py-4 pr-2">
                        <span className={`inline-flex px-2 py-0.5 text-[9px] font-bold uppercase rounded-md ${
                          order.status === 'Delivered'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
                            : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 text-right flex justify-end gap-1.5 flex-wrap">
                        {['Preparing', 'Out for Delivery', 'Delivered'].map(status => (
                          <button
                            key={status}
                            onClick={() => handleStatusUpdate(order.id, status)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 text-[10px] font-bold text-slate-655 dark:bg-slate-850 dark:hover:bg-slate-800 dark:text-slate-305 rounded border border-slate-205 dark:border-slate-800 cursor-pointer"
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

        {/* SECTION 6: OFFERS */}
        {activeTab === 'offers' && (
          <div className="neumo-card rounded-3xl p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-slate-850 dark:text-white">Offers & Coupons ({offers.length})</h3>
              <button
                onClick={openOfferAddModal}
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 skeuo-button-primary text-xs font-bold rounded-xl"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Offer</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {offers.map(offer => (
                <div key={offer.id} className="neumo-card p-5 rounded-2xl flex flex-col justify-between space-y-4 relative overflow-hidden">
                  <div className="absolute right-0 top-0 w-24 h-24 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-bl-full pointer-events-none" />
                  
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="inline-flex items-center px-2 py-1 rounded bg-slate-100 dark:bg-slate-850 text-slate-800 dark:text-white text-xs font-black uppercase tracking-wider font-mono">
                        <Tag className="w-3.5 h-3.5 mr-1 text-emerald-500" />
                        {offer.code}
                      </span>
                      <h4 className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-2 font-sans">{offer.discount}</h4>
                    </div>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => openOfferEditModal(offer)}
                        className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-550 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
                      >
                        <Edit className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => deleteOffer(offer.id)}
                        className="p-1.5 bg-red-50 dark:bg-red-950/20 rounded-lg text-red-500 hover:text-red-750 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 leading-normal">{offer.description}</p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-[9px] text-slate-400 uppercase tracking-widest font-black">Status</span>
                    <button
                      onClick={() => toggleOfferStatus(offer.id)}
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase transition-colors cursor-pointer ${
                        offer.active
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-450'
                          : 'bg-slate-100 text-slate-450 dark:bg-slate-850 dark:text-slate-500'
                      }`}
                    >
                      {offer.active ? 'Active' : 'Paused'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 7: REVIEWS */}
        {activeTab === 'reviews' && (
          <div className="neumo-card rounded-3xl p-6 space-y-6">
            <h3 className="text-base font-bold text-slate-850 dark:text-white">Customer Feedback Moderation ({reviews.length} ratings)</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.map(review => {
                const rest = restaurants.find(r => r.id === review.restaurantId);
                return (
                  <div key={review.id} className="neumo-card p-5 rounded-2xl flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="block text-slate-805 dark:text-white font-bold">{review.user}</span>
                          <span className="block text-[9px] text-slate-400 font-normal">
                            reviewed {rest ? rest.name : 'Unknown Restaurant'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-0.5 bg-amber-50 dark:bg-amber-950/20 text-amber-500 px-2 py-0.5 rounded-lg text-xs font-black">
                          <span>★</span>
                          <span>{review.rating}.0</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-655 dark:text-slate-350 italic mt-3 leading-relaxed">
                        "{review.comment}"
                      </p>
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <span>Posted on {review.date || '2026-07-01'}</span>
                      <button
                        onClick={() => alert('Feature flag: feedback flagged for audit.')}
                        className="text-red-500 hover:underline font-bold"
                      >
                        Flag for Audit
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SECTION 8: REPORTS */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div className="neumo-card rounded-3xl p-6 space-y-6">
              <h3 className="text-base font-bold text-slate-850 dark:text-white flex items-center">
                <FileText className="w-5 h-5 mr-1.5 text-emerald-500" />
                Hotel Sales Performance Reports
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-205 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                      <th className="pb-3">Restaurant Name</th>
                      <th className="pb-3">Eco Orders Fulfilled</th>
                      <th className="pb-3">Estimated Gross Sales</th>
                      <th className="pb-3">Sustainability Score</th>
                      <th className="pb-3 text-right font-bold">Contribution Ratio</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-semibold text-slate-700 dark:text-slate-300">
                    {restaurants.map(rest => {
                      const restOrders = orders.filter(o => o.restaurantName === rest.name);
                      const restSales = restOrders.reduce((sum, o) => sum + o.total, 0);
                      const ratio = totalRevenue ? (restSales / totalRevenue) * 100 : 0;

                      return (
                        <tr key={rest.id}>
                          <td className="py-3 font-bold text-slate-800 dark:text-white">{rest.name}</td>
                          <td className="py-3 text-slate-500">{restOrders.length} orders</td>
                          <td className="py-3 text-slate-805 dark:text-white font-bold">{formatCurrency(restSales)}</td>
                          <td className="py-3">
                            <span className="inline-flex items-center text-xs font-bold text-emerald-600 dark:text-emerald-450">
                              🌱 {rest.rating * 20}% Eco
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <span className="font-bold text-slate-800 dark:text-white">{ratio.toFixed(0)}%</span>
                              <div className="w-16 bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                <div className="bg-emerald-500 h-full" style={{ width: `${ratio}%` }} />
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Logistics & commute modes report */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="neumo-card p-6 rounded-3xl space-y-4">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Commute Logistics Share</h4>
                <div className="space-y-3.5 text-xs">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-slate-500">Bicycle Courier</span>
                      <span className="font-bold text-slate-800 dark:text-white">45%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div className="bg-emerald-500 h-full" style={{ width: '45%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-slate-500">Electric Vehicle (EV)</span>
                      <span className="font-bold text-slate-800 dark:text-white">30%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div className="bg-teal-500 h-full" style={{ width: '30%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-slate-500">Self-Commute Pickup</span>
                      <span className="font-bold text-slate-800 dark:text-white">15%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div className="bg-amber-500 h-full" style={{ width: '15%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-slate-500">Standard Transit</span>
                      <span className="font-bold text-slate-405 dark:text-slate-500">10%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div className="bg-slate-405 dark:bg-slate-700 h-full" style={{ width: '10%' }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="neumo-card p-6 rounded-3xl space-y-4">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Platform Operational Index</h4>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Dishes</span>
                    <span className="text-xl font-black text-slate-805 dark:text-white mt-1 block">{foodItems.length}</span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Active Promos</span>
                    <span className="text-xl font-black text-slate-805 dark:text-white mt-1 block">{offers.filter(o => o.active).length}</span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Avg Reviews / Hotel</span>
                    <span className="text-xl font-black text-slate-805 dark:text-white mt-1 block">{(reviews.length / restaurants.length || 0).toFixed(1)}</span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Awaiting Dispatch</span>
                    <span className="text-xl font-black text-amber-500 mt-1 block">{orders.filter(o => o.status !== 'Delivered').length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* MODAL 1: HOTEL CREATION / EDIT */}
      <Modal
        isOpen={isRestModalOpen}
        onClose={() => setIsRestModalOpen(false)}
        title={restFormId ? 'Edit Restaurant Catalog' : 'Register New Sustainable Restaurant'}
      >
        <form onSubmit={handleRestSubmit} className="space-y-4 font-sans max-h-[80vh] overflow-y-auto pr-1">
          {successMsg && <Alert type="success" message={successMsg} />}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Hotel Name</label>
            <input required type="text" value={restFormName} onChange={e => setRestFormName(e.target.value)} className="w-full px-3 py-2 border border-slate-205 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-white rounded-xl text-sm" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Unsplash Logo/Image URL</label>
            <input required type="text" value={restFormImage} onChange={e => setRestFormImage(e.target.value)} className="w-full px-3 py-2 border border-slate-205 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-white rounded-xl text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Location / Zone</label>
              <input required type="text" value={restFormLocation} onChange={e => setRestFormLocation(e.target.value)} className="w-full px-3 py-2 border border-slate-205 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-white rounded-xl text-sm" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Timings Hours</label>
              <input required type="text" value={restFormTimings} onChange={e => setRestFormTimings(e.target.value)} className="w-full px-3 py-2 border border-slate-205 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-white rounded-xl text-sm" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Contact Number</label>
              <input required type="text" value={restFormContact} onChange={e => setRestFormContact(e.target.value)} className="w-full px-3 py-2 border border-slate-205 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-white rounded-xl text-sm" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Sourcing Certifications</label>
              <input required type="text" value={restFormCerts} onChange={e => setRestFormCerts(e.target.value)} className="w-full px-3 py-2 border border-slate-205 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-white rounded-xl text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Full Postal Address</label>
            <input required type="text" value={restFormAddress} onChange={e => setRestFormAddress(e.target.value)} className="w-full px-3 py-2 border border-slate-205 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-white rounded-xl text-sm" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Description</label>
            <textarea required rows="3" value={restFormDesc} onChange={e => setRestFormDesc(e.target.value)} className="w-full p-3 border border-slate-205 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-white rounded-xl text-sm" />
          </div>
          <button type="submit" className="w-full py-3 skeuo-button-primary text-xs uppercase tracking-widest rounded-xl font-bold">
            Save Hotel Details
          </button>
        </form>
      </Modal>

      {/* MODAL 4: OFFERS CREATION / EDIT */}
      <Modal
        isOpen={isOfferModalOpen}
        onClose={() => setIsOfferModalOpen(false)}
        title={offerFormId ? 'Modify Coupon Offer' : 'Generate New Promo Offer'}
      >
        <form onSubmit={handleOfferSubmit} className="space-y-4 font-sans">
          {successMsg && <Alert type="success" message={successMsg} />}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Promo Code</label>
              <input required type="text" value={offerFormCode} onChange={e => setOfferFormCode(e.target.value)} placeholder="ECOEATS50" className="w-full px-3 py-2 border border-slate-205 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-white rounded-xl text-sm" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Discount Amount</label>
              <input required type="text" value={offerFormDiscount} onChange={e => setOfferFormDiscount(e.target.value)} placeholder="15% OFF" className="w-full px-3 py-2 border border-slate-205 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-white rounded-xl text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Coupon Description</label>
            <input required type="text" value={offerFormDesc} onChange={e => setOfferFormDesc(e.target.value)} placeholder="15% discount on zero-carbon deliveries" className="w-full px-3 py-2 border border-slate-205 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-white rounded-xl text-sm" />
          </div>
          <div>
            <label className="flex items-center space-x-2 text-xs font-bold text-slate-655 dark:text-slate-350 cursor-pointer pt-2">
              <input type="checkbox" checked={offerFormActive} onChange={e => setOfferFormActive(e.target.checked)} className="rounded border-slate-300 text-emerald-500 focus:ring-emerald-500" />
              <span>Coupon is active and redeemable</span>
            </label>
          </div>
          <button type="submit" className="w-full py-3 skeuo-button-primary text-xs uppercase tracking-widest rounded-xl font-bold">
            Save Promo Offer
          </button>
        </form>
      </Modal>

    </div>
  );
}
