import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import DarkModeToggle from './DarkModeToggle';
import { ShoppingCart, User, LogOut, Menu, X, Leaf, ShieldAlert } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Restaurants', path: '/' } // Home contains the filterable restaurants
  ];

  return (
    <nav className="sticky top-0 z-40 w-full glass-effect transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0 group">
            <div className="p-2 bg-emerald-500 rounded-xl text-white group-hover:scale-105 transition-transform duration-250">
              <Leaf className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent dark:from-emerald-400 dark:to-teal-300 font-sans">
              EcoEats
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className={`text-sm font-semibold transition-colors duration-200 ${
                isActive('/') ? 'text-emerald-500 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-350 hover:text-emerald-500 dark:hover:text-emerald-400'
              }`}
            >
              Order Meals
            </Link>

            {user && user.role === 'admin' && (
              <Link
                to="/admin"
                className={`flex items-center text-sm font-semibold transition-colors duration-200 ${
                  isActive('/admin') ? 'text-emerald-500 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-350 hover:text-emerald-500 dark:hover:text-emerald-400'
                }`}
              >
                <ShieldAlert className="w-4 h-4 mr-1 text-amber-500" />
                Admin Panel
              </Link>
            )}

            {user && user.role === 'customer' && (
              <Link
                to="/dashboard"
                className={`text-sm font-semibold transition-colors duration-200 ${
                  isActive('/dashboard') ? 'text-emerald-500 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-350 hover:text-emerald-500 dark:hover:text-emerald-400'
                }`}
              >
                Dashboard
              </Link>
            )}
          </div>

          {/* Desktop Right items */}
          <div className="hidden md:flex items-center space-x-4">
            <DarkModeToggle />

            {/* Cart Button */}
            <Link
              to="/cart"
              id="desktop-cart-link"
              className="relative p-2 text-slate-600 dark:text-slate-300 hover:text-emerald-500 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all duration-200"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-950 animate-bounce">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Auth Buttons */}
            {user ? (
              <div className="flex items-center space-x-3">
                {user.role === 'customer' && (
                  <div className="flex flex-col items-end text-xs">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{user.name.split(' ')[0]}</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold font-sans">
                      🌱 {user.ecoPoints} pts
                    </span>
                  </div>
                )}
                <Link to={user.role === 'admin' ? '/admin' : '/dashboard'}>
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                    alt="Profile avatar"
                    className="w-8 h-8 rounded-full object-cover border border-emerald-500 hover:scale-105 transition-transform"
                  />
                </Link>
                <button
                  onClick={handleLogout}
                  id="desktop-logout-btn"
                  className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-colors cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                id="desktop-login-link"
                className="flex items-center space-x-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/20"
              >
                <User className="w-4 h-4" />
                <span>Sign In</span>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <DarkModeToggle />
            <Link
              to="/cart"
              className="relative p-2 text-slate-600 dark:text-slate-350 hover:text-emerald-500 dark:hover:text-emerald-400 rounded-xl"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-bold text-white ring-2 ring-white dark:ring-slate-900">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-600 dark:text-slate-350 hover:text-emerald-500 dark:hover:text-emerald-400 rounded-xl"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-100 dark:border-slate-800/80 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md transition-all duration-300">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 text-center">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className={`block px-3 py-2.5 rounded-xl text-base font-semibold ${
                isActive('/') ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Order Meals
            </Link>

            {user && user.role === 'admin' && (
              <Link
                to="/admin"
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2.5 rounded-xl text-base font-semibold text-amber-500 bg-amber-50 dark:bg-amber-950/20`}
              >
                Admin Panel Dashboard
              </Link>
            )}

            {user && user.role === 'customer' && (
              <Link
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2.5 rounded-xl text-base font-semibold ${
                  isActive('/dashboard') ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                Dashboard
              </Link>
            )}

            {user ? (
              <div className="pt-4 border-t border-slate-150 dark:border-slate-800">
                <div className="flex items-center justify-center space-x-3 px-3 py-2">
                  <img
                    src={user.avatar}
                    alt="User avatar"
                    className="w-10 h-10 rounded-full object-cover border border-emerald-500"
                  />
                  <div className="text-left">
                    <div className="font-semibold text-slate-800 dark:text-slate-200">{user.name}</div>
                    {user.role === 'customer' && (
                      <div className="text-emerald-500 dark:text-emerald-400 font-bold text-xs font-sans">🌱 {user.ecoPoints} Points</div>
                    )}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  id="mobile-logout-btn"
                  className="w-full mt-2 flex items-center justify-center space-x-2 px-3 py-3 rounded-xl text-base font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                id="mobile-login-link"
                onClick={() => setIsOpen(false)}
                className="mt-4 flex items-center justify-center space-x-2 mx-3 px-3 py-3 bg-emerald-500 text-white rounded-xl text-base font-semibold hover:bg-emerald-600 transition-colors"
              >
                <User className="w-5 h-5" />
                <span>Sign In / Create Account</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
