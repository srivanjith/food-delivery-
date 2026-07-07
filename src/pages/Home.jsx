import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Hero from '../components/Home/Hero';
import Categories from '../components/Home/Categories';
import PromotionalBanners from '../components/Home/PromotionalBanners';
import CircularGallery from '../components/Home/CircularGallery';
import Hyperspeed from '../components/Home/Hyperspeed';

import RestaurantCard from '../components/Restaurant/RestaurantCard';
import { Sparkles, HelpCircle } from 'lucide-react';

const HYPERSPEED_OPTIONS = {
  distortion: 'turbulentDistortion',
  length: 400,
  roadWidth: 10,
  islandWidth: 2,
  lanesPerRoad: 4,
  fov: 90,
  fovSpeedUp: 150,
  speedUp: 3.5,
  carLightsFade: 0.4,
  totalSideLightSticks: 25,
  lightPairsPerRoadWay: 50,
  shoulderLinesWidthPercentage: 0.05,
  brokenLinesWidthPercentage: 0.1,
  brokenLinesLengthPercentage: 0.5,
  lightStickWidth: [0.12, 0.5],
  lightStickHeight: [1.3, 1.7],
  movingAwaySpeed: [90, 120],
  movingCloserSpeed: [-150, -200],
  carLightsLength: [400 * 0.03, 400 * 0.2],
  carLightsRadius: [0.05, 0.14],
  carWidthPercentage: [0.3, 0.5],
  carShiftX: [-0.8, 0.8],
  carFloorSeparation: [0, 5],
  colors: {
    roadColor: 0x0F172A,
    islandColor: 0x111827,
    background: 0x0F172A,
    shoulderLines: 0x22C55E, // Eco Green shoulder lines
    brokenLines: 0x8B5CF6,  // Brand Purple broken lines
    leftCars: [0x8B5CF6, 0x7C3AED, 0x22C55E],
    rightCars: [0x22C55E, 0x10B981, 0x8B5CF6], // Green & Purple light trails
    sticks: 0x22C55E // Eco Green light sticks
  }
};

export default function Home() {
  const { restaurants } = useApp();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const [showTransition, setShowTransition] = useState(!!location.state?.showLoginTransition);
  const [isFadingOut, setIsFadingOut] = useState(false);

  // Monitor navigation state triggers for transition
  useEffect(() => {
    if (location.state?.showLoginTransition) {
      
      const fadeTimer = setTimeout(() => {
        setIsFadingOut(true);
      }, 1900);

      const unmountTimer = setTimeout(() => {
        setShowTransition(false);
        // Clear route state so it doesn't trigger on fresh reloads
        window.history.replaceState({}, document.title);
      }, 2500);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(unmountTimer);
      };
    }
  }, [location.state]);

  // Filter restaurants based on category and search query
  const filteredRestaurants = restaurants.filter((restaurant) => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          restaurant.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          restaurant.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedCategory === 'All') {
      return matchesSearch;
    }
    
    // Category checks
    const matchesCategory = restaurant.categories.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="relative min-h-screen pb-16 font-sans" style={{ backgroundColor: 'var(--mp-bg)' }}>
      
      {/* Redirection transition overlay directly on top of the Home page */}
      {showTransition && (
        <div 
          className="fixed inset-0 z-50 bg-[#0F172A] flex flex-col items-center justify-center transition-all duration-600 ease-in-out"
          style={{
            opacity: isFadingOut ? 0 : 1,
            pointerEvents: isFadingOut ? 'none' : 'auto'
          }}
        >
          <div className="absolute inset-0 z-0">
            <Hyperspeed effectOptions={HYPERSPEED_OPTIONS} />
          </div>
          <div className="relative z-10 text-center space-y-4">
            <h2 className="text-4xl font-extrabold text-white tracking-widest uppercase animate-pulse">
              Welcome....... 🤝
            </h2>
            <p className="text-violet-300 text-sm tracking-wide">
              Enjoy your meal! 🌿
            </p>
          </div>
        </div>
      )}

      {/* Background Circular Gallery - Runs cleanly in background with food images and constant speed */}
      <div className="absolute inset-x-0 top-0 h-[600px] z-0 overflow-hidden pointer-events-none opacity-45">
        <CircularGallery
          bend={2.5}
          textColor="rgba(255, 255, 255, 0.7)"
          borderRadius={0.06}
          scrollEase={0.03}
          scrollSpeed={1.5}
        />
      </div>

      {/* Foreground Content */}
      <div className="relative z-10">
        
        {/* Hero section with Search inputs */}
        <Hero searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        {/* Sustainable promo banners */}
        <PromotionalBanners onSelectCategory={setSelectedCategory} />

        {/* Sustainable Categories Filter */}
        <Categories selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />

        {/* Restaurant Listings Section */}
        <div className="relative overflow-hidden py-12 border-t border-slate-800/40 bg-transparent">
          {/* Animated Aurora Glow Blobs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            <div className="absolute top-[10%] left-[5%] w-[450px] h-[450px] bg-[#8B5CF6]/10 rounded-full filter blur-[120px] animate-aurora-1" />
            <div className="absolute top-[40%] right-[5%] w-[380px] h-[380px] bg-orange-500/8 rounded-full filter blur-[100px] animate-aurora-2" />
            <div className="absolute bottom-[10%] left-[20%] w-[500px] h-[500px] bg-teal-500/8 rounded-full filter blur-[130px] animate-aurora-3" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Giant Glassmorphic Panel Box */}
            <div className="skeuo-glass-card p-6 sm:p-10 rounded-3xl border border-white/10 dark:border-slate-800/30">
              
              {/* Header Area */}
              <div className="flex items-center space-x-2 mb-8">
                <span className="p-2 bg-violet-500/10 text-violet-400 rounded-xl border border-violet-500/20">
                  <Sparkles className="w-5 h-5 animate-pulse-slow" />
                </span>
                <div>
                  <h2 className="text-xl font-bold text-slate-100 font-sans">
                    {selectedCategory === 'All' ? 'Eco-Certified Restaurants' : `${selectedCategory} Kitchens`}
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Earn loyalty eco points on every order. Save on future purchases with our points system!
                  </p>
                </div>
              </div>

              {/* Grid listings */}
              {filteredRestaurants.length === 0 ? (
                <div className="bg-slate-900/40 border border-dashed border-slate-800 rounded-3xl p-12 text-center max-w-lg mx-auto">
                  <HelpCircle className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                  <h3 className="text-base font-bold text-white">No Eco-Certified Kitchens Found</h3>
                  <p className="text-xs text-slate-400 mt-2">
                    We couldn't find any partners matching "{searchQuery}" in Sector 4. Try adjusting your tags or viewing 'All' restaurants.
                  </p>
                  <button
                    onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                    className="mt-5 px-4 py-2 skeuo-button-primary text-xs font-bold rounded-xl transition-all"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredRestaurants.map((restaurant) => (
                    <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                  ))}
                </div>
              )}
              
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
