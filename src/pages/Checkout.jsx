import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { useNavigate, Link } from 'react-router-dom';
import Modal from '../components/Common/Modal';
import { MapPin, CreditCard, ShieldCheck, ArrowLeft, Plus, Check } from 'lucide-react';

export default function Checkout() {
  const { user, addAddress, addEcoPoints, deductEcoPoints } = useAuth();
  const { cartItems, grandTotal, clearCart, ecoPointsEarned, packagingChoice, deliveryMethod, subtotal, packagingCharge, deliveryCharge, gst, offsetFee, offsetCarbon } = useCart();
  const { addOrder } = useApp();
  const navigate = useNavigate();

  // Address states
  const [selectedAddressId, setSelectedAddressId] = useState(user?.savedAddresses?.[0]?.id || '');
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddressLabel, setNewAddressLabel] = useState('');
  const [newAddressValue, setNewAddressValue] = useState('');

  // Points state
  const [usePointsDiscount, setUsePointsDiscount] = useState(false);

  // Payment states
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' | 'cod' | 'points'
  const [cardHolder, setCardHolder] = useState(user?.name || '');
  const [cardNumber, setCardNumber] = useState('4111 2222 3333 4444');
  const [cardExpiry, setCardExpiry] = useState('12/29');
  const [cardCvv, setCardCvv] = useState('123');

  // Simulated gateway modal state
  const [isProcessing, setIsProcessing] = useState(false);
  const [gatewayMessage, setGatewayMessage] = useState('');
  const [isGatewayOpen, setIsGatewayOpen] = useState(false);

  // Calculations for points discount
  const pointsDiscountAmount = usePointsDiscount ? Math.min(Math.floor((user?.ecoPoints || 0) / 10), grandTotal) : 0;
  const pointsToRedeem = pointsDiscountAmount * 10;
  const finalPaidTotal = grandTotal - pointsDiscountAmount;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center font-sans text-center px-4">
        <h2 className="text-xl font-bold text-slate-805 dark:text-white">Checkout is Unavailable</h2>
        <p className="text-sm text-slate-500 mt-2">Your shopping cart is empty.</p>
        <Link to="/" className="mt-5 px-5 py-3 bg-emerald-500 text-white font-bold rounded-xl shadow">
          Go Order Food
        </Link>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center font-sans text-center px-4">
        <span className="text-5xl">🔐</span>
        <h2 className="text-2xl font-black text-slate-800 dark:text-white mt-4">Authentication Required</h2>
        <p className="text-sm text-slate-500 mt-2 max-w-sm">
          Please sign in to access checkout, manage delivery addresses, and track environmental offset points.
        </p>
        <Link
          to="/auth"
          className="mt-6 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl shadow transition-all cursor-pointer"
        >
          Sign In Now
        </Link>
      </div>
    );
  }

  const handleAddNewAddress = (e) => {
    e.preventDefault();
    if (!newAddressLabel || !newAddressValue) return;
    addAddress(newAddressLabel, newAddressValue);
    setNewAddressLabel('');
    setNewAddressValue('');
    setIsAddingAddress(false);
    
    // Select the new address
    setTimeout(() => {
      if (user.savedAddresses && user.savedAddresses.length > 0) {
        setSelectedAddressId(user.savedAddresses[user.savedAddresses.length - 1].id);
      }
    }, 100);
  };

  const handlePlaceOrder = () => {
    let addressText = '';
    
    // Address validation (skip if self-pickup)
    if (deliveryMethod !== 'pickup') {
      const addressObj = user.savedAddresses.find(addr => addr.id === selectedAddressId);
      if (!addressObj) {
        alert('Please select or add a delivery address!');
        return;
      }
      addressText = addressObj.address;
    } else {
      addressText = 'Self-Pickup at Restaurant';
    }

    // Trigger Razorpay Simulated Gateway
    setIsGatewayOpen(true);
    setIsProcessing(true);
    setGatewayMessage('Initiating secure transaction via Razorpay...');

    setTimeout(() => {
      setGatewayMessage('Verifying credentials and card limits...');
    }, 1200);

    setTimeout(() => {
      setGatewayMessage('Authorizing Carbon-Neutral offset donation...');
    }, 2400);

    setTimeout(() => {
      setGatewayMessage('Payment Approved! Scaffolding order confirmation...');
    }, 3600);

    setTimeout(() => {
      setIsProcessing(false);
      setIsGatewayOpen(false);
      
      // Construct Order Object
      const orderId = `order-${Math.floor(1000 + Math.random() * 9000)}`;
      const newOrder = {
        id: orderId,
        date: new Date().toISOString(),
        restaurantName: cartItems[0].restaurantId === 'rest-4' ? 'Re-Bake Artisan Bakery' : (cartItems[0].restaurantId === 'rest-1' ? 'The Green Beanery' : 'Sustainable Bistro'),
        restaurantId: cartItems[0].restaurantId,
        customerName: user.name,
        customerEmail: user.email,
        items: cartItems.map(item => ({ id: item.id, name: item.name, price: item.price, quantity: item.quantity })),
        subtotal,
        packagingCharge,
        deliveryCharge,
        gst,
        total: finalPaidTotal,
        packagingChoice: packagingChoice === 'reusable' ? 'Reusable Bento Box' : (packagingChoice === 'seaweed' ? 'Seaweed biodegradable' : 'Compostable Paper'),
        deliveryMethod: deliveryMethod === 'bicycle' ? 'Bicycle' : (deliveryMethod === 'ev' ? 'Electric Vehicle' : (deliveryMethod === 'pickup' ? 'Self-Pickup' : 'Solar Drone')),
        status: 'Order Received',
        address: addressText
      };

      // Add to Global Context
      addOrder(newOrder);
      
      // Update User Eco-Points (Add earned points)
      addEcoPoints(ecoPointsEarned);
      
      // Deduct redeemed points
      if (pointsToRedeem > 0) {
        deductEcoPoints(pointsToRedeem);
      }
      
      // Clear Cart
      clearCart();

      // Navigate to tracking screen
      navigate(`/order-tracking/${orderId}`);

    }, 4500);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Back Link */}
        <div className="mb-6">
          <Link
            to="/cart"
            className="inline-flex items-center space-x-1 text-xs font-bold text-slate-500 hover:text-emerald-500 dark:text-slate-400"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Cart</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Forms */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* 1. Address Section */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6">
              <div className="flex justify-between items-center mb-1">
                <h3 className="text-base font-bold text-slate-805 dark:text-white flex items-center">
                  <MapPin className="w-4 h-4 mr-1.5 text-emerald-500" />
                  1. Delivery Address
                </h3>
                
                {!isAddingAddress && (
                  <button
                    onClick={() => setIsAddingAddress(true)}
                    className="inline-flex items-center text-xs font-bold text-emerald-505 hover:text-emerald-600 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 mr-0.5" />
                    Add Address
                  </button>
                )}
              </div>

              {/* Registered Addresses Count Label */}
              <div className="mb-4 text-xs font-medium text-slate-500 dark:text-slate-400">
                {user.savedAddresses && user.savedAddresses.length === 1 ? (
                  <span>Registered Address in App: <span className="font-bold text-slate-800 dark:text-white">1 Address Saved</span></span>
                ) : (
                  <span>Registered Addresses in App: <span className="font-bold text-slate-800 dark:text-white">{user.savedAddresses ? user.savedAddresses.length : 0} Addresses Saved</span></span>
                )}
              </div>

              {/* Add Address Form */}
              {isAddingAddress && (
                <form onSubmit={handleAddNewAddress} className="mb-6 p-4 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="Label (e.g. Home, Cabin)"
                      value={newAddressLabel}
                      onChange={(e) => setNewAddressLabel(e.target.value)}
                      className="px-3 py-2 border border-slate-205 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl text-sm"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Street details, building, zip"
                      value={newAddressValue}
                      onChange={(e) => setNewAddressValue(e.target.value)}
                      className="sm:col-span-2 px-3 py-2 border border-slate-205 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl text-sm"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingAddress(false)}
                      className="px-3 py-1.5 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-500 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4.5 py-1.5 bg-emerald-500 text-white rounded-xl text-xs font-bold cursor-pointer"
                    >
                      Save Address
                    </button>
                  </div>
                </form>
              )}

              {/* Address selector options */}
              {user.savedAddresses && user.savedAddresses.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs">
                  No addresses saved. Please add a delivery address to complete your checkout.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {user.savedAddresses && user.savedAddresses.map((addr) => {
                    const isSelected = selectedAddressId === addr.id;
                    return (
                      <button
                        key={addr.id}
                        onClick={() => setSelectedAddressId(addr.id)}
                        className={`p-4 border rounded-2xl text-left transition-all flex flex-col justify-between items-start cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-50/50 border-emerald-500 dark:bg-emerald-950/20 dark:border-emerald-700'
                            : 'bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-850 border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        <div className="flex justify-between items-center w-full">
                          <span className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">{addr.label}</span>
                          {isSelected && <span className="h-4.5 w-4.5 bg-emerald-500 rounded-full flex items-center justify-center text-white"><Check className="w-3 h-3" /></span>}
                        </div>
                        <span className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                          {addr.address}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 2. Payment Options Section */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6">
              <h3 className="text-base font-bold text-slate-805 dark:text-white flex items-center mb-4">
                <CreditCard className="w-4 h-4 mr-1.5 text-emerald-500" />
                2. Select Payment Method
              </h3>
              
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { id: 'card', label: 'Debit/Credit Card', icon: '💳' },
                  { id: 'cod', label: 'Cash on Delivery', icon: '💵' },
                  { id: 'points', label: 'Eco-Points', icon: '🌱' }
                ].map((pay) => {
                  const isSelected = paymentMethod === pay.id;
                  return (
                    <button
                      key={pay.id}
                      onClick={() => setPaymentMethod(pay.id)}
                      className={`p-3.5 border rounded-2xl text-center font-bold text-xs transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-50/50 border-emerald-500 dark:bg-emerald-950/20 dark:border-emerald-700'
                          : 'bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-850 border-slate-202 dark:border-slate-800'
                      }`}
                    >
                      <span className="text-lg">{pay.icon}</span>
                      <span className="text-slate-700 dark:text-slate-300">{pay.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Payment Details Container */}
              {paymentMethod === 'card' && (
                <div className="space-y-4 p-4 bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 rounded-2xl max-w-md">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-bold mb-2">
                    <span>Razorpay Secure Encrypted</span>
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-505 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-xl text-sm"
                      placeholder="Jane Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-505 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-xl text-sm"
                      placeholder="4111 2222 3333 4444"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-505 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-xl text-sm"
                        placeholder="MM/YY"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-505 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                        CVV Code
                      </label>
                      <input
                        type="password"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-xl text-sm"
                        placeholder="•••"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'cod' && (
                <div className="p-4 bg-amber-500/5 border border-amber-550/20 text-amber-800 dark:text-amber-300 rounded-2xl text-xs leading-relaxed">
                  🚚 <strong>Cash on Delivery (COD)</strong> option adds no payment surcharges. Help us reduce delivery emissions by having exact cash or paying via UPI/QR code on delivery!
                </div>
              )}

              {paymentMethod === 'points' && (
                <div className="p-4 bg-emerald-500/5 border border-emerald-550/20 text-emerald-800 dark:text-emerald-300 rounded-2xl text-xs space-y-2 leading-relaxed">
                  <div>
                    🌱 <strong>Redeem Eco-Points</strong>: You have <strong>{user.ecoPoints} points</strong> available.
                  </div>
                  {user.ecoPoints < 100 ? (
                    <div className="text-red-500 font-bold text-[10px] uppercase">
                      Insufficient Points! You need a minimum of 100 points to pay with green credit.
                    </div>
                  ) : (
                    <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                      Paying with points is eligible! Redemptions rate: 10 points = ₹1.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 3. Eco-Points Redemption Block */}
            {user.ecoPoints > 0 && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 mt-6">
                <h3 className="text-base font-bold text-slate-805 dark:text-white flex items-center mb-4">
                  <span className="mr-1.5 text-emerald-500">🌱</span>
                  3. Redeem Eco-Points for Discount
                </h3>
                <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 text-emerald-800 dark:text-emerald-350 rounded-2xl text-xs space-y-3 leading-relaxed">
                  <div className="flex justify-between items-center">
                    <span>Your Current Balance: <strong>{user.ecoPoints} points</strong></span>
                    <span className="text-[10px] font-bold bg-emerald-500 text-white px-2 py-0.5 rounded">10 pts = ₹1</span>
                  </div>
                  
                  <label className="flex items-start cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={usePointsDiscount}
                      onChange={(e) => setUsePointsDiscount(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-slate-300 text-emerald-500 focus:ring-emerald-500 cursor-pointer"
                    />
                    <div className="ml-3">
                      <span className="block font-bold text-slate-850 dark:text-slate-100">
                        Redeem points to reduce order total (-₹{Math.min(Math.floor(user.ecoPoints / 10), grandTotal)})
                      </span>
                      <span className="block text-[10px] text-slate-400 mt-0.5">
                        Uses up to {Math.min(user.ecoPoints, grandTotal * 10)} points.
                      </span>
                    </div>
                  </label>
                  
                  {usePointsDiscount && (
                    <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-450 uppercase tracking-wide">
                      Redeeming {pointsToRedeem} points for ₹{pointsDiscountAmount} off!
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Checkout Review panel */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6">
              <h3 className="text-sm font-black text-slate-850 dark:text-white uppercase tracking-wider mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                Order Review
              </h3>

              {/* Items lists */}
              <div className="space-y-3 mb-6 max-h-[220px] overflow-y-auto pr-1">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-xs text-slate-655 dark:text-slate-350">
                    <span className="truncate pr-3 font-semibold">
                      {item.name} <span className="text-slate-400 font-bold">x{item.quantity}</span>
                    </span>
                    <span className="font-extrabold text-slate-800 dark:text-slate-200">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Detailed Invoice Breakdown */}
              <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-4 mb-6 text-xs text-slate-655 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-850 dark:text-slate-200">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Packaging ({packagingChoice})</span>
                  <span className="font-semibold text-slate-850 dark:text-slate-200">₹{packagingCharge}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Mode ({deliveryMethod === 'pickup' ? 'Self-Pickup' : deliveryMethod})</span>
                  <span className="font-semibold text-slate-850 dark:text-slate-200">₹{deliveryCharge}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (5%)</span>
                  <span className="font-semibold text-slate-850 dark:text-slate-200">₹{gst}</span>
                </div>
                {offsetCarbon && (
                  <div className="flex justify-between">
                    <span>Reforestation Donation</span>
                    <span className="font-semibold text-slate-850 dark:text-slate-200">₹{offsetFee}</span>
                  </div>
                )}
                {usePointsDiscount && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-450 font-extrabold">
                    <span>Eco-Points Discount</span>
                    <span>-₹{pointsDiscountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-slate-100 dark:border-slate-800 pt-2 font-extrabold text-sm text-slate-850 dark:text-white">
                  <span>Grand Total</span>
                  <span>₹{finalPaidTotal}</span>
                </div>
              </div>

              {/* Eco Points summary */}
              <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 p-4 rounded-2xl mb-6 text-xs text-emerald-800 dark:text-emerald-300 leading-normal flex items-start">
                <span className="text-base mr-2">🌱</span>
                <div>
                  <strong>Rewards Earned: +{ecoPointsEarned} Eco Points!</strong>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5 leading-snug">
                    These points will be added to your profile immediately after order completion.
                  </p>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                id="place-order-submit-btn"
                className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-sm rounded-2xl shadow-lg transition-all cursor-pointer"
              >
                Place Order (₹{finalPaidTotal})
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* RAZORPAY GATEWAY SIMULATION INTERACTIVE DIALOG MODAL */}
      <Modal
        isOpen={isGatewayOpen}
        onClose={() => { if (!isProcessing) setIsGatewayOpen(false); }}
        title="Razorpay Secure Payment Portal"
      >
        <div className="flex flex-col items-center py-6 text-center space-y-5">
          {/* Spinner anim */}
          {isProcessing ? (
            <div className="relative flex items-center justify-center">
              <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-emerald-500" />
              <span className="absolute text-sm">🔒</span>
            </div>
          ) : (
            <div className="h-14 w-14 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-500">
              <Check className="w-8 h-8" />
            </div>
          )}

          <h4 className="text-base font-bold text-slate-800 dark:text-white">
            {isProcessing ? 'Processing Transaction...' : 'Payment Successful!'}
          </h4>

          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
            {gatewayMessage}
          </p>

          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider pt-4 border-t border-slate-100 dark:border-slate-850 w-full">
            EcoEats Merchant ID: MC-902230
          </div>
        </div>
      </Modal>

    </div>
  );
}
