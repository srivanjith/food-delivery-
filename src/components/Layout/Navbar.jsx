import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { Home, ShoppingCart, Truck, User, LogOut, LogIn, Zap, ShieldAlert, Coins, BarChart2 } from 'lucide-react';
import Dock from './Dock';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const isActive = (path) => location.pathname === path;
  const isAdmin = user?.role === 'admin';

  // Build dock items
  const dockItems = [
    {
      icon: <Home className="w-5 h-5" />,
      label: 'Home',
      onClick: () => navigate('/'),
      className: isActive('/') ? 'border-emerald-500/50 bg-emerald-500/10' : ''
    }
  ];

  // 2nd slot: Delivery (admin) or Cart (others)
  if (isAdmin) {
    dockItems.push({
      icon: <Truck className="w-5 h-5" style={{ color: '#A78BFA' }} />,
      label: 'Delivery',
      onClick: () => navigate('/admin', { state: { tab: 'orders' } }),
      className: isActive('/admin') ? 'border-emerald-500/50 bg-emerald-500/10' : ''
    });
  } else {
    dockItems.push({
      icon: (
        <div className="relative">
          <ShoppingCart className="w-5 h-5" />
          {cartCount > 0 && <span className="dock-cart-badge">{cartCount}</span>}
        </div>
      ),
      label: 'Cart',
      onClick: () => navigate('/cart'),
      className: isActive('/cart') ? 'border-emerald-500/50 bg-emerald-500/10' : ''
    });
  }

  // 3rd slot: Financial Planning (admin) or Wallet (others)
  if (user) {
    if (isAdmin) {
      dockItems.push({
        icon: <BarChart2 className="w-5 h-5" style={{ color: 'var(--mp-success)' }} />,
        label: 'Financial Planning',
        onClick: () => navigate('/admin', { state: { tab: 'offers' } }),
        className: ''
      });
    } else {
      dockItems.push({
        icon: <Coins className="w-5 h-5" style={{ color: 'var(--mp-warning)' }} />,
        label: 'Wallet',
        onClick: () => navigate('/wallet'),
        className: isActive('/wallet') ? 'border-emerald-500/50 bg-emerald-500/10' : ''
      });
    }
  }

  // Dashboard (customer / restaurant)
  if (user && (user.role === 'customer' || user.role === 'restaurant')) {
    dockItems.push({
      icon: <User className="w-5 h-5" />,
      label: 'Dashboard',
      onClick: () => navigate('/dashboard'),
      className: isActive('/dashboard') ? 'border-emerald-500/50 bg-emerald-500/10' : ''
    });
  }

  // Admin Panel — opens the full dashboard tab
  if (user && (user.role === 'admin' || user.role === 'restaurant')) {
    dockItems.push({
      icon: <ShieldAlert className="w-5 h-5" style={{ color: 'var(--mp-warning)' }} />,
      label: 'Admin Panel',
      onClick: () => navigate('/admin', { state: { tab: 'dashboard' } }),
      className: isActive('/admin') ? 'border-amber-500/50 bg-amber-500/10' : ''
    });
  }

  // Sign Out / Sign In
  if (user) {
    dockItems.push({
      icon: <LogOut className="w-5 h-5" style={{ color: '#EF4444' }} />,
      label: 'Sign Out',
      onClick: () => { logout(); navigate('/'); }
    });
  } else {
    dockItems.push({
      icon: <LogIn className="w-5 h-5" style={{ color: 'var(--mp-primary)' }} />,
      label: 'Sign In',
      onClick: () => navigate('/auth'),
      className: isActive('/auth') ? 'border-emerald-500/50 bg-emerald-500/10' : ''
    });
  }

  return (
    <>
      {/* Top Header — Midnight Purple */}
      <header
        className="sticky top-0 z-40 w-full py-3 select-none"
        style={{
          background: 'linear-gradient(to right, rgba(17,24,39,0.96), rgba(15,23,42,0.96))',
          backdropFilter: 'blur(18px)',
          borderBottom: '1px solid rgba(139,92,246,0.2)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.45)'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-10">

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0 group">
            <div
              className="p-2 rounded-xl text-white group-hover:scale-105 transition-transform duration-200"
              style={{
                background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
                boxShadow: '0 4px 14px rgba(139,92,246,0.5)'
              }}
            >
              <Zap className="w-4 h-4" />
            </div>
            <span
              className="text-lg font-bold tracking-tight font-sans fuzzy-text"
              data-text="EcoEats"
              style={{
                background: 'linear-gradient(135deg, #C4B5FD, #A78BFA, #F59E0B)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              EcoEats
            </span>
          </Link>

          {/* User badge */}
          {user && (
            <div
              className="flex items-center space-x-2.5 rounded-full pl-2.5 pr-3 py-1"
              style={{
                background: 'rgba(139,92,246,0.1)',
                border: '1px solid rgba(139,92,246,0.28)'
              }}
            >
              <img
                src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                alt="Profile"
                className="w-5 h-5 rounded-full object-cover"
                style={{ border: '1.5px solid #8B5CF6' }}
              />
              <span className="text-[10px] font-extrabold tracking-wide uppercase" style={{ color: '#C4B5FD' }}>
                {user.name.split(' ')[0]}
              </span>
              <span
                className="text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider"
                style={{ background: 'rgba(139,92,246,0.2)', color: '#A78BFA' }}
              >
                {user.role}
              </span>
            </div>
          )}
        </div>
      </header>

      {/* Floating Sidebar Dock */}
      <Dock
        items={dockItems}
        panelWidth={52}
        baseItemSize={42}
        magnification={54}
        distance={150}
      />
    </>
  );
}
