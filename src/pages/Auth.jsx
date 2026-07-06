import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Alert from '../components/Common/Alert';
import { Leaf, Mail, Lock, User, KeyRound, ArrowLeft } from 'lucide-react';

export default function Auth() {
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState('login'); // 'login' | 'signup' | 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    try {
      const loggedUser = await login(email, password);
      if (loggedUser.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Login failed. Please verify credentials.');
    } finally {
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
      await signup(name, email, password);
      navigate('/');
    } catch (err) {
      setErrorMsg(err.message || 'Signup failed.');
    } finally {
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
    <div className="min-h-[85vh] bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center px-4">
        {/* Logo */}
        <div className="inline-flex p-3 bg-emerald-500 rounded-2xl text-white mb-4">
          <Leaf className="w-8 h-8 animate-sway" />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white font-sans tracking-tight">
          Welcome to EcoEats
        </h2>
        <p className="mt-2 text-xs text-slate-505 dark:text-slate-400">
          Sustainable food delivery helping you eat clean and offset carbon.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white dark:bg-slate-900 py-8 px-6 sm:px-10 border border-slate-205 dark:border-slate-800 rounded-3xl shadow-xl space-y-6">
          {errorMsg && <Alert type="error" message={errorMsg} />}
          {successMsg && <Alert type="success" message={successMsg} />}

          {/* LOGIN MODE */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-655 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="h-4.5 w-4.5 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    id="login-email-input"
                    className="block w-full pl-10 pr-3 py-3 border border-slate-205 dark:border-slate-850 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-200 rounded-xl focus:ring-1.5 focus:ring-emerald-500 focus:outline-none"
                    placeholder="name@domain.com"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-bold text-slate-655 dark:text-slate-400 uppercase tracking-wider">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => { setMode('forgot'); setErrorMsg(''); setSuccessMsg(''); }}
                    className="text-xs font-bold text-emerald-500 hover:text-emerald-650"
                  >
                    Forgot?
                  </button>
                </div>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-4.5 w-4.5 text-slate-400" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    id="login-password-input"
                    className="block w-full pl-10 pr-3 py-3 border border-slate-205 dark:border-slate-850 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-200 rounded-xl focus:ring-1.5 focus:ring-emerald-500 focus:outline-none"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                id="login-submit-btn"
                className="w-full py-3 px-4 border border-transparent rounded-xl shadow-md shadow-emerald-500/10 text-sm font-bold text-white bg-emerald-500 hover:bg-emerald-600 focus:outline-none transition-colors duration-200 cursor-pointer disabled:bg-slate-300 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>


              <p className="text-center text-xs text-slate-500 mt-4">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('signup'); setErrorMsg(''); }}
                  className="font-bold text-emerald-500 hover:text-emerald-650"
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
                <label className="block text-xs font-bold text-slate-655 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Your Full Name
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <User className="h-4.5 w-4.5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    id="signup-name-input"
                    className="block w-full pl-10 pr-3 py-3 border border-slate-205 dark:border-slate-855 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-200 rounded-xl focus:ring-1.5 focus:ring-emerald-500 focus:outline-none"
                    placeholder="Jane Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-655 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="h-4.5 w-4.5 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    id="signup-email-input"
                    className="block w-full pl-10 pr-3 py-3 border border-slate-205 dark:border-slate-855 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-200 rounded-xl focus:ring-1.5 focus:ring-emerald-500 focus:outline-none"
                    placeholder="name@domain.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-655 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Password
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-4.5 w-4.5 text-slate-400" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    id="signup-password-input"
                    className="block w-full pl-10 pr-3 py-3 border border-slate-205 dark:border-slate-855 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-200 rounded-xl focus:ring-1.5 focus:ring-emerald-500 focus:outline-none"
                    placeholder="Min 6 characters"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-655 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Confirm Password
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <KeyRound className="h-4.5 w-4.5 text-slate-400" />
                  </div>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    id="signup-confirm-password-input"
                    className="block w-full pl-10 pr-3 py-3 border border-slate-205 dark:border-slate-855 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-200 rounded-xl focus:ring-1.5 focus:ring-emerald-500 focus:outline-none"
                    placeholder="Re-enter password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                id="signup-submit-btn"
                className="w-full py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-emerald-500 hover:bg-emerald-600 focus:outline-none transition-colors duration-200 cursor-pointer"
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </button>

              <p className="text-center text-xs text-slate-500 mt-4">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('login'); setErrorMsg(''); }}
                  className="font-bold text-emerald-500 hover:text-emerald-650"
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
                className="inline-flex items-center text-xs font-bold text-slate-505 dark:text-slate-400 hover:text-emerald-500 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                Back to Login
              </button>

              <div>
                <label className="block text-xs font-bold text-slate-655 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="h-4.5 w-4.5 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    id="forgot-email-input"
                    className="block w-full pl-10 pr-3 py-3 border border-slate-205 dark:border-slate-855 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-200 rounded-xl focus:ring-1.5 focus:ring-emerald-500 focus:outline-none"
                    placeholder="name@domain.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                id="forgot-submit-btn"
                className="w-full py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-emerald-500 hover:bg-emerald-600 focus:outline-none transition-colors duration-200 cursor-pointer"
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
