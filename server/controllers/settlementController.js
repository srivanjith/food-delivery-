import RestaurantSettlement from '../models/RestaurantSettlement.js';
import Wallet from '../models/Wallet.js';
import Restaurant from '../models/Restaurant.js';

export const requestSettlement = async (req, res, next) => {
  const { restaurantId, amount } = req.body;
  try {
    const requestedAmount = Number(amount);
    
    // Fetch Restaurant's Wallet
    const wallet = await Wallet.findOne({ holderId: restaurantId, holderType: 'restaurant' });
    if (!wallet || wallet.fiatBalance < requestedAmount) {
      return res.status(400).json({ success: false, message: 'Insufficient outstanding balance for settlement request' });
    }

    // Deduct fiatBalance from Wallet atomically
    wallet.fiatBalance -= requestedAmount;
    await wallet.save();

    // Deduct commission from calculation
    const restaurant = await Restaurant.findOne({ id: restaurantId });
    const commRate = restaurant?.commissionRate || 0.15;
    const commAmt = requestedAmount * commRate;

    const settlementId = `settle-${Date.now()}`;
    const settlement = await RestaurantSettlement.create({
      id: settlementId,
      restaurantId,
      amount: requestedAmount - commAmt, // Net payout to bank
      commissionDeducted: commAmt,
      status: 'Pending'
    });

    res.status(201).json({ success: true, settlement });
  } catch (error) {
    next(error);
  }
};

export const getSettlements = async (req, res, next) => {
  try {
    const role = req.user?.role || 'customer';
    const userId = req.user?.id || 'user-888';

    let query = {};
    if (role === 'restaurant') {
      const rest = await Restaurant.findOne({ ownerId: userId });
      if (rest) {
        query = { restaurantId: rest.id };
      } else {
        query = { restaurantId: 'none' };
      }
    }

    const settlements = await RestaurantSettlement.find(query).sort({ createdAt: -1 });
    res.json(settlements);
  } catch (error) {
    next(error);
  }
};

export const approveSettlement = async (req, res, next) => {
  const { id } = req.params;
  try {
    const settlement = await RestaurantSettlement.findOne({ id });
    if (!settlement) {
      return res.status(404).json({ success: false, message: 'Settlement record not found' });
    }

    if (settlement.status === 'Paid') {
      return res.status(400).json({ success: false, message: 'Settlement already marked as Paid' });
    }

    settlement.status = 'Paid';
    settlement.approvedBy = req.user?.id || 'admin-999';
    settlement.paidAt = new Date();
    await settlement.save();

    res.json({ success: true, settlement });
  } catch (error) {
    next(error);
  }
};
