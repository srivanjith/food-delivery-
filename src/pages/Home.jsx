import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import Hero from '../components/Home/Hero';
import Categories from '../components/Home/Categories';
import PromotionalBanners from '../components/Home/PromotionalBanners';
import SurplusRescue from '../components/Home/SurplusRescue';
import RestaurantCard from '../components/Restaurant/RestaurantCard';
import { Sparkles, HelpCircle } from 'lucide-react';

export default function Home() {
  const { restaurants, surplusDeals } = useApp();
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

      {/* Surplus Food Rescue Section (Only render if selected category is 'All' or 'Surplus Rescue') */}
      {(selectedCategory === 'All' || selectedCategory === 'Surplus Rescue') && (
        <SurplusRescue deals={surplusDeals} />
      )}

      {/* Restaurant Listings Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center space-x-2 mb-6">
          <span className="p-2 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-455 rounded-xl">
            <Sparkles className="w-5 h-5" />
          </span>
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 font-sans">
              {selectedCategory === 'All' ? 'Eco-Certified Restaurants' : `${selectedCategory} Kitchens`}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Eco-Score A to E. Verified carbon offsets and plastic-free logistics.
            </p>
          </div>
        </div>

        {filteredRestaurants.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-dashed border-slate-205 dark:border-slate-800 rounded-3xl p-12 text-center max-w-lg mx-auto">
            <HelpCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-base font-bold text-slate-800 dark:text-white">No Eco-Certified Kitchens Found</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              We couldn't find any partners matching "{searchQuery}" in Sector 4. Try adjusting your tags or viewing 'All' restaurants.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
              className="mt-5 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
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
  );
}
