import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { Home, ShoppingCart, User, LogOut, LogIn, Leaf, ShieldAlert, Coins } from 'lucide-react';
import Dock from './Dock';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Map Dock Items based on login state and user role
  const dockItems = [
    {
      icon: <Home className="w-5 h-5" />,
      label: 'Home',
      onClick: () => navigate('/'),
      className: location.pathname === '/' ? 'border-emerald-500/50 bg-emerald-500/10' : ''
    },
    {
      icon: (
        <div className="relative">
          <ShoppingCart className="w-5 h-5" />
          {cartCount > 0 && (
            <span className="dock-cart-badge">{cartCount}</span>
          )}
        </div>
      ),
      label: 'Cart',
      onClick: () => navigate('/cart'),
      className: location.pathname === '/cart' ? 'border-emerald-500/50 bg-emerald-500/10' : ''
    }
  ];

  // User Reward Wallet (visible if logged in)
  if (user) {
    dockItems.push({
      icon: <Coins className="w-5 h-5 text-emerald-400" />,
      label: 'Wallet',
      onClick: () => navigate('/wallet'),
      className: location.pathname === '/wallet' ? 'border-emerald-500/50 bg-emerald-500/10' : ''
    });
  }

  // User details dashboard
  if (user && (user.role === 'customer' || user.role === 'restaurant')) {
    dockItems.push({
      icon: <User className="w-5 h-5" />,
      label: 'Dashboard',
      onClick: () => navigate('/dashboard'),
      className: location.pathname === '/dashboard' ? 'border-emerald-500/50 bg-emerald-500/10' : ''
    });
  }

  // Admin and operations manager
  if (user && (user.role === 'admin' || user.role === 'restaurant')) {
    dockItems.push({
      icon: <ShieldAlert className="w-5 h-5 text-amber-400" />,
      label: 'Admin Panel',
      onClick: () => navigate('/admin'),
      className: location.pathname === '/admin' ? 'border-amber-500/50 bg-amber-500/10' : ''
    });
  }

  // Sign out / Sign In
  if (user) {
    dockItems.push({
      icon: <LogOut className="w-5 h-5 text-red-400" />,
      label: 'Sign Out',
      onClick: () => {
        logout();
        navigate('/');
      }
    });
  } else {
    dockItems.push({
      icon: <LogIn className="w-5 h-5 text-emerald-450" />,
      label: 'Sign In',
      onClick: () => navigate('/auth'),
      className: location.pathname === '/auth' ? 'border-emerald-500/50 bg-emerald-500/10' : ''
    });
  }

  return (
    <>
      {/* Top Header Branding Banner */}
      <header className="sticky top-0 z-40 w-full bg-slate-950/70 backdrop-blur-md border-b border-slate-900 text-slate-200 py-3 select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-10">
          
          {/* Logo link */}
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0 group">
            <div className="p-2 bg-emerald-500 rounded-xl text-white group-hover:scale-105 transition-transform duration-250">
              <Leaf className="w-4.5 h-4.5" />
            </div>
            <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-emerald-500 to-amber-400 bg-clip-text text-transparent font-sans">
              EcoEats
            </span>
          </Link>

          {/* User profile status badge */}
          {user && (
            <div className="flex items-center space-x-2.5 bg-slate-900 border border-slate-800 rounded-full pl-2.5 pr-3 py-1">
              <img
                src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                alt="Profile"
                className="w-5 h-5 rounded-full object-cover border border-emerald-500"
              />
              <span className="text-[10px] font-extrabold text-slate-350 tracking-wide uppercase">{user.name.split(' ')[0]}</span>
            </div>
          )}
        </div>
      </header>

      {/* Floating Left Sidebar Navigation Dock */}
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
