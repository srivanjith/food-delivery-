import mongoose from 'mongoose';

const WalletSchema = new mongoose.Schema({
  holderId: { type: String, required: true, unique: true, index: true },
  holderEmail: { type: String, index: true },
  holderType: { type: String, enum: ['customer', 'restaurant', 'platform', 'delivery'], required: true },
  coinBalance: { type: Number, default: 0 },
  totalEarned: { type: Number, default: 0 },
  totalRedeemed: { type: Number, default: 0 },
  fiatBalance: { type: Number, default: 0 } // Used for payout settlements
}, { timestamps: true });

export default mongoose.model('Wallet', WalletSchema);
