import React, { useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import MenuItem from '../components/Restaurant/MenuItem';
import MenuFilter from '../components/Restaurant/MenuFilter';
import Modal from '../components/Common/Modal';
import Alert from '../components/Common/Alert';
import StarBorder from '../components/Common/StarBorder';
import BounceCards from '../components/Common/BounceCards';
import { Star, Clock, MapPin, Award, ArrowLeft, MessageSquare, PenTool, Plus, Sparkles } from 'lucide-react';

export default function RestaurantMenu() {
  const { id } = useParams();
  const { user } = useAuth();
  const menuSectionRef = useRef(null);
  const {
    restaurants,
    foodItems,
    reviews,
    addReview,
    addFoodItem,
    updateFoodItem,
    deleteFoodItem,
    updateRestaurant
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  
  // Review form states
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  // Food Item modal states
  const [isFoodModalOpen, setIsFoodModalOpen] = useState(false);
  const [foodFormId, setFoodFormId] = useState(null);
  const [foodFormName, setFoodFormName] = useState('');
  const [foodFormPrice, setFoodFormPrice] = useState(250);
  const [foodFormDesc, setFoodFormDesc] = useState('');
  const [foodFormImage, setFoodFormImage] = useState('');
  const [foodFormOrganic, setFoodFormOrganic] = useState(true);
  const [foodFormVegan, setFoodFormVegan] = useState(true);
  const [foodFormLocal, setFoodFormLocal] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');

  // Certifications modal states
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [certInput, setCertInput] = useState('');
  const [certSuccessMsg, setCertSuccessMsg] = useState('');

  // Find the current restaurant
  const restaurant = restaurants.find((r) => r.id === id);

  if (!restaurant) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center font-sans text-center px-4">
        <h2 className="text-2xl font-black text-slate-800 dark:text-white">Restaurant Not Found</h2>
        <p className="text-sm text-slate-500 mt-2">The eco-certified kitchen you requested doesn't exist.</p>
        <Link to="/" className="mt-5 px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow transition-all">
          Back to Listings
        </Link>
      </div>
    );
  }

  // Filter restaurant items
  const menuItems = foodItems.filter((item) => item.restaurantId === restaurant.id);
  const bounceImages = menuItems.map(item => item.image);
  while (bounceImages.length < 5) {
    bounceImages.push(restaurant.image);
  }
  const displayBounceImages = bounceImages.slice(0, 5);

  const filteredMenuItems = menuItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeFilter === 'all') return matchesSearch;
    if (activeFilter === 'vegan') return matchesSearch && item.vegan;
    if (activeFilter === 'organic') return matchesSearch && item.organic;
    if (activeFilter === 'local') return matchesSearch && item.localSourced;

    return matchesSearch;
  });

  // Get reviews for this specific restaurant
  const restaurantReviews = reviews.filter(rev => rev.restaurantId === restaurant.id);

  // Handle Review submission
  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    
    addReview(restaurant.id, reviewRating, reviewComment, user ? user.name : 'Anonymous Guest');
    setReviewComment('');
    setReviewRating(5);
    setReviewSuccess('Thank you! Your sustainability review has been recorded.');
    
    setTimeout(() => {
      setReviewSuccess('');
      setIsReviewModalOpen(false);
    }, 2000);
  };

  // Admin menu management handlers
  const openFoodAddModal = () => {
    setFoodFormId(null);
    setFoodFormName('');
    setFoodFormPrice(250);
    setFoodFormDesc('');
    setFoodFormImage('https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80');
    setFoodFormOrganic(true);
    setFoodFormVegan(true);
    setFoodFormLocal(true);
    setIsFoodModalOpen(true);
  };

  const openFoodEditModal = (food) => {
    setFoodFormId(food.id);
    setFoodFormName(food.name);
    setFoodFormPrice(food.price);
    setFoodFormDesc(food.description);
    setFoodFormImage(food.image);
    setFoodFormOrganic(food.organic);
    setFoodFormVegan(food.vegan);
    setFoodFormLocal(food.localSourced);
    setIsFoodModalOpen(true);
  };

  const handleFoodSubmit = (e) => {
    e.preventDefault();
    const payload = {
      restaurantId: restaurant.id,
      name: foodFormName,
      price: parseFloat(foodFormPrice),
      description: foodFormDesc,
      image: foodFormImage,
      organic: foodFormOrganic,
      vegan: foodFormVegan,
      localSourced: foodFormLocal
    };

    if (foodFormId) {
      updateFoodItem({ ...payload, id: foodFormId });
      setSuccessMsg('Dish details updated successfully!');
    } else {
      addFoodItem(payload);
      setSuccessMsg('New dish registered in kitchen inventory!');
    }

    setTimeout(() => {
      setSuccessMsg('');
      setIsFoodModalOpen(false);
    }, 1500);
  };

  // Admin certifications management handlers
  const openCertModal = () => {
    setCertInput(restaurant.certifications.join(', '));
    setIsCertModalOpen(true);
  };

  const handleCertSubmit = (e) => {
    e.preventDefault();
    const certsArray = certInput.split(',').map(c => c.trim()).filter(Boolean);
    
    updateRestaurant({
      ...restaurant,
      certifications: certsArray
    });

    setCertSuccessMsg('Green certifications updated successfully!');
    setTimeout(() => {
      setCertSuccessMsg('');
      setIsCertModalOpen(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen pb-24 font-sans bg-[#0F172A] text-white">
      
      {/* 1. Header Navigation & Banner Hero Area */}
      <div 
        className="relative w-full overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: 'url("/feast.png")' }}
      >
        {/* Dark Blending Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#111827]/93 via-[#0F172A]/95 to-[#0F172A] z-0" />
        
        {/* Glowing Background Blobs */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-[10%] right-[10%] w-[450px] h-[450px] bg-violet-600/20 rounded-full filter blur-[120px]" />
          <div className="absolute bottom-[20%] left-[5%] w-[350px] h-[350px] bg-emerald-500/10 rounded-full filter blur-[100px]" />
        </div>

        {/* mini Navbar */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between py-6 border-b border-white/5">
          <div className="flex items-center space-x-3">
            <Link to="/" className="text-white hover:text-violet-400 transition-all cursor-pointer">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <span 
              className="text-2xl font-semibold tracking-wider text-white italic"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {restaurant.name}
            </span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8 text-xs font-semibold text-slate-350 tracking-wider uppercase">
            <a href="#about" className="hover:text-violet-400 transition-colors">Our Story</a>
            <button onClick={() => menuSectionRef.current?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-violet-400 transition-colors cursor-pointer">Menu</button>
            <span className="flex items-center text-amber-450 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 text-[10px]">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 mr-1" />
              {restaurant.rating} Rating
            </span>
          </div>

          <button 
            onClick={() => menuSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
            className="px-5 py-2.5 bg-violet-500 hover:bg-violet-600 text-white font-extrabold text-xs rounded-full uppercase tracking-wider transition-all shadow-lg shadow-violet-550/15 cursor-pointer"
          >
            Order Now
          </button>
        </div>

        {/* Hero Section Container */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center py-14 md:py-24">
          
          {/* Left Column: Heading and description */}
          <div className="lg:col-span-6 space-y-6 md:space-y-8">
            <h1 
              className="text-5xl md:text-7xl font-extralight text-white leading-tight tracking-wider select-none"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              <span className="italic text-violet-300">Purely</span> <span className="text-white/20">—</span> <span className="italic font-normal">Handcrafted</span>
            </h1>
            
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl font-light leading-relaxed">
              {restaurant.description || "Freshly prepared meals with organic, locally sourced ingredients and low-carbon delivery, crafted with care to make every bite feel special."}
            </p>

            <div className="pt-2 flex items-center space-x-4">
              <button 
                onClick={() => menuSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
                className="group inline-flex items-center space-x-3 bg-white text-slate-950 hover:bg-violet-300 font-extrabold text-xs uppercase tracking-widest px-6 py-4 rounded-full transition-all duration-300 shadow-xl shadow-white/5 cursor-pointer"
              >
                <span>Explore Our Menu</span>
                <div className="w-6 h-6 bg-slate-950 group-hover:bg-slate-900 rounded-full flex items-center justify-center transition-colors">
                  <Plus className="w-3.5 h-3.5 text-white transition-transform group-hover:rotate-90" />
                </div>
              </button>
            </div>
          </div>

          {/* Right Column: Hero Showcase BounceCards */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center space-y-6 relative z-10 select-none">
            <div className="w-full flex justify-center items-center h-[340px] md:h-[400px]">
              <BounceCards 
                images={displayBounceImages}
                containerWidth={400}
                containerHeight={320}
                enableHover={true}
                className="scale-90 sm:scale-100"
              />
            </div>
            
            {/* Quick stats floating bar below BounceCards */}
            <div className="w-full max-w-md bg-[#111827]/90 backdrop-blur-md rounded-2xl p-4 border border-white/5 flex justify-between items-center text-[10px] text-white">
              <div>
                <span className="block text-[8px] text-slate-400 uppercase tracking-widest font-bold">Delivery Time</span>
                <span className="font-extrabold text-xs sm:text-sm">{restaurant.deliveryTime} mins</span>
              </div>
              <div className="border-l border-white/10 h-8" />
              <div>
                <span className="block text-[8px] text-slate-400 uppercase tracking-widest font-bold">Distance</span>
                <span className="font-extrabold text-xs sm:text-sm">{restaurant.distance} km</span>
              </div>
              <div className="border-l border-white/10 h-8" />
              <div>
                <span className="block text-[8px] text-slate-400 uppercase tracking-widest font-bold">Eco rating</span>
                <span className="font-extrabold text-xs sm:text-sm text-emerald-400 flex items-center gap-0.5">🌱 Certified</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 2. About Us / Our Story Section */}
      <div id="about" className="w-full bg-[#0F172A] py-16 md:py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Details */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-[10px] font-black text-slate-450 tracking-widest uppercase block">About Us</span>
            <h2 
              className="text-3xl sm:text-4xl font-extralight text-white leading-tight font-serif"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Crafted with Heart, <span className="italic text-violet-300">Baked to Perfection</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-350 leading-relaxed font-light">
              At <strong className="font-semibold text-white">{restaurant.name}</strong>, we prepare every dish with organic locally sourced ingredients and low-carbon emission practices. Our zero-waste standard ensures clean dining that preserves the planet while delivering delectable gourmet quality to your doorstep.
            </p>

            <div className="p-5 rounded-2xl bg-[#1E293B] border border-white/5 space-y-3">
              <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest block">Zero-Waste Sourcing</span>
              <p className="text-xs text-slate-300 font-light">
                We partner exclusively with local eco-certified kitchens and organic growers, utilizing biodegradable packaging and sustainable carbon offset initiatives.
              </p>
            </div>
          </div>

          {/* Right Column: Signature Categories / Mockup collection lists */}
          <div className="lg:col-span-6 space-y-6">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Explore Our Specialties</h3>
            
            <div className="space-y-3">
              {restaurant.certifications && restaurant.certifications.slice(0, 4).map((cert, index) => (
                <div key={index} className="flex justify-between items-center bg-[#1E293B]/60 hover:bg-[#1E293B] rounded-xl p-3.5 border border-white/5 transition-all">
                  <div className="flex items-center space-x-3">
                    <span className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                      <Award className="w-4 h-4 text-emerald-500" />
                    </span>
                    <span className="text-xs font-bold tracking-wide text-white">{cert}</span>
                  </div>
                  <span className="text-[10px] font-extrabold text-violet-300 hover:text-white transition-colors cursor-pointer">
                    Verified Green ✓
                  </span>
                </div>
              ))}
              
              {(!restaurant.certifications || restaurant.certifications.length === 0) && (
                ['Organic Sourced', '100% Vegan Options', 'Locally Sourced Food', 'Compostable Packaging'].map((spec, index) => (
                  <div key={index} className="flex justify-between items-center bg-[#1E293B]/60 hover:bg-[#1E293B] rounded-xl p-3.5 border border-white/5 transition-all">
                    <div className="flex items-center space-x-3">
                      <span className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
                        <Award className="w-4 h-4 text-violet-500" />
                      </span>
                      <span className="text-xs font-bold tracking-wide text-white">{spec}</span>
                    </div>
                    <span className="text-[10px] font-extrabold text-violet-350 hover:text-white transition-colors cursor-pointer">
                      Explore Spec
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>

      {/* 3. Daily Baking / Chef's Specials Row */}
      {menuItems.filter(i => i.popular).length > 0 && (
        <div className="w-full bg-[#111827]/40 py-12 border-t border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="flex justify-between items-baseline">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Our Daily Specials</h3>
              <button 
                onClick={() => menuSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
                className="text-[10px] font-black uppercase text-violet-300 hover:text-white tracking-widest transition-colors cursor-pointer"
              >
                See Full Menu →
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {menuItems.filter(i => i.popular).slice(0, 3).map(item => (
                <div key={item.id} className="bg-[#1E293B] rounded-2xl overflow-hidden border border-white/5 flex flex-col justify-between">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    <div className="absolute top-2.5 left-2.5 bg-amber-500 text-white font-extrabold text-[9px] px-2 py-0.5 rounded flex items-center">
                      <Sparkles className="w-2.5 h-2.5 mr-0.5" /> Special
                    </div>
                  </div>
                  <div className="p-4 space-y-2 flex-grow flex flex-col justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">{item.name}</h4>
                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">{item.description}</p>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-white/5 mt-3">
                      <span className="text-sm font-black">₹{item.price}</span>
                      <button
                        onClick={() => menuSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
                        className="px-3 py-1.5 bg-violet-500 hover:bg-violet-650 text-[10px] font-extrabold uppercase rounded-lg text-white transition-colors cursor-pointer"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. Active Dishes Menu List & Reviews */}
      <div 
        ref={menuSectionRef}
        id="menu-list"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start scroll-mt-6"
      >
        
        {/* Left Column: Menu Items list */}
        <div className="lg:col-span-8 space-y-8">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 
                className="text-2xl font-light text-white font-serif"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Signature <span className="italic text-violet-300">Menu List</span>
              </h3>
              {(user?.role === 'admin' || user?.role === 'restaurant') && (
                <button
                  onClick={openFoodAddModal}
                  className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-violet-500 hover:bg-violet-600 text-white text-xs font-bold rounded-xl cursor-pointer shadow-lg shadow-violet-550/15"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Dish to Menu</span>
                </button>
              )}
            </div>

            <MenuFilter
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
            />

            {/* Dishes list */}
            <div className="space-y-5 mt-6">
              {filteredMenuItems.length === 0 ? (
                <div className="text-center py-16 bg-[#1E293B] rounded-3xl border border-white/5">
                  <span className="text-4xl">🥗</span>
                  <h4 className="text-sm font-bold text-slate-305 mt-3">No dishes match filters</h4>
                  <p className="text-xs text-slate-450 mt-1">Try resetting menu search queries.</p>
                </div>
              ) : (
                filteredMenuItems.map((item) => (
                  <MenuItem
                    key={item.id}
                    item={item}
                    isAdmin={user?.role === 'admin' || user?.role === 'restaurant'}
                    onEdit={openFoodEditModal}
                    onDelete={deleteFoodItem}
                  />
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Reviews */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Certifications Box */}
          <StarBorder color="#22C55E" speed="5s" thickness={2}>
            <div className="p-6 space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Green Certifications</h3>
                {(user?.role === 'admin' || user?.role === 'restaurant') && (
                  <button
                    onClick={openCertModal}
                    className="p-1 text-slate-450 hover:text-emerald-400 transition-colors cursor-pointer"
                    title="Edit Certifications"
                  >
                    <PenTool className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {restaurant.certifications && restaurant.certifications.map((cert, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center text-[10px] font-bold text-emerald-350 bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-900"
                  >
                    <Award className="w-3 h-3 mr-1 text-emerald-500" />
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          </StarBorder>

          {/* Testimonial reviews block */}
          <StarBorder color="#F59E0B" speed="6s" thickness={2}>
            <div className="p-6 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center">
                  <MessageSquare className="w-4 h-4 mr-1.5 text-amber-500" />
                  Sustaina-Reviews
                </h3>
                
                <button
                  onClick={() => setIsReviewModalOpen(true)}
                  id="open-review-modal-btn"
                  className="p-1.5 bg-amber-500/10 text-amber-400 rounded-lg hover:scale-105 transition-transform cursor-pointer"
                  title="Write a review"
                >
                  <PenTool className="w-4 h-4" />
                </button>
              </div>

              {/* Reviews display listing */}
              <div className="space-y-4 max-h-[450px] overflow-y-auto pr-1">
                {restaurantReviews.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 text-xs">
                    No reviews yet. Be the first to review their zero-waste packaging!
                  </div>
                ) : (
                  restaurantReviews.map((rev) => (
                    <div key={rev.id} className="border-b border-white/5 pb-3 last:border-0 last:pb-0 space-y-1.5">
                      <div className="flex justify-between items-center text-[11px] font-bold text-slate-350">
                        <span>{rev.user}</span>
                        <span className="flex items-center text-amber-500 font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 mr-0.5" />
                          {rev.rating}/5
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 italic">
                        "{rev.comment}"
                      </p>
                      <span className="block text-[9px] text-slate-500 text-right">{rev.date}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </StarBorder>
        </div>

      </div>

      {/* SUBMIT REVIEW DIALOG MODAL */}
      <Modal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        title={`Review ${restaurant.name}`}
      >
        <form onSubmit={handleReviewSubmit} className="space-y-4">
          {reviewSuccess && <Alert type="success" message={reviewSuccess} />}
          
          <div>
            <label className="block text-xs font-bold text-slate-655 dark:text-slate-405 uppercase tracking-wider mb-2">
              Sustainability Rating (1-5)
            </label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setReviewRating(star)}
                  className="p-1 hover:scale-110 transition-transform cursor-pointer"
                >
                  <Star className={`w-8 h-8 ${
                    star <= reviewRating 
                      ? 'text-amber-550 fill-amber-550' 
                      : 'text-slate-300 dark:text-slate-700'
                  }`} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-655 dark:text-slate-405 uppercase tracking-wider mb-2">
              Comment
            </label>
            <textarea
              required
              rows="4"
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="How was the food packaging? Did they fulfill zero waste delivery? Comment on food sourcing!"
              className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-xl focus:ring-1.5 focus:ring-emerald-500 focus:outline-none text-sm text-slate-800 dark:text-slate-200"
            />
          </div>

          <button
            type="submit"
            id="submit-review-btn"
            className="w-full py-3 bg-emerald-500 text-white font-bold text-sm rounded-xl hover:bg-emerald-600 transition-colors shadow shadow-emerald-500/10 cursor-pointer"
          >
            Submit Review
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
            <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest mb-1">Dish Name</label>
            <input required type="text" value={foodFormName} onChange={e => setFoodFormName(e.target.value)} className="w-full px-3 py-2 border border-slate-205 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-white rounded-xl text-sm" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-455 uppercase tracking-widest mb-1">Price (₹)</label>
            <input required type="number" value={foodFormPrice} onChange={e => setFoodFormPrice(e.target.value)} className="w-full px-3 py-2 border border-slate-205 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-white rounded-xl text-sm" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-455 uppercase tracking-widest mb-1">Dish Image URL</label>
            <input required type="text" value={foodFormImage} onChange={e => setFoodFormImage(e.target.value)} className="w-full px-3 py-2 border border-slate-205 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-white rounded-xl text-sm" />
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
            <label className="block text-[10px] font-bold text-slate-455 uppercase tracking-widest mb-1">Dish Sourcing details / description</label>
            <textarea required rows="3" value={foodFormDesc} onChange={e => setFoodFormDesc(e.target.value)} className="w-full p-3 border border-slate-205 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-805 dark:text-white rounded-xl text-sm" />
          </div>
          <button type="submit" className="w-full py-3 skeuo-button-primary text-xs uppercase tracking-widest rounded-xl font-bold">
            Save Dish to Inventory
          </button>
        </form>
      </Modal>

      {/* EDIT CERTIFICATIONS DIALOG MODAL */}
      <Modal
        isOpen={isCertModalOpen}
        onClose={() => setIsCertModalOpen(false)}
        title="Edit Restaurant Green Certifications"
      >
        <form onSubmit={handleCertSubmit} className="space-y-4 font-sans">
          {certSuccessMsg && <Alert type="success" message={certSuccessMsg} />}
          <div>
            <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest mb-2">
              Certifications (comma separated)
            </label>
            <input
              required
              type="text"
              value={certInput}
              onChange={e => setCertInput(e.target.value)}
              className="w-full px-3 py-3 bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 text-slate-800 dark:text-white rounded-xl focus:ring-1.5 focus:ring-emerald-500 focus:outline-none text-sm"
              placeholder="e.g., Plastic Free, 100% Organic, Carbon Neutral"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 skeuo-button-primary text-xs uppercase tracking-widest rounded-xl font-bold"
          >
            Save Certifications
          </button>
        </form>
      </Modal>

    </div>
  );
}
