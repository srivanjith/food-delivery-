import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import Hero from '../components/Home/Hero';
import Categories from '../components/Home/Categories';
import PromotionalBanners from '../components/Home/PromotionalBanners';
import RestaurantCard from '../components/Restaurant/RestaurantCard';
import { Sparkles, HelpCircle } from 'lucide-react';

export default function Home() {
  const { restaurants } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-16 font-sans">
      
      {/* Hero section with Search inputs */}
      <Hero searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {/* Sustainable promo banners */}
      <PromotionalBanners onSelectCategory={setSelectedCategory} />

      {/* Sustainable Categories Filter */}
      <Categories selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />

      {/* Restaurant Listings Section with Aurorism glowing background */}
      <div className="relative overflow-hidden py-12 border-t border-slate-200/50 dark:border-slate-800/40 bg-slate-50/10 dark:bg-slate-950/5">
        {/* Animated Aurora Glow Blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-[10%] left-[5%] w-[450px] h-[450px] bg-emerald-500/15 dark:bg-emerald-500/8 rounded-full filter blur-[120px] animate-aurora-1" />
          <div className="absolute top-[40%] right-[5%] w-[380px] h-[380px] bg-orange-500/15 dark:bg-orange-500/6 rounded-full filter blur-[100px] animate-aurora-2" />
          <div className="absolute bottom-[10%] left-[20%] w-[500px] h-[500px] bg-teal-500/15 dark:bg-teal-500/8 rounded-full filter blur-[130px] animate-aurora-3" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Giant Glassmorphic Panel Box */}
          <div className="skeuo-glass-card p-6 sm:p-10 rounded-3xl border border-white/20 dark:border-slate-800/40">
            
            {/* Header Area */}
            <div className="flex items-center space-x-2 mb-8">
              <span className="p-2 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-xl shadow-[inset_0_1px_rgba(255,255,255,0.4)] dark:shadow-none border border-emerald-200 dark:border-emerald-900">
                <Sparkles className="w-5 h-5 animate-pulse-slow" />
              </span>
              <div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 font-sans">
                  {selectedCategory === 'All' ? 'Eco-Certified Restaurants' : `${selectedCategory} Kitchens`}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Earn loyalty eco points on every order. Save on future purchases with our points system!
                </p>
              </div>
            </div>

            {/* Grid listings */}
            {filteredRestaurants.length === 0 ? (
              <div className="bg-white/40 dark:bg-slate-900/40 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center max-w-lg mx-auto">
                <HelpCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-base font-bold text-slate-800 dark:text-white">No Eco-Certified Kitchens Found</h3>
                <p className="text-xs text-slate-550 dark:text-slate-400 mt-2">
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
  );
}
