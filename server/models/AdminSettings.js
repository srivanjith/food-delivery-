import mongoose from 'mongoose';

const AdminSettingsSchema = new mongoose.Schema({
  commissionRate: { type: Number, default: 0.15 }, // standard platform commission (15%)
  platformFee: { type: Number, default: 15 },       // flat fee in ₹
  deliveryFeeRate: { type: Number, default: 30 },   // base delivery fee
  rewardEarnRatio: { type: Number, default: 0.10 },  // 10% of subtotal earned in coins
  coinsPer100: { type: Number, default: 20 },         // e.g. 20 coins per ₹100 spent
  coinConversionRate: { type: Number, default: 100 }, // 100 coins = ₹1
  minOrderAmount: { type: Number, default: 200 },     // minimum food amount to allow redemption
  maxRedemptionPercentage: { type: Number, default: 50 }, // max % of food amount that can be paid in coins
  coinExpiryPeriod: { type: Number, default: 365 },   // expiry in days
  rewardSystemEnabled: { type: Boolean, default: true } // system toggle
}, { timestamps: true });

export default mongoose.model('AdminSettings', AdminSettingsSchema);
