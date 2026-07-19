import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, MapPin, Award } from 'lucide-react';

export default function RestaurantCard({ restaurant }) {
  return (
    <Link
      to={`/restaurant/${restaurant.id}`}
      className="skeuo-glass-card rounded-3xl overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col group font-sans"
    >
      {/* Restaurant Image & Badges */}
      <div className="relative h-48 overflow-hidden bg-slate-100">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Restaurant Info */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Header row */}
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white line-clamp-1 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors">
              {restaurant.name}
            </h3>
            
            {/* Rating */}
            <div className="flex items-center text-xs font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50 shadow-[inset_0_1px_rgba(255,255,255,0.8),0_1px_2px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_1px_rgba(255,255,255,0.05)] px-2 py-0.5 rounded-lg shrink-0 ml-2">
              <Star className="w-3.5 h-3.5 text-amber-550 fill-amber-500 mr-1" />
              {restaurant.rating}
            </div>
          </div>

          {/* Sourcing summary text */}
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
            {restaurant.description}
          </p>
        </div>

        {/* Certifications and metrics */}
        <div className="mt-5">
          {/* Sourcing tags list */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {restaurant.certifications && restaurant.certifications.slice(0, 2).map((cert, index) => (
              <span
                key={index}
                className="inline-flex items-center text-[9px] font-extrabold text-emerald-805 dark:text-emerald-300 px-2 py-0.5 rounded-lg uppercase tracking-wider skeuo-badge"
              >
                <Award className="w-2.5 h-2.5 mr-0.5 text-emerald-600 dark:text-emerald-400" />
                {cert}
              </span>
            ))}
          </div>

          {/* Delivery & Location Info Row */}
          <div className="flex items-center justify-between text-xs text-slate-450 border-t border-slate-100 dark:border-slate-800 pt-4">
            <div className="flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>{restaurant.location}</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1" />
                {restaurant.deliveryTime} mins
              </span>
              <span>•</span>
              <span>{restaurant.distance} km</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
