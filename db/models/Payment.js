import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  orderId: { type: String, required: true, index: true },
  customerId: { type: String, required: true },
  amount: { type: Number, required: true },
  paymentMethod: { type: String, default: 'UPI' },
  upiId: { type: String },
  transactionReference: { type: String, unique: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Completed', 'Failed', 'Refunded'],
    default: 'Pending' 
  }
}, { timestamps: true });

export default mongoose.model('Payment', PaymentSchema);
