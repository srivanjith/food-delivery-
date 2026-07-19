import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [packagingChoice, setPackagingChoice] = useState('compostable'); // 'compostable', 'reusable', 'seaweed'
  const [deliveryMethod, setDeliveryMethod] = useState('ev'); // 'bicycle', 'ev', 'drone'
  const [offsetCarbon, setOffsetCarbon] = useState(true); // default true for green app

  // Load cart from local storage
  useEffect(() => {
    const storedCart = localStorage.getItem('ecoeats_cart');
    const storedPackaging = localStorage.getItem('ecoeats_packaging');
    const storedDelivery = localStorage.getItem('ecoeats_delivery');
    const storedOffset = localStorage.getItem('ecoeats_offset');

    if (storedCart) setCartItems(JSON.parse(storedCart));
    if (storedPackaging) setPackagingChoice(storedPackaging);
    if (storedDelivery) setDeliveryMethod(storedDelivery);
    if (storedOffset) setOffsetCarbon(JSON.parse(storedOffset));
  }, []);

  // Save cart to local storage when changed
  useEffect(() => {
    localStorage.setItem('ecoeats_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('ecoeats_packaging', packagingChoice);
  }, [packagingChoice]);

  useEffect(() => {
    localStorage.setItem('ecoeats_delivery', deliveryMethod);
  }, [deliveryMethod]);

  useEffect(() => {
    localStorage.setItem('ecoeats_offset', JSON.stringify(offsetCarbon));
  }, [offsetCarbon]);

  const addItem = (item) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id);
      if (existingItem) {
        return prevItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevItems, { ...item, quantity: 1 }];
    });
  };

  const removeItem = (itemId) => {
    setCartItems((prevItems) => prevItems.filter((i) => i.id !== itemId));
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((i) => (i.id === itemId ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setPackagingChoice('compostable');
    setDeliveryMethod('ev');
    setOffsetCarbon(true);
    localStorage.removeItem('ecoeats_cart');
  };

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  
  const packagingCosts = {
    compostable: 0,
    seaweed: 15,
    reusable: 50 // Refundable deposit
  };
  const packagingCharge = packagingCosts[packagingChoice] * cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const deliveryCharges = {
    bicycle: 20, // Cheap and eco-friendly
    ev: 35,
    drone: 60, // Premium tech delivery
    pickup: 0 // Self-pickup is free
  };
  const deliveryCharge = cartItems.length > 0 ? (deliveryCharges[deliveryMethod] ?? 0) : 0;

  const gst = Math.round((subtotal + packagingCharge) * 0.05); // 5% GST
  const offsetFee = offsetCarbon && cartItems.length > 0 ? 10 : 0; // ₹10 carbon offset donation
  const grandTotal = subtotal + packagingCharge + deliveryCharge + gst + offsetFee;

  const averageDistance = cartItems.length > 0 ? cartItems[0].distance || 2.5 : 0;

  // Points earned for this order
  // 1 point per ₹10 spent + 20 points for Bicycle, 10 for EV, 40 for self-pickup, 30 for seaweed, 50 for reusable
  // Additional points:
  // - Distance points: Closer is higher points, farther is lower points (Max of 5, or round(50 - distance * 10))
  const calculateEcoPointsEarned = () => {
    if (cartItems.length === 0) return 0;
    let points = Math.floor(subtotal / 10);
    if (deliveryMethod === 'bicycle') points += 20;
    if (deliveryMethod === 'ev') points += 10;
    if (deliveryMethod === 'pickup') points += 40; // Self-pickup bonus
    if (packagingChoice === 'seaweed') points += 30;
    if (packagingChoice === 'reusable') points += 50;
    
    // Check distance-based eco points
    const distancePoints = Math.max(5, Math.round(50 - (averageDistance * 10)));
    points += distancePoints;

    return points;
  };

  const ecoPointsEarned = calculateEcoPointsEarned();

  return (
    <CartContext.Provider
      value={{
        cartItems,
        packagingChoice,
        setPackagingChoice,
        deliveryMethod,
        setDeliveryMethod,
        offsetCarbon,
        setOffsetCarbon,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        subtotal,
        packagingCharge,
        deliveryCharge,
        gst,
        offsetFee,
        grandTotal,
        ecoPointsEarned
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
