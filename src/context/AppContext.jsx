import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        if (u && u.id) {
          headers['x-user-id'] = u.id;
        }
      } catch (e) {}
    }
    return headers;
  };

  const loadOrders = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setOrders([]);
      return;
    }
    try {
      const res = await fetch('/api/orders', { headers: getAuthHeaders() });
      if (res.status === 401) {
        setOrders([]);
        return;
      }
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Error fetching orders:', e);
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [restRes, foodRes, reviewsRes] = await Promise.all([
          fetch('/api/restaurants'),
          fetch('/api/food-items'),
          fetch('/api/reviews')
        ]);
        const rests = await restRes.json();
        const foods = await foodRes.json();
        const revs = await reviewsRes.json();

        setRestaurants(rests);
        setFoodItems(foods);
        setReviews(revs);
      } catch (e) {
        console.error('Error fetching backend data:', e);
      }
    };

    loadInitialData();
    loadOrders();

    // Setup real-time Socket.io listener for order synchronization
    let socket;
    import('socket.io-client').then(({ io }) => {
      socket = io('http://localhost:5000');
      socket.on('orderStatusUpdated', () => {
        console.log('🔌 [WEBSOCKET CONTEXT] Order update detected. Syncing orders...');
        loadOrders();
      });
    });

    // Re-fetch orders whenever login/logout happens
    window.addEventListener('auth-changed', loadOrders);
    return () => {
      window.removeEventListener('auth-changed', loadOrders);
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  const addOrder = async (order) => {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(order)
      });
      const data = await response.json();
      if (data.success) {
        setOrders(prev => [data.order, ...prev]);
        return { order: data.order, paymentDetails: data.paymentDetails };
      }
      return null;
    } catch (err) {
      console.error('Error placing order:', err);
      return null;
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
      });
      const data = await response.json();
      if (data.success) {
        setOrders(prev => prev.map(o => o.id === orderId ? data.order : o));
      }
      return data;
    } catch (err) {
      console.error('Error updating order status:', err);
      return { success: false };
    }
  };

  const addReview = async (restaurantId, rating, comment, userName) => {
    const newReview = {
      restaurantId,
      user: userName || 'Anonymous Greenie',
      rating,
      comment
    };
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(newReview)
      });
      const data = await response.json();
      if (data.success) {
        setReviews(prev => [data.review, ...prev]);
      }
    } catch (err) {
      console.error('Error adding review:', err);
    }
  };

  // Admin Restaurant Management
  const addRestaurant = async (restaurant) => {
    try {
      const response = await fetch('/api/restaurants', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(restaurant)
      });
      const data = await response.json();
      if (data.success) {
        setRestaurants(prev => [...prev, data.restaurant]);
      }
    } catch (err) {
      console.error('Error adding restaurant:', err);
    }
  };

  const updateRestaurant = async (updatedRest) => {
    try {
      const response = await fetch(`/api/restaurants/${updatedRest.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updatedRest)
      });
      const data = await response.json();
      if (data.success) {
        setRestaurants(prev => prev.map(r => r.id === updatedRest.id ? data.restaurant : r));
      }
    } catch (err) {
      console.error('Error updating restaurant:', err);
    }
  };

  const deleteRestaurant = async (restId) => {
    try {
      const response = await fetch(`/api/restaurants/${restId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (data.success) {
        setRestaurants(prev => prev.filter(r => r.id !== restId));
        setFoodItems(prev => prev.filter(item => item.restaurantId !== restId));
      }
    } catch (err) {
      console.error('Error deleting restaurant:', err);
    }
  };

  // Admin Food Items Management
  const addFoodItem = async (item) => {
    try {
      const response = await fetch('/api/food-items', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(item)
      });
      const data = await response.json();
      if (data.success) {
        setFoodItems(prev => [...prev, data.foodItem]);
      }
    } catch (err) {
      console.error('Error adding food item:', err);
    }
  };

  const updateFoodItem = async (updatedItem) => {
    try {
      const response = await fetch(`/api/food-items/${updatedItem.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updatedItem)
      });
      const data = await response.json();
      if (data.success) {
        setFoodItems(prev => prev.map(item => item.id === updatedItem.id ? data.foodItem : item));
      }
    } catch (err) {
      console.error('Error updating food item:', err);
    }
  };

  const deleteFoodItem = async (itemId) => {
    try {
      const response = await fetch(`/api/food-items/${itemId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (data.success) {
        setFoodItems(prev => prev.filter(item => item.id !== itemId));
      }
    } catch (err) {
      console.error('Error deleting food item:', err);
    }
  };

  return (
    <AppContext.Provider
      value={{
        restaurants,
        foodItems,
        orders,
        reviews,
        loadOrders,
        addOrder,
        updateOrderStatus,
        addReview,
        addRestaurant,
        updateRestaurant,
        deleteRestaurant,
        addFoodItem,
        updateFoodItem,
        deleteFoodItem
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
