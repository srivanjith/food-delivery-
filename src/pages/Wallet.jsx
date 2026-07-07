import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Coins, Award, ArrowUpRight, ArrowDownRight, RefreshCw, Info, Calendar } from 'lucide-react';

export default function Wallet() {
  const { user } = useAuth();
  
  const [wallet, setWallet] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Conversion state hooks
  const [coinsToConvert, setCoinsToConvert] = useState('');
  const [convertSuccess, setConvertSuccess] = useState('');
  const [convertError, setConvertError] = useState('');
  const [converting, setConverting] = useState(false);

  const fetchWalletData = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      } else if (user?.id) {
        headers['x-user-id'] = user.id;
      }

      const walletRes = await fetch('http://localhost:5000/api/rewards/wallet', { headers });
      const walletJson = await walletRes.json();
      
      const historyRes = await fetch('http://localhost:5000/api/rewards/wallet/history', { headers });
      const historyJson = await historyRes.json();

      if (walletJson.success) {
        setWallet(walletJson.wallet);
      } else {
        setError(walletJson.message || 'Failed to fetch wallet info');
      }

      if (historyJson.success) {
        setHistory(historyJson.history);
      }
    } catch (err) {
      setError('Network error: Failed to connect to wallet servers.');
    } finally {
      setLoading(false);
    }
  };

  const handleConvertCoins = async (e) => {
    e.preventDefault();
    setConvertSuccess('');
    setConvertError('');
    const amt = parseInt(coinsToConvert);
    if (!amt || amt <= 0) return;

    if (amt < 100) {
      setConvertError('Minimum conversion amount is 100 coins (₹1).');
      return;
    }
    if (amt > (wallet?.coinBalance || 0)) {
      setConvertError('You do not have enough coins in your balance.');
      return;
    }

    setConverting(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      } else if (user?.id) {
        headers['x-user-id'] = user.id;
      }

      const res = await fetch('http://localhost:5000/api/rewards/wallet/convert', {
        method: 'POST',
        headers,
        body: JSON.stringify({ coinsToConvert: amt })
      });
      const json = await res.json();
      if (json.success) {
        setConvertSuccess(json.message);
        setCoinsToConvert('');
        // Refresh wallet data to update balance
        fetchWalletData();
      } else {
        setConvertError(json.message || 'Conversion failed.');
      }
    } catch (err) {
      setConvertError('Network error. Please try again.');
    } finally {
      setConverting(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchWalletData();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center font-sans text-center px-4">
        <span className="text-5xl">🔐</span>
        <h2 className="text-2xl font-black text-slate-800 dark:text-white mt-4">Access Denied</h2>
        <p className="text-sm text-slate-500 mt-2 max-w-sm">
          Please login to view your personal wallet balance, earn rules, and loyalty transactions.
        </p>
        <Link
          to="/auth"
          className="mt-6 px-6 py-3 bg-emerald-500 text-white font-bold rounded-2xl shadow transition-all"
        >
          Sign In Now
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2">
              <Coins className="w-7 h-7 text-emerald-500 animate-pulse-slow" /> Reward Wallet
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Earn Eco-Coins on clean food purchases and redeem them as cash at checkout.
            </p>
          </div>
          <button 
            onClick={fetchWalletData}
            disabled={loading}
            className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-850 cursor-pointer disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 text-slate-655 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-950/30 border border-red-500/25 rounded-2xl text-xs font-semibold text-red-400">
            {error}
          </div>
        )}

        {loading && !wallet ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-emerald-500" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Wallet Stats card & active rules */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Primary Balance Card */}
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
                <div className="absolute right-0 top-0 w-36 h-36 bg-white/10 rounded-full filter blur-2xl pointer-events-none" />
                <span className="text-[10px] bg-white/20 px-3 py-1 rounded-full uppercase font-bold tracking-wider">
                  Eco Coins Balance
                </span>
                
                <h2 className="text-4xl font-black mt-4 flex items-baseline gap-2">
                  <span>{wallet?.coinBalance || 0}</span>
                  <span className="text-xs font-medium text-emerald-100">Coins</span>
                </h2>
                
                <div className="mt-2 text-xs text-emerald-100 flex items-center gap-1 font-semibold">
                  <span>Valued at:</span>
                  <span className="text-amber-300 font-extrabold text-sm">₹{wallet?.moneyValue || '0.00'}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/10 text-center text-xs">
                  <div className="border-r border-white/10 pr-2">
                    <span className="block text-[10px] text-emerald-150 font-bold uppercase tracking-wider">Lifetime Earned</span>
                    <span className="block font-black text-sm text-white mt-1">🌱 {wallet?.totalEarned || 0}</span>
                  </div>
                  <div className="pl-2">
                    <span className="block text-[10px] text-emerald-150 font-bold uppercase tracking-wider">Lifetime Spent</span>
                    <span className="block font-black text-sm text-white mt-1">🛒 {wallet?.totalRedeemed || 0}</span>
                  </div>
                </div>
              </div>

              {/* Manual Coin Conversion Panel */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4">
                <div>
                  <h3 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-widest flex items-center gap-1.5">
                    💱 Convert Coins to Money
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Convert your coins to wallet cash balance. Conversion rate: 100 Coins = ₹1.
                  </p>
                </div>

                {convertSuccess && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl text-[10px] font-bold">
                    ✅ {convertSuccess}
                  </div>
                )}
                
                {convertError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-650 dark:text-red-400 rounded-xl text-[10px] font-bold">
                    ⚠️ {convertError}
                  </div>
                )}

                <form onSubmit={handleConvertCoins} className="space-y-3">
                  <div>
                    <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">
                      Coins to Convert
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 500"
                      value={coinsToConvert}
                      onChange={e => setCoinsToConvert(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-slate-55/30 dark:bg-slate-950 text-slate-800 dark:text-white rounded-xl text-xs"
                      required
                    />
                  </div>

                  {coinsToConvert && parseInt(coinsToConvert) > 0 && (
                    <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                      You will receive: ₹{(parseInt(coinsToConvert) / 100).toFixed(2)} cash credit
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={converting}
                    className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer"
                  >
                    {converting ? 'Converting...' : 'Convert Coins'}
                  </button>
                </form>

                {/* Display Current Wallet cash balance */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
                  <span className="text-slate-500">Wallet Cash Balance:</span>
                  <span className="font-extrabold text-slate-800 dark:text-white">₹{wallet?.fiatBalance || '0.00'}</span>
                </div>
              </div>

              {/* Active Reward Rules Info */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4">
                <h3 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-widest flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-emerald-500" /> Active Loyalty Rules
                </h3>
                
                <div className="space-y-3.5 text-xs text-slate-655 dark:text-slate-400">
                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 bg-emerald-50 dark:bg-emerald-950/45 rounded-lg flex items-center justify-center shrink-0 font-bold text-emerald-600">1</div>
                    <p className="leading-relaxed">
                      Earn **20 Coins** for every **₹100 spent** on food orders. Subtotal spent is calculated after discounts.
                    </p>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 bg-emerald-50 dark:bg-emerald-950/45 rounded-lg flex items-center justify-center shrink-0 font-bold text-emerald-600">2</div>
                    <p className="leading-relaxed">
                      Coin Conversion Value: **100 Coins = ₹1**. Coins can be directly redeemed on future orders at checkout.
                    </p>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 bg-emerald-50 dark:bg-emerald-950/45 rounded-lg flex items-center justify-center shrink-0 font-bold text-emerald-600">3</div>
                    <p className="leading-relaxed">
                      Redemption requires a minimum order amount of **₹200** and maximum coin payment value caps at **50%** of food total.
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Transaction Logs */}
            <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-3xl p-6">
              <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider mb-6 flex items-center gap-1.5">
                <Award className="w-4.5 h-4.5 text-emerald-500" /> Coins Transaction History
              </h3>

              {history.length === 0 ? (
                <div className="text-center py-14 text-slate-400 text-xs">
                  No reward transactions logged yet. Place orders to start earning coins!
                </div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800/60 font-semibold text-slate-700 dark:text-slate-350">
                  {history.map((tx) => (
                    <div key={tx.id} className="py-4 flex justify-between items-center gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-850/10 px-2 rounded-xl transition-all">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                          tx.type === 'earned'
                            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400'
                            : 'bg-red-50 text-red-650 dark:bg-red-950/40 dark:text-red-400'
                        }`}>
                          {tx.type === 'earned' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                        </div>
                        <div>
                          <span className="block text-slate-800 dark:text-white text-xs font-bold">{tx.description}</span>
                          <span className="block text-[10px] text-slate-400 font-normal flex items-center gap-1 mt-0.5">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(tx.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>

                      <div className={`text-sm font-black shrink-0 text-right ${
                        tx.type === 'earned' ? 'text-emerald-555 dark:text-emerald-400' : 'text-red-500'
                      }`}>
                        {tx.type === 'earned' ? '+' : '-'}{tx.amount}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
