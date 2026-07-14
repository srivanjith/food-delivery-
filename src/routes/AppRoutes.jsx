import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Auth from '../pages/Auth';
import RestaurantMenu from '../pages/RestaurantMenu';
import Cart from '../pages/Cart';
import Checkout from '../pages/Checkout';
import OrderTracking from '../pages/OrderTracking';
import UserDashboard from '../pages/UserDashboard';
import AdminDashboard from '../pages/AdminDashboard';
import RestaurantDashboard from '../pages/RestaurantDashboard';
import DeliveryDashboard from '../pages/DeliveryDashboard';
import Wallet from '../pages/Wallet';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/restaurant/:id" element={<RestaurantMenu />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/order-tracking/:id" element={<OrderTracking />} />
      <Route path="/dashboard" element={<UserDashboard />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/restaurant-dashboard" element={<RestaurantDashboard />} />
      <Route path="/delivery-dashboard" element={<DeliveryDashboard />} />
      <Route path="/wallet" element={<Wallet />} />
      <Route path="*" element={<Home />} />
    </Routes>
  );
}
