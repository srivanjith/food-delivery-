import mongoose from 'mongoose';

const PlatformRevenueSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  orderId: { type: String, required: true, unique: true, index: true },
  restaurantId: { type: String, required: true, index: true },
  orderTotal: { type: Number, required: true },
  commissionEarned: { type: Number, required: true },
  platformFeeEarned: { type: Number, required: true },
  deliveryChargeEarned: { type: Number, required: true },
  coinsValueCost: { type: Number, default: 0 }, // cost of coins earned by user (in INR)
  netRevenue: { type: Number, required: true }  // (commission + fee) - coinValueCost
}, { timestamps: true });

export default mongoose.model('PlatformRevenue', PlatformRevenueSchema);
