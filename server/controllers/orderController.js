import Order from '../models/Order.js';
import Wallet from '../models/Wallet.js';
import CoinHistory from '../models/CoinHistory.js';
import AdminSettings from '../models/AdminSettings.js';
import { processOrderDelivery } from '../services/orderFlowService.js';
import { processUPIPayment } from '../services/paymentService.js';

export const createOrder = async (req, res, next) => {
  try {
    const orderData = req.body;
    const orderId = `order-${Date.now()}`;
    
    // Check if redeeming coins
    const coinsRedeemed = Number(orderData.rewardCoinsRedeemed) || 0;
    const customerId = req.user?.id || orderData.customerId || 'user-888';
    
    let settings = await AdminSettings.findOne();
    if (!settings) {
      settings = await AdminSettings.create({});
    }

    if (coinsRedeemed > 0) {
      const wallet = await Wallet.findOne({ holderId: customerId });
      if (!wallet || wallet.coinBalance < coinsRedeemed) {
        return res.status(400).json({ success: false, message: 'Insufficient coin balance for redemption' });
      }

      // Check conversion and limits
      const coinValue = coinsRedeemed / settings.coinConversionRate;
      if (coinValue > settings.maxCoinRedemptionLimit) {
        return res.status(400).json({ 
          success: false, 
          message: `Cannot redeem more than ₹${settings.maxCoinRedemptionLimit} in coins per order` 
        });
      }

      // Deduct coins atomically from user's Wallet
      wallet.coinBalance -= coinsRedeemed;
      await wallet.save();

      // Update User ecoPoints for frontend compatibility
      await import('../models/User.js').then(async (m) => {
        const User = m.default;
        await User.findOneAndUpdate(
          { id: customerId },
          { $inc: { ecoPoints: -coinsRedeemed } }
        );
      });

      // Write CoinHistory log for redemption
      const coinTxnId = `coin-txn-${Date.now()}`;
      await CoinHistory.create({
        id: coinTxnId,
        userId: customerId,
        orderId,
        type: 'redeemed',
        amount: coinsRedeemed,
        description: `Redeemed ${coinsRedeemed} coins on checkout for order ${orderId}`
      });

      orderData.rewardValueRedeemed = coinValue;
    }

    // Set order metadata
    const finalOrderData = {
      ...orderData,
      id: orderId,
      customerId,
      customerName: req.user?.name || orderData.customerName || 'Eco-Citizen',
      customerEmail: req.user?.email || orderData.customerEmail || 'user@ecoeats.com',
      date: new Date().toISOString()
    };

    // Calculate and credit Eco Coins immediately upon order creation (when they proceed/place the order)
    const coinsEarned = Math.round(finalOrderData.subtotal * (settings.rewardEarnRatio || 0.10));
    if (coinsEarned > 0) {
      let customerWallet = await Wallet.findOne({ holderId: customerId });
      if (!customerWallet) {
        customerWallet = await Wallet.create({
          holderId: customerId,
          holderType: 'customer',
          coinBalance: 0,
          totalEarned: 0,
          totalRedeemed: 0
        });
      }
      customerWallet.coinBalance += coinsEarned;
      customerWallet.totalEarned += coinsEarned;
      await customerWallet.save();

      // Write CoinHistory log for earned coins
      const earnTxnId = `coin-txn-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      await CoinHistory.create({
        id: earnTxnId,
        userId: customerId,
        orderId,
        type: 'earned',
        amount: coinsEarned,
        description: `Earned ${coinsEarned} coins for placing order ${orderId}`
      });

      // Update User ecoPoints for frontend compatibility
      await import('../models/User.js').then(async (m) => {
        const User = m.default;
        await User.findOneAndUpdate(
          { id: customerId },
          { $inc: { ecoPoints: coinsEarned } }
        );
      });
      
      finalOrderData.rewardCoinsEarned = coinsEarned;
      finalOrderData.coinsProcessed = true;
    }

    const order = new Order(finalOrderData);
    await order.save();

    // Simulate Payment flow via UPI immediately if amount > 0
    if (order.total > 0) {
      await processUPIPayment(orderId, customerId, order.total, orderData.upiId || 'eco@payupi');
    } else {
      order.status = 'Preparing';
      await order.save();
    }

    res.status(201).json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

export const getOrders = async (req, res, next) => {
  try {
    const role = req.user?.role || 'customer';
    const userId = req.user?.id || 'user-888';

    let query = {};
    if (role === 'customer') {
      query = { customerId: userId };
    } else if (role === 'restaurant') {
      // Find restaurant owned by this user
      const Restaurant = (await import('../models/Restaurant.js')).default;
      const rest = await Restaurant.findOne({ ownerId: userId });
      if (rest) {
        query = { restaurantId: rest.id };
      } else {
        // Fallback or empty list
        query = { restaurantId: 'none' };
      }
    }

    const orders = await Order.find(query).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const order = await Order.findOne({ id });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.status = status;
    await order.save();

    let emailSent = false;
    let recipient = order.customerEmail || 'user@ecoeats.com';

    // If order becomes delivered, trigger commission calculation, settlements, and coin reward systems
    if (status === 'Delivered') {
      const processedOrder = await processOrderDelivery(id);
      emailSent = true; // Handled internally
    }

    res.json({
      success: true,
      order,
      emailSent,
      recipient
    });
  } catch (error) {
    next(error);
  }
};
