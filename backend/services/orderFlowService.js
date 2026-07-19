import Order from '../../db/models/Order.js';
import Restaurant from '../../db/models/Restaurant.js';
import Wallet from '../../db/models/Wallet.js';
import CoinHistory from '../../db/models/CoinHistory.js';
import PlatformRevenue from '../../db/models/PlatformRevenue.js';
import AdminSettings from '../../db/models/AdminSettings.js';
import { sendPushNotification } from './notificationService.js';
import { sendFeedbackEmail } from './emailService.js';

export const processOrderDelivery = async (orderId) => {
  console.log(`[ORDER FLOW SERVICE] Starting delivery processing for order: ${orderId}`);
  
  // 1. Fetch Order and check if already processed
  const order = await Order.findOne({ id: orderId });
  if (!order) {
    throw new Error(`Order ${orderId} not found`);
  }
  
  if (order.coinsProcessed) {
    console.log(`⚠️ [ORDER FLOW SERVICE] Order ${orderId} loyalty rewards and commission are already processed.`);
    return order;
  }

  // 2. Load system configurations
  let settings = await AdminSettings.findOne();
  if (!settings) {
    settings = await AdminSettings.create({
      commissionRate: 0.15,
      platformFee: 15,
      deliveryFeeRate: 30,
      rewardEarnRatio: 0.10,
      coinConversionRate: 100,
      maxCoinRedemptionLimit: 50
    });
  }

  // 3. Atomically check-and-set processed flag to avoid duplicate transactions
  const updatedOrder = await Order.findOneAndUpdate(
    { id: orderId, coinsProcessed: false },
    { $set: { coinsProcessed: true } },
    { new: true }
  );

  if (!updatedOrder) {
    console.log(`⚠️ [ORDER FLOW SERVICE] Concurrency flag caught: Order ${orderId} already processed.`);
    return order;
  }

  // 4. Loyalty Reward Coins (Already credited immediately on placement/proceed)
  const coinsEarned = order.rewardCoinsEarned || Math.round(order.subtotal * settings.rewardEarnRatio);
  const customerId = order.customerId || 'user-888';

  // 5. Calculate Revenue & Commissions
  const restaurantId = order.restaurantId;
  const restaurant = await Restaurant.findOne({ id: restaurantId });
  const commRate = restaurant?.commissionRate ?? settings.commissionRate;

  const commissionEarned = Math.round(order.subtotal * commRate);
  const platformFeeEarned = settings.platformFee;
  const deliveryChargeEarned = order.deliveryCharge || 0;
  
  // Coins value cost (100 coins = 1 INR)
  const coinsValueCost = coinsEarned / settings.coinConversionRate;
  
  // Net revenue to platform
  const netRevenue = (commissionEarned + platformFeeEarned) - coinsValueCost;

  // Create Platform Revenue record
  const revenueRecordId = `rev-rec-${Date.now()}`;
  await PlatformRevenue.create({
    id: revenueRecordId,
    orderId: order.id,
    restaurantId,
    orderTotal: order.total,
    commissionEarned,
    platformFeeEarned,
    deliveryChargeEarned,
    coinsValueCost,
    netRevenue
  });

  // 6. Calculate Restaurant Settlement
  // Net settlement payout = (Subtotal + packaging + GST) - Commission
  const settlementPayout = (order.subtotal + (order.packagingCharge || 0) + (order.gst || 0)) - commissionEarned;

  // Add payout cash balance to restaurant wallet
  let restWallet = await Wallet.findOne({ holderId: restaurantId });
  if (!restWallet) {
    restWallet = await Wallet.create({
      holderId: restaurantId,
      holderType: 'restaurant',
      fiatBalance: 0
    });
  }
  restWallet.fiatBalance += settlementPayout;
  await restWallet.save();

  // 7. Update order details
  updatedOrder.rewardCoinsEarned = coinsEarned;
  await updatedOrder.save();

  // 8. Send simulated push notification
  await sendPushNotification(
    customerId,
    'Eco-Rewards Credited! 🎉',
    `You earned ${coinsEarned} Eco Coins from your order at ${order.restaurantName}!`,
    'wallet'
  );

  // 9. Send simulated / real email
  await sendFeedbackEmail(updatedOrder);

  console.log(`✅ [ORDER FLOW SERVICE] Order ${orderId} delivery calculations complete.`);
  console.log(`   - Coins credited: ${coinsEarned}`);
  console.log(`   - Settlement credited: ₹${settlementPayout} (Commission deducted: ₹${commissionEarned})`);
  console.log(`   - Net Platform Revenue: ₹${netRevenue}`);

  return updatedOrder;
};
