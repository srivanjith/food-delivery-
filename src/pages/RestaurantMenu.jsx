import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import MenuItem from '../components/Restaurant/MenuItem';
import MenuFilter from '../components/Restaurant/MenuFilter';
import Modal from '../components/Common/Modal';
import Alert from '../components/Common/Alert';
import StarBorder from '../components/Common/StarBorder';
import { Star, Clock, MapPin, Award, ArrowLeft, MessageSquare, PenTool, Plus } from 'lucide-react';

export default function RestaurantMenu() {
  const { id } = useParams();
  const { user } = useAuth();
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-16 font-sans">
      
      {/* Header Banner */}
      <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-slate-900">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover opacity-70 filter brightness-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
        
        {/* Navigation back */}
        <div className="absolute top-4 left-4 max-w-7xl mx-auto w-full px-4">
          <Link
            to="/"
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-white/10 dark:bg-slate-900/60 backdrop-blur-md text-white text-xs font-bold rounded-xl border border-white/15 hover:bg-white/20 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Restaurants</span>
          </Link>
        </div>

        {/* Restaurant Profile details absolute position inside banner */}
        <div className="absolute bottom-6 left-0 right-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white space-y-3">
            <div className="flex flex-wrap gap-2">
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-sans">
              {restaurant.name}
            </h1>
            
            <p className="text-xs sm:text-sm text-slate-350 max-w-2xl font-normal leading-relaxed">
              {restaurant.description}
            </p>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-300 pt-1">
              <span className="flex items-center">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 mr-1" />
                {restaurant.rating} ({restaurantReviews.length} reviews)
              </span>
              <span>•</span>
              <span className="flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1" />
                {restaurant.deliveryTime} mins delivery
              </span>
              <span>•</span>
              <span className="flex items-center">
                <MapPin className="w-3.5 h-3.5 mr-1" />
                {restaurant.location} ({restaurant.distance} km)
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Menu items & deals */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Restaurant certifications section */}
          <StarBorder color="#22C55E" speed="5s" thickness={2}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Verified Green Certifications</h3>
                {(user?.role === 'admin' || user?.role === 'restaurant') && (
                  <button
                    onClick={openCertModal}
                    className="p-1 text-slate-450 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                    title="Edit Certifications"
                  >
                    <PenTool className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2.5">
                {restaurant.certifications && restaurant.certifications.map((cert, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center text-xs font-bold text-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-305 px-3 py-1.5 rounded-xl border border-emerald-100 dark:border-emerald-900"
                  >
                    <Award className="w-3.5 h-3.5 mr-1 text-emerald-500" />
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          </StarBorder>

          {/* Dishes menu filter */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">Restaurant Menu</h3>
              {(user?.role === 'admin' || user?.role === 'restaurant') && (
                <button
                  onClick={openFoodAddModal}
                  className="inline-flex items-center space-x-1.5 px-3.5 py-2 skeuo-button-primary text-xs font-bold rounded-xl"
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

            {/* Menu items listing */}
            <div className="space-y-4 mt-6">
              {filteredMenuItems.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
                  <span className="text-3xl">🥗</span>
                  <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mt-2">No dishes match filters</h4>
                  <p className="text-xs text-slate-400 mt-1">Try resetting menu search queries.</p>
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
          <StarBorder color="#F59E0B" speed="6s" thickness={2}>
            <div className="p-6 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-black text-slate-805 dark:text-white uppercase tracking-wider flex items-center">
                  <MessageSquare className="w-4 h-4 mr-1.5 text-emerald-500" />
                  Sustaina-Reviews
                </h3>
                
                <button
                  onClick={() => setIsReviewModalOpen(true)}
                  id="open-review-modal-btn"
                  className="p-1.5 bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 rounded-lg hover:scale-105 transition-transform cursor-pointer"
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
                    <div key={rev.id} className="border-b border-slate-100 dark:border-slate-800 pb-3 last:border-0 last:pb-0 space-y-1.5">
                      <div className="flex justify-between items-center text-xs font-semibold text-slate-600 dark:text-slate-400">
                        <span>{rev.user}</span>
                        <span className="flex items-center text-amber-500 font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 mr-0.5" />
                          {rev.rating}/5
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                        "{rev.comment}"
                      </p>
                      <span className="block text-[10px] text-slate-400 text-right">{rev.date}</span>
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
