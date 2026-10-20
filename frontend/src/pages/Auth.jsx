import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Alert from '../components/Common/Alert';
import { Leaf, Mail, Lock, User, KeyRound, ArrowLeft, Phone } from 'lucide-react';

export default function Auth() {
  const { user, login, signup } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState('login'); // 'login' | 'signup' | 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('customer'); // 'customer' | 'restaurant' | 'delivery'
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const redirectUserByRole = (userRole) => {
    if (userRole === 'admin') {
      navigate('/admin');
    } else if (userRole === 'restaurant') {
      navigate('/restaurant-dashboard');
    } else if (userRole === 'delivery') {
      navigate('/delivery-dashboard');
    } else {
      navigate('/', { state: { showLoginTransition: true } });
    }
  };

  // If user is already authenticated, redirect to their role destination
  useEffect(() => {
    if (user && user.role) {
      redirectUserByRole(user.role);
    }
  }, [user]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    try {
      const loggedInUser = await login(email, password);
      redirectUserByRole(loggedInUser.role);
    } catch (err) {
      setErrorMsg(err.message || 'Login failed. Please verify credentials.');
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match!");
      return;
    }
    setLoading(true);
    try {
      const registeredUser = await signup(name, email, password, phone, role);
      redirectUserByRole(registeredUser.role);
    } catch (err) {
      setErrorMsg(err.message || 'Signup failed.');
      setLoading(false);
    }
  };

  const handleForgot = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    if (!email) {
      setErrorMsg('Please enter your email address.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccessMsg('Reset password link has been sent to your email.');
    }, 1000);
  };

  return (
    <div className="min-h-[85vh] bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
      
      {/* Background glowing aurora blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[20%] left-[15%] w-[400px] h-[400px] bg-emerald-500/10 rounded-full filter blur-[100px] animate-pulse-slow" />
        <div className="absolute bottom-[20%] right-[15%] w-[400px] h-[400px] bg-purple-500/5 rounded-full filter blur-[120px] animate-pulse-slow" />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center px-4 relative z-10">
        {/* Logo */}
        <div className="inline-flex p-3 bg-emerald-500 rounded-2xl text-white mb-4 shadow-lg shadow-emerald-500/20">
          <Leaf className="w-8 h-8 animate-sway" />
        </div>
        <h2 className="text-3xl font-black text-white tracking-tight">
          Welcome to EcoEats
        </h2>
        <p className="mt-2 text-xs text-slate-400">
          Sustainable food delivery helping you eat clean and offset carbon.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 relative z-10">
        <div className="bg-slate-900/60 backdrop-blur-xl py-8 px-6 sm:px-10 border border-slate-800/80 rounded-3xl shadow-2xl space-y-6">
          {errorMsg && <Alert type="error" message={errorMsg} />}
          {successMsg && <Alert type="success" message={successMsg} />}

          {/* LOGIN MODE */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="h-4.5 w-4.5 text-slate-500" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    id="login-email-input"
                    className="block w-full pl-10 pr-3 py-3 border border-slate-850 bg-slate-950 text-slate-200 rounded-xl focus:ring-1.5 focus:ring-emerald-500 focus:outline-none focus:border-emerald-500 text-sm font-sans"
                    placeholder="name@domain.com"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => { setMode('forgot'); setErrorMsg(''); setSuccessMsg(''); }}
                    className="text-xs font-bold text-emerald-500 hover:text-emerald-400"
                  >
                    Forgot?
                  </button>
                </div>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-4.5 w-4.5 text-slate-500" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    id="login-password-input"
                    className="block w-full pl-10 pr-3 py-3 border border-slate-855 bg-slate-950 text-slate-200 rounded-xl focus:ring-1.5 focus:ring-emerald-500 focus:outline-none focus:border-emerald-500 text-sm font-sans"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                id="login-submit-btn"
                className="w-full py-3 px-4 border border-transparent rounded-xl shadow-md shadow-emerald-500/10 text-sm font-bold text-white bg-emerald-500 hover:bg-emerald-600 focus:outline-none transition-colors duration-200 cursor-pointer disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>

              <p className="text-center text-xs text-slate-400 mt-4">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('signup'); setErrorMsg(''); }}
                  className="font-bold text-emerald-500 hover:text-emerald-400"
                >
                  Create one now
                </button>
              </p>
            </form>
          )}

          {/* SIGNUP MODE */}
          {mode === 'signup' && (
            <form onSubmit={handleSignup} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Your Full Name
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <User className="h-4.5 w-4.5 text-slate-500" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    id="signup-name-input"
                    className="block w-full pl-10 pr-3 py-3 border border-slate-855 bg-slate-950 text-slate-200 rounded-xl focus:ring-1.5 focus:ring-emerald-500 focus:outline-none focus:border-emerald-500 text-sm font-sans"
                    placeholder="Jane Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="h-4.5 w-4.5 text-slate-500" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    id="signup-email-input"
                    className="block w-full pl-10 pr-3 py-3 border border-slate-855 bg-slate-950 text-slate-200 rounded-xl focus:ring-1.5 focus:ring-emerald-500 focus:outline-none focus:border-emerald-500 text-sm font-sans"
                    placeholder="name@domain.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Phone Number
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Phone className="h-4.5 w-4.5 text-slate-500" />
                  </div>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    id="signup-phone-input"
                    className="block w-full pl-10 pr-3 py-3 border border-slate-855 bg-slate-950 text-slate-200 rounded-xl focus:ring-1.5 focus:ring-emerald-500 focus:outline-none focus:border-emerald-500 text-sm font-sans"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Password
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-4.5 w-4.5 text-slate-500" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    id="signup-password-input"
                    className="block w-full pl-10 pr-3 py-3 border border-slate-855 bg-slate-950 text-slate-200 rounded-xl focus:ring-1.5 focus:ring-emerald-500 focus:outline-none focus:border-emerald-500 text-sm font-sans"
                    placeholder="Min 6 characters"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Confirm Password
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <KeyRound className="h-4.5 w-4.5 text-slate-500" />
                  </div>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    id="signup-confirm-password-input"
                    className="block w-full pl-10 pr-3 py-3 border border-slate-855 bg-slate-950 text-slate-200 rounded-xl focus:ring-1.5 focus:ring-emerald-500 focus:outline-none focus:border-emerald-500 text-sm font-sans"
                    placeholder="Re-enter password"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Register as
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="block w-full px-3.5 py-3.5 border border-slate-855 bg-slate-950 text-slate-300 rounded-xl focus:ring-1.5 focus:ring-emerald-500 focus:outline-none focus:border-emerald-500 text-sm font-semibold font-sans cursor-pointer"
                >
                  <option value="customer">Customer (Eco-Citizen)</option>
                  <option value="restaurant">Restaurant Owner (Hotel Partner)</option>
                  <option value="delivery">Delivery Partner (Eco Courier)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                id="signup-submit-btn"
                className="w-full py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-emerald-500 hover:bg-emerald-600 focus:outline-none transition-colors duration-200 cursor-pointer disabled:bg-slate-800 disabled:text-slate-500"
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </button>

              <p className="text-center text-xs text-slate-400 mt-4">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('login'); setErrorMsg(''); }}
                  className="font-bold text-emerald-500 hover:text-emerald-400"
                >
                  Sign In
                </button>
              </p>
            </form>
          )}

          {/* FORGOT PASSWORD MODE */}
          {mode === 'forgot' && (
            <form onSubmit={handleForgot} className="space-y-5">
              <button
                type="button"
                onClick={() => { setMode('login'); setErrorMsg(''); setSuccessMsg(''); }}
                className="inline-flex items-center text-xs font-bold text-slate-405 hover:text-emerald-500 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                Back to Login
              </button>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="h-4.5 w-4.5 text-slate-500" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    id="forgot-email-input"
                    className="block w-full pl-10 pr-3 py-3 border border-slate-855 bg-slate-950 text-slate-200 rounded-xl focus:ring-1.5 focus:ring-emerald-500 focus:outline-none focus:border-emerald-500 text-sm font-sans"
                    placeholder="name@domain.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                id="forgot-submit-btn"
                className="w-full py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-emerald-500 hover:bg-emerald-600 focus:outline-none transition-colors duration-200 cursor-pointer disabled:bg-slate-800 disabled:text-slate-500"
              >
                {loading ? 'Sending email...' : 'Reset Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
