import mongoose from 'mongoose';

const OrderItemSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true }
});

const OrderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  date: { type: String, required: true, default: () => new Date().toISOString() },
  restaurantName: { type: String, required: true },
  restaurantId: { type: String, required: true, index: true },
  customerId: { type: String, index: true },
  customerName: { type: String },
  customerEmail: { type: String },
  items: [OrderItemSchema],
  subtotal: { type: Number, required: true },
  packagingCharge: { type: Number, default: 0 },
  deliveryCharge: { type: Number, default: 0 },
  gst: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  total: { type: Number, required: true },
  packagingChoice: { type: String },
  deliveryMethod: { type: String },
  address: { type: String },
  status: { 
    type: String, 
    enum: ['Order Received', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'],
    default: 'Order Received' 
  },
  paymentId: { type: String },
  rewardCoinsEarned: { type: Number, default: 0 },
  rewardCoinsRedeemed: { type: Number, default: 0 },
  rewardValueRedeemed: { type: Number, default: 0 },
  coinsProcessed: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Order', OrderSchema);
