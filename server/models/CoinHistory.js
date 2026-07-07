import mongoose from 'mongoose';

const CoinHistorySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  userId: { type: String, required: true, index: true },
  orderId: { type: String, index: true },
  type: { type: String, enum: ['earned', 'redeemed', 'refunded'], required: true },
  amount: { type: Number, required: true },
  description: { type: String }
}, { timestamps: true });

export default mongoose.model('CoinHistory', CoinHistorySchema);
