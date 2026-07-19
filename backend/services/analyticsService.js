import Order from '../../db/models/Order.js';
import PlatformRevenue from '../../db/models/PlatformRevenue.js';
import CoinHistory from '../../db/models/CoinHistory.js';
import Wallet from '../../db/models/Wallet.js';
import User from '../../db/models/User.js';
import Restaurant from '../../db/models/Restaurant.js';
import RestaurantSettlement from '../../db/models/RestaurantSettlement.js';

export const getAdminMetrics = async () => {
  try {
    const totalOrdersCount = await Order.countDocuments({});
    
    // Revenue stats
    const revenues = await PlatformRevenue.find({});
    const totalGrossSales = revenues.reduce((sum, r) => sum + r.orderTotal, 0);
    const totalCommissions = revenues.reduce((sum, r) => sum + r.commissionEarned, 0);
    const totalPlatformFees = revenues.reduce((sum, r) => sum + r.platformFeeEarned, 0);
    const totalCoinCosts = revenues.reduce((sum, r) => sum + r.coinsValueCost, 0);
    const totalNetRevenue = revenues.reduce((sum, r) => sum + r.netRevenue, 0);

    // Coins stats
    const coinsCredited = await CoinHistory.aggregate([
      { $match: { type: 'earned' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const coinsRedeemed = await CoinHistory.aggregate([
      { $match: { type: 'redeemed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    const coinsCreditedSum = coinsCredited[0]?.total || 0;
    const coinsRedeemedSum = coinsRedeemed[0]?.total || 0;

    // Settlement stats
    const settlements = await RestaurantSettlement.find({});
    const settlementsPaid = settlements.filter(s => s.status === 'Paid').reduce((sum, s) => sum + s.amount, 0);
    const settlementsPending = settlements.filter(s => s.status === 'Pending' || s.status === 'Approved').reduce((sum, s) => sum + s.amount, 0);

    // Active counts
    const activeCustomers = await User.countDocuments({ role: 'customer' });
    const activeRestaurants = await Restaurant.countDocuments({ active: true });

    return {
      revenue: {
        grossSales: totalGrossSales,
        commissions: totalCommissions,
        platformFees: totalPlatformFees,
        coinCosts: totalCoinCosts,
        netRevenue: totalNetRevenue
      },
      coins: {
        totalCredited: coinsCreditedSum,
        totalRedeemed: coinsRedeemedSum
      },
      settlements: {
        paid: settlementsPaid,
        pending: settlementsPending
      },
      counts: {
        orders: totalOrdersCount,
        customers: activeCustomers,
        restaurants: activeRestaurants
      }
    };
  } catch (error) {
    console.error('🚨 [ANALYTICS SERVICE] Failed compiling dashboard metrics:', error.message);
    throw error;
  }
};

export const getRestaurantMetrics = async (restaurantId) => {
  try {
    const orders = await Order.find({ restaurantId });
    const totalOrdersCount = orders.length;
    const totalSales = orders.reduce((sum, o) => sum + o.total, 0);
    
    const wallet = await Wallet.findOne({ holderId: restaurantId, holderType: 'restaurant' });
    const outstandingBalance = wallet?.fiatBalance || 0;
    
    const completedOrders = orders.filter(o => o.status === 'Delivered');
    const avgOrderValue = completedOrders.length ? (completedOrders.reduce((sum, o) => sum + o.total, 0) / completedOrders.length) : 0;

    return {
      totalOrders: totalOrdersCount,
      totalSales,
      outstandingBalance,
      avgOrderValue
    };
  } catch (error) {
    console.error(`🚨 [ANALYTICS SERVICE] Failed compiling restaurant metrics for ${restaurantId}:`, error.message);
    throw error;
  }
};
