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
    drone: 60 // Premium tech delivery
  };
  const deliveryCharge = cartItems.length > 0 ? deliveryCharges[deliveryMethod] : 0;

  const gst = Math.round((subtotal + packagingCharge) * 0.05); // 5% GST
  const offsetFee = offsetCarbon && cartItems.length > 0 ? 10 : 0; // ₹10 carbon offset donation
  const grandTotal = subtotal + packagingCharge + deliveryCharge + gst + offsetFee;

  // Carbon Impact Calculations
  const foodCarbonFootprint = cartItems.reduce(
    (acc, item) => acc + (item.carbonFootprint || 150) * item.quantity,
    0
  );

  // Carbon offsets based on packaging and delivery methods
  // Standard packaging (plastic/styrofoam) is estimated to emit 80g per meal. Compostable is 20g, seaweed 5g, reusable is 0g (after first use)
  const standardPackagingEmissions = cartItems.reduce((acc, item) => acc + 80 * item.quantity, 0);
  const selectedPackagingEmissions = {
    compostable: cartItems.reduce((acc, item) => acc + 20 * item.quantity, 0),
    seaweed: cartItems.reduce((acc, item) => acc + 5 * item.quantity, 0),
    reusable: 0
  }[packagingChoice];

  // Standard delivery (petrol bike) emits around 150g CO2 per km.
  // Delivery distance average: 2.5km (375g CO2)
  const averageDistance = cartItems.length > 0 ? cartItems[0].distance || 2.5 : 0;
  const standardDeliveryEmissions = Math.round(averageDistance * 150);
  
  const selectedDeliveryEmissions = {
    bicycle: 0,
    ev: Math.round(averageDistance * 20), // EV grid electricity emissions
    drone: Math.round(averageDistance * 10) // Drone electrical efficiency
  }[deliveryMethod];

  const totalCarbonFootprint = foodCarbonFootprint + selectedPackagingEmissions + selectedDeliveryEmissions;

  // Let's calculate the savings!
  // Baseline: Standard restaurant meal (meat heavy, ~400g CO2 average per dish) + plastic packing (80g) + petrol delivery (150g/km)
  const baselineFoodEmissions = cartItems.reduce((acc, item) => {
    // If it's steak it has high baseline, but standard meals average 450g. We save by choosing vegetarian/vegan or sustainable alternatives.
    const baseline = item.name.toLowerCase().includes('steak') ? 1200 : 450;
    return acc + baseline * item.quantity;
  }, 0);
  
  const baselineTotal = baselineFoodEmissions + standardPackagingEmissions + standardDeliveryEmissions;
  const carbonSaved = cartItems.length > 0 ? Math.max(0, baselineTotal - totalCarbonFootprint) : 0;

  // Points earned for this order
  // 1 point per ₹10 spent + 20 points for Bicycle, 10 for EV, 30 for seaweed, 50 for reusable, 15 for surplus items
  const calculateEcoPointsEarned = () => {
    if (cartItems.length === 0) return 0;
    let points = Math.floor(subtotal / 10);
    if (deliveryMethod === 'bicycle') points += 20;
    if (deliveryMethod === 'ev') points += 10;
    if (packagingChoice === 'seaweed') points += 30;
    if (packagingChoice === 'reusable') points += 50;
    
    // Check if contains surplus
    const hasSurplus = cartItems.some(item => item.id.startsWith('deal-'));
    if (hasSurplus) points += 25;

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
        totalCarbonFootprint,
        carbonSaved,
        ecoPointsEarned
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
