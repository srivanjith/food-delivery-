import Wallet from '../../db/models/Wallet.js';
import CoinHistory from '../../db/models/CoinHistory.js';
import AdminSettings from '../../db/models/AdminSettings.js';
import Notification from '../../db/models/Notification.js';

// GET /wallet
export const getWalletData = async (req, res, next) => {
  const userId = req.user?.id || 'user-888';
  try {
    let settings = await AdminSettings.findOne();
    if (!settings) {
      settings = await AdminSettings.create({});
    }

    let wallet = await Wallet.findOne({ holderId: userId });
    if (!wallet) {
      wallet = await Wallet.create({
        holderId: userId,
        holderType: req.user?.role === 'restaurant' ? 'restaurant' : 'customer',
        coinBalance: 0,
        totalEarned: 0,
        totalRedeemed: 0,
        fiatBalance: 0
      });
    }

    const conversionRate = settings.coinConversionRate || 100;
    const moneyValue = parseFloat((wallet.coinBalance / conversionRate).toFixed(2));

    res.json({
      success: true,
      wallet: {
        coinBalance: wallet.coinBalance,
        totalEarned: wallet.totalEarned,
        totalRedeemed: wallet.totalRedeemed,
        fiatBalance: wallet.fiatBalance,
        moneyValue,
        holderId: wallet.holderId,
        holderType: wallet.holderType,
        updatedAt: wallet.updatedAt
      },
      settings: {
        coinsPer100: settings.coinsPer100,
        coinConversionRate: settings.coinConversionRate,
        minOrderAmount: settings.minOrderAmount,
        maxRedemptionPercentage: settings.maxRedemptionPercentage,
        rewardSystemEnabled: settings.rewardSystemEnabled
      }
    });
  } catch (error) {
    next(error);
  }
};

// GET /wallet/history
export const getCoinHistory = async (req, res, next) => {
  const userId = req.user?.id || 'user-888';
  try {
    const history = await CoinHistory.find({ userId }).sort({ createdAt: -1 });
    res.json({
      success: true,
      history
    });
  } catch (error) {
    next(error);
  }
};

// POST /wallet/redeem
export const redeemCoins = async (req, res, next) => {
  const userId = req.user?.id || 'user-888';
  const { coinsToRedeem, orderSubtotal } = req.body;

  try {
    if (!coinsToRedeem || coinsToRedeem <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid coins redemption amount requested' });
    }

    let settings = await AdminSettings.findOne();
    if (!settings) {
      settings = await AdminSettings.create({});
    }

    if (!settings.rewardSystemEnabled) {
      return res.status(400).json({ success: false, message: 'Reward coin system is currently disabled by administrator' });
    }

    // 1. Minimum Order Amount Check
    if (orderSubtotal < settings.minOrderAmount) {
      return res.status(400).json({ 
        success: false, 
        message: `Minimum order amount of ₹${settings.minOrderAmount} is required to redeem reward coins` 
      });
    }

    let wallet = await Wallet.findOne({ holderId: userId });
    if (!wallet || wallet.coinBalance < coinsToRedeem) {
      return res.status(400).json({ success: false, message: 'Insufficient coin balance in your wallet' });
    }

    // 2. Maximum Redemption Percentage Check
    const discountAmount = coinsToRedeem / settings.coinConversionRate;
    const maxDiscountAllowed = (orderSubtotal * settings.maxRedemptionPercentage) / 100;
    if (discountAmount > maxDiscountAllowed) {
      const maxCoinsAllowed = Math.floor(maxDiscountAllowed * settings.coinConversionRate);
      return res.status(400).json({ 
        success: false, 
        message: `You can only redeem up to ${settings.maxRedemptionPercentage}% of food amount (Max ${maxCoinsAllowed} Coins for this order)` 
      });
    }

    // Process deduction
    wallet.coinBalance -= coinsToRedeem;
    wallet.totalRedeemed += coinsToRedeem;
    await wallet.save();

    // Create CoinHistory log linked to registered email
    const userEmail = req.user?.email || 'user@ecoeats.com';
    const txId = 'tx-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    await CoinHistory.create({
      id: txId,
      userId,
      userEmail,
      type: 'redeemed',
      amount: coinsToRedeem,
      description: `Redeemed coins for ₹${discountAmount.toFixed(2)} discount on food purchase`
    });

    res.json({
      success: true,
      discountApplied: discountAmount,
      remainingCoins: wallet.coinBalance,
      wallet: {
        coinBalance: wallet.coinBalance,
        totalEarned: wallet.totalEarned,
        totalRedeemed: wallet.totalRedeemed,
        moneyValue: parseFloat((wallet.coinBalance / settings.coinConversionRate).toFixed(2))
      }
    });
  } catch (error) {
    next(error);
  }
};

