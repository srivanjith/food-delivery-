import mongoose from 'mongoose';

const RestaurantSettlementSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  restaurantId: { type: String, required: true, index: true },
  amount: { type: Number, required: true },
  commissionDeducted: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Rejected', 'Paid'], 
    default: 'Pending' 
  },
  approvedBy: { type: String }, // admin ID
  paidAt: { type: Date }
}, { timestamps: true });

export default mongoose.model('RestaurantSettlement', RestaurantSettlementSchema);
