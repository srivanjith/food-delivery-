import Order from '../models/Order.js';
import Wallet from '../models/Wallet.js';
import CoinHistory from '../models/CoinHistory.js';
import AdminSettings from '../models/AdminSettings.js';
import { processOrderDelivery } from '../services/orderFlowService.js';
import { processUPIPayment, verifyRazorpayPayment } from '../services/paymentService.js';

export const createOrder = async (req, res, next) => {
  try {
    const orderData = req.body;
    const orderId = `order-${Date.now()}`;
    
    // Check if redeeming coins
    const coinsRedeemed = Number(orderData.rewardCoinsRedeemed) || 0;
    const customerId = req.user?.id || orderData.customerId || 'user-888';
    const customerEmail = req.user?.email || orderData.customerEmail || 'user@ecoeats.com';
    
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
        userEmail: customerEmail,
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
      customerEmail,
      date: new Date().toISOString()
    };

    // Calculate and credit Eco Coins immediately upon order creation (when they proceed/place the order)
    const coinsEarned = Math.round(finalOrderData.subtotal * (settings.rewardEarnRatio || 0.10));
    if (coinsEarned > 0) {
      let customerWallet = await Wallet.findOne({ holderId: customerId });
      if (!customerWallet) {
        customerWallet = await Wallet.create({
          holderId: customerId,
          holderEmail: customerEmail,
          holderType: 'customer',
          coinBalance: 0,
          totalEarned: 0,
          totalRedeemed: 0
        });
      }
      customerWallet.coinBalance += coinsEarned;
      customerWallet.totalEarned += coinsEarned;
      if (!customerWallet.holderEmail) {
        customerWallet.holderEmail = customerEmail;
      }
      await customerWallet.save();

      // Write CoinHistory log for earned coins
      const earnTxnId = `coin-txn-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      await CoinHistory.create({
        id: earnTxnId,
        userId: customerId,
        userEmail: customerEmail,
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

    let paymentDetails = null;
    // Simulate Payment flow via UPI immediately if amount > 0
    if (order.total > 0) {
      paymentDetails = await processUPIPayment(orderId, customerId, order.total, orderData.upiId || 'eco@payupi');
    } else {
      order.status = 'Preparing';
      await order.save();
    }

    // Broadcast new order to WebSocket pool
    const io = req.app.get('io');
    if (io) {
      console.log(`🔌 [WEBSOCKET] Broadcasting new order placed: ${orderId}`);
      io.emit('orderStatusUpdated', { orderId, status: order.status, order });
    }

    res.status(201).json({ success: true, order, paymentDetails });
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
        query = { restaurantId: rest.get('id') };
      } else {
        // Fallback or empty list
        query = { restaurantId: 'none' };
      }
    } else if (role === 'delivery') {
      query = { deliveryBoyId: userId };
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

    // Broadcast live update to connected clients via WebSockets
    const io = req.app.get('io');
    if (io) {
      console.log(`🔌 [WEBSOCKET] Broadcasting status update for order ${id} -> ${status}`);
      io.to(`order:${id}`).emit('orderStatusUpdated', { orderId: id, status, order });
      
      if (status === 'Ready for Pickup') {
        console.log(`🔌 [WEBSOCKET] Alerting delivery pool: Order ${id} is ready for pickup.`);
        io.to('delivery-pool').emit('newOrderReady', { orderId: id, restaurantName: order.restaurantName, order });
      }
    }

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

export const verifyOrderPayment = async (req, res, next) => {
  const { id } = req.params;
  const { razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;
  try {
    const result = await verifyRazorpayPayment(id, razorpayPaymentId, razorpayOrderId, razorpaySignature);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getPendingDeliveryOrders = async (req, res, next) => {
  try {
    // Delivery couriers can fetch all orders waiting to be claimed (Ready for Pickup)
    const orders = await Order.find({ status: 'Ready for Pickup' }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

export const assignCourierToOrder = async (req, res, next) => {
  const { id } = req.params;
  const deliveryBoyId = req.user.id;
  const deliveryBoyName = req.user.name;
  try {
    const order = await Order.findOne({ id });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.status = 'Out for Delivery';
    order.deliveryBoyId = deliveryBoyId;
    order.deliveryBoyName = deliveryBoyName;
    await order.save();

    // Broadcast update via WebSockets so customer page updates immediately
    const io = req.app.get('io');
    if (io) {
      console.log(`🔌 [WEBSOCKET] Courier claimed order ${id}. Status -> Out for Delivery`);
      io.to(`order:${id}`).emit('orderStatusUpdated', { orderId: id, status: 'Out for Delivery', order });
      
      // Notify delivery-pool that this order is claimed so others close/remove it
      io.to('delivery-pool').emit('orderClaimed', { orderId: id });
    }

    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
};