// POST /wallet/earn
export const earnCoins = async (req, res, next) => {
  const { orderId, foodAmount, customerId } = req.body;
  const targetUser = customerId || req.user?.id || 'user-888';

  try {
    if (!orderId || !foodAmount) {
      return res.status(400).json({ success: false, message: 'OrderId and foodAmount are required fields' });
    }

    // Prevent duplicate credits
    const existingEarnLog = await CoinHistory.findOne({ orderId, type: 'earned' });
    if (existingEarnLog) {
      return res.status(400).json({ success: false, message: 'Reward coins already credited for this order' });
    }

    let settings = await AdminSettings.findOne();
    if (!settings) {
      settings = await AdminSettings.create({});
    }

    if (!settings.rewardSystemEnabled) {
      return res.json({ success: true, message: 'Coins earning skipped because system is disabled', coinsEarned: 0 });
    }

    // Calculate coins based on spend configuration
    const coinsToEarn = Math.floor(foodAmount / 100) * settings.coinsPer100;

    // Get target user's registered email
    const User = (await import('../../db/models/User.js')).default;
    const targetUserDoc = await User.findOne({ id: targetUser });
    const userEmail = targetUserDoc?.email || req.user?.email || 'user@ecoeats.com';

    let wallet = await Wallet.findOne({ holderId: targetUser });
    if (!wallet) {
      wallet = await Wallet.create({
        holderId: targetUser,
        holderEmail: userEmail,
        holderType: 'customer',
        coinBalance: 0,
        totalEarned: 0,
        totalRedeemed: 0,
        fiatBalance: 0
      });
    } else if (!wallet.holderEmail) {
      wallet.holderEmail = userEmail;
      await wallet.save();
    }

    if (coinsToEarn > 0) {
      wallet.coinBalance += coinsToEarn;
      wallet.totalEarned += coinsToEarn;
      await wallet.save();

      // Save History log linked to registered email
      const txId = 'tx-' + Math.random().toString(36).substr(2, 9).toUpperCase();
      await CoinHistory.create({
        id: txId,
        userId: targetUser,
        userEmail,
        orderId,
        type: 'earned',
        amount: coinsToEarn,
        description: `Earned rewards for delivered order ID: ${orderId}`
      });

      // Send client notification
      await Notification.create({
        id: 'notif-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        userId: targetUser,
        title: '🌱 EcoEats Coins Credited!',
        message: `You earned ${coinsToEarn} loyalty coins (worth ₹${(coinsToEarn / settings.coinConversionRate).toFixed(2)}) for order ${orderId}!`,
        type: 'wallet'
      });
    }

    res.json({
      success: true,
      coinsEarned: coinsToEarn,
      wallet: {
        coinBalance: wallet.coinBalance,
        totalEarned: wallet.totalEarned,
        totalRedeemed: wallet.totalRedeemed
      }
    });
  } catch (error) {
    next(error);
  }
};

// GET /reward/settings
export const getRewardSettings = async (req, res, next) => {
  try {
    let settings = await AdminSettings.findOne();
    if (!settings) {
      settings = await AdminSettings.create({});
    }
    res.json({
      success: true,
      settings
    });
  } catch (error) {
    next(error);
  }
};

