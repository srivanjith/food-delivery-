import React, { createContext, useContext, useState, useEffect } from 'react';
import { RESTAURANTS, FOOD_ITEMS, SURPLUS_DEALS, MOCK_ORDERS } from '../data/mockData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [surplusDeals, setSurplusDeals] = useState([]);
  const [orders, setOrders] = useState([]);
  
  // Platform statistics
  const [platformCarbonSaved, setPlatformCarbonSaved] = useState(1284530); // in grams
  const [platformTreesPlanted, setPlatformTreesPlanted] = useState(4822);
  const [reviews, setReviews] = useState([
    { id: 'rev-1', restaurantId: 'rest-1', user: 'Mark S.', rating: 5, comment: 'Hands down the best salad in the city! Love that it comes in compostable packaging.', date: '2026-06-30' },
    { id: 'rev-2', restaurantId: 'rest-1', user: 'Emma K.', rating: 4, comment: 'Great portions, and the carbon tracking really opened my eyes. Highly recommend.', date: '2026-07-01' },
    { id: 'rev-3', restaurantId: 'rest-2', user: 'David P.', rating: 5, comment: 'Delicious vegetarian options, local ingredients taste so fresh!', date: '2026-06-28' }
  ]);

  useEffect(() => {
    const storedRest = localStorage.getItem('ee_restaurants');
    const storedFood = localStorage.getItem('ee_fooditems');
    const storedDeals = localStorage.getItem('ee_surplusdeals');
    const storedOrders = localStorage.getItem('ee_orders');
    const storedReviews = localStorage.getItem('ee_reviews');
    const storedCarbon = localStorage.getItem('ee_plat_carbon');
    const storedTrees = localStorage.getItem('ee_plat_trees');

    if (storedRest) setRestaurants(JSON.parse(storedRest));
    else setRestaurants(RESTAURANTS);

    if (storedFood) setFoodItems(JSON.parse(storedFood));
    else setFoodItems(FOOD_ITEMS);

    if (storedDeals) setSurplusDeals(JSON.parse(storedDeals));
    else setSurplusDeals(SURPLUS_DEALS);

    if (storedOrders) setOrders(JSON.parse(storedOrders));
    else setOrders(MOCK_ORDERS);

    if (storedReviews) setReviews(JSON.parse(storedReviews));

    if (storedCarbon) setPlatformCarbonSaved(parseInt(storedCarbon, 10));
    if (storedTrees) setPlatformTreesPlanted(parseInt(storedTrees, 10));
  }, []);

  // Persistence helpers
  const saveToStorage = (key, data, setter) => {
    setter(data);
    localStorage.setItem(key, JSON.stringify(data));
  };

  const addOrder = (order) => {
    const updatedOrders = [order, ...orders];
    saveToStorage('ee_orders', updatedOrders, setOrders);
    
    // Add carbon offset and trees to platform totals
    const newCarbonTotal = platformCarbonSaved + (order.carbonSaved || 0);
    const newTreesTotal = platformTreesPlanted + (order.treesPlanted || 0);
    
    setPlatformCarbonSaved(newCarbonTotal);
    localStorage.setItem('ee_plat_carbon', newCarbonTotal.toString());
    
    setPlatformTreesPlanted(newTreesTotal);
    localStorage.setItem('ee_plat_trees', newTreesTotal.toString());
  };

  const updateOrderStatus = (orderId, status) => {
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, status } : order
    );
    saveToStorage('ee_orders', updatedOrders, setOrders);
  };

  const addReview = (restaurantId, rating, comment, userName) => {
    const newReview = {
      id: `rev-${Math.floor(Math.random() * 10000)}`,
      restaurantId,
      user: userName || 'Anonymous Greenie',
      rating,
      comment,
      date: new Date().toISOString().split('T')[0]
    };
    const updatedReviews = [newReview, ...reviews];
    saveToStorage('ee_reviews', updatedReviews, setReviews);
  };

  // Admin Restaurant Management
  const addRestaurant = (restaurant) => {
    const newRest = {
      ...restaurant,
      id: `rest-${Math.floor(Math.random() * 1000)}`,
      rating: 5.0,
      distance: parseFloat((Math.random() * 4 + 0.5).toFixed(1)),
      carbonOffsetAvg: 80,
      certifications: restaurant.certifications || ['Eco Friendly']
    };
    const updated = [...restaurants, newRest];
    saveToStorage('ee_restaurants', updated, setRestaurants);
  };

  const updateRestaurant = (updatedRest) => {
    const updated = restaurants.map(r => r.id === updatedRest.id ? updatedRest : r);
    saveToStorage('ee_restaurants', updated, setRestaurants);
  };

  const deleteRestaurant = (restId) => {
    const updated = restaurants.filter(r => r.id !== restId);
    saveToStorage('ee_restaurants', updated, setRestaurants);
    // Also clean up related food items
    const updatedFood = foodItems.filter(item => item.restaurantId !== restId);
    saveToStorage('ee_fooditems', updatedFood, setFoodItems);
  };

  // Admin Food Items Management
  const addFoodItem = (item) => {
    const newItem = {
      ...item,
      id: `food-${Math.floor(Math.random() * 10000)}`,
      rating: 5.0
    };
    const updated = [...foodItems, newItem];
    saveToStorage('ee_fooditems', updated, setFoodItems);
  };

  const updateFoodItem = (updatedItem) => {
    const updated = foodItems.map(item => item.id === updatedItem.id ? updatedItem : item);
    saveToStorage('ee_fooditems', updated, setFoodItems);
  };

  const deleteFoodItem = (itemId) => {
    const updated = foodItems.filter(item => item.id !== itemId);
    saveToStorage('ee_fooditems', updated, setFoodItems);
  };

  // Admin Surplus Deals Management
  const addSurplusDeal = (deal) => {
    const newDeal = {
      ...deal,
      id: `deal-${Math.floor(Math.random() * 10000)}`,
      ecoScore: 'A+'
    };
    const updated = [...surplusDeals, newDeal];
    saveToStorage('ee_surplusdeals', updated, setSurplusDeals);
  };

  const updateSurplusDeal = (updatedDeal) => {
    const updated = surplusDeals.map(d => d.id === updatedDeal.id ? updatedDeal : d);
    saveToStorage('ee_surplusdeals', updated, setSurplusDeals);
  };

  const deleteSurplusDeal = (dealId) => {
    const updated = surplusDeals.filter(d => d.id !== dealId);
    saveToStorage('ee_surplusdeals', updated, setSurplusDeals);
  };

  return (
    <AppContext.Provider
      value={{
        restaurants,
        foodItems,
        surplusDeals,
        orders,
        reviews,
        platformCarbonSaved,
        platformTreesPlanted,
        addOrder,
        updateOrderStatus,
        addReview,
        addRestaurant,
        updateRestaurant,
        deleteRestaurant,
        addFoodItem,
        updateFoodItem,
        deleteFoodItem,
        addSurplusDeal,
        updateSurplusDeal,
        deleteSurplusDeal
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