// PUT /reward/settings (Admin authorization handled by middleware)
export const updateRewardSettings = async (req, res, next) => {
  const { 
    coinsPer100, 
    coinConversionRate, 
    minOrderAmount, 
    maxRedemptionPercentage, 
    coinExpiryPeriod, 
    rewardSystemEnabled 
  } = req.body;

  try {
    let settings = await AdminSettings.findOne();
    if (!settings) {
      settings = new AdminSettings();
    }

    if (coinsPer100 !== undefined) settings.coinsPer100 = parseInt(coinsPer100);
    if (coinConversionRate !== undefined) settings.coinConversionRate = parseInt(coinConversionRate);
    if (minOrderAmount !== undefined) settings.minOrderAmount = parseFloat(minOrderAmount);
    if (maxRedemptionPercentage !== undefined) settings.maxRedemptionPercentage = parseFloat(maxRedemptionPercentage);
    if (coinExpiryPeriod !== undefined) settings.coinExpiryPeriod = parseInt(coinExpiryPeriod);
    if (rewardSystemEnabled !== undefined) settings.rewardSystemEnabled = !!rewardSystemEnabled;

    await settings.save();

    res.json({
      success: true,
      message: 'Reward settings updated successfully!',
      settings
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/rewards/stats
export const getRewardStats = async (req, res, next) => {
  try {
    // 1. Total issued (sum of all 'earned' transactions)
    const totalIssuedResult = await CoinHistory.aggregate([
      { $match: { type: 'earned' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalCoinsIssued = totalIssuedResult[0]?.total || 0;

    // 2. Total redeemed (sum of all 'redeemed' transactions)
    const totalRedeemedResult = await CoinHistory.aggregate([
      { $match: { type: 'redeemed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalCoinsRedeemed = totalRedeemedResult[0]?.total || 0;

    // 3. Top users by coin balance
    const topUsersWallets = await Wallet.find({ holderType: 'customer' })
      .sort({ coinBalance: -1 })
      .limit(10);

    // 4. Detailed Transaction reports
    const transactions = await CoinHistory.find()
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      stats: {
        totalCoinsIssued,
        totalCoinsRedeemed,
        activeCirculation: totalCoinsIssued - totalCoinsRedeemed,
        topUsersWallets,
        transactions
      }
    });
  } catch (error) {
    next(error);
  }
};

// POST /wallet/convert
export const convertCoinsToMoney = async (req, res, next) => {
  const userId = req.user?.id || 'user-888';
  const { coinsToConvert } = req.body;

  try {
    if (!coinsToConvert || coinsToConvert <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid coins amount to convert' });
    }

    let settings = await AdminSettings.findOne();
    if (!settings) {
      settings = await AdminSettings.create({});
    }

    const conversionRate = settings.coinConversionRate || 100;
    
    let wallet = await Wallet.findOne({ holderId: userId });
    if (!wallet || wallet.coinBalance < coinsToConvert) {
      return res.status(400).json({ success: false, message: 'Insufficient coin balance in your wallet' });
    }

    const moneyValue = parseFloat((coinsToConvert / conversionRate).toFixed(2));

    // Deduct coins and credit money balance
    wallet.coinBalance -= coinsToConvert;
    wallet.totalRedeemed += coinsToConvert;
    wallet.fiatBalance = parseFloat((wallet.fiatBalance + moneyValue).toFixed(2));
    await wallet.save();

    // Deduct User ecoPoints for compatibility
    await import('../../db/models/User.js').then(async (m) => {
      const User = m.default;
      await User.findOneAndUpdate(
        { id: userId },
        { $inc: { ecoPoints: -coinsToConvert } }
      );
    });

    // Write CoinHistory log for conversion linked to registered email
    const userEmail = req.user?.email || 'user@ecoeats.com';
    const txnId = `coin-txn-${Date.now()}`;
    await CoinHistory.create({
      id: txnId,
      userId,
      userEmail,
      type: 'redeemed',
      amount: coinsToConvert,
      description: `Converted ${coinsToConvert} coins to ₹${moneyValue} store credit`
    });

    res.json({
      success: true,
      message: `Successfully converted ${coinsToConvert} coins to ₹${moneyValue} store credit!`,
      wallet: {
        coinBalance: wallet.coinBalance,
        totalEarned: wallet.totalEarned,
        totalRedeemed: wallet.totalRedeemed,
        fiatBalance: wallet.fiatBalance,
        moneyValue: parseFloat((wallet.coinBalance / conversionRate).toFixed(2))
      }
    });
  } catch (error) {
    next(error);
  }
};
