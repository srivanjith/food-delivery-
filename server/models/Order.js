import mongoose from 'mongoose';

const OrderItemSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true }
});

const OrderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  date: { type: String, required: true },
  restaurantName: { type: String, required: true },
  restaurantId: { type: String, required: true },
  customerName: { type: String },
  customerEmail: { type: String },
  items: [OrderItemSchema],
  subtotal: { type: Number, required: true },
  packagingCharge: { type: Number, default: 0 },
  deliveryCharge: { type: Number, default: 0 },
  gst: { type: Number, default: 0 },
  total: { type: Number, required: true },
  packagingChoice: { type: String },
  deliveryMethod: { type: String },
  status: { type: String, default: 'Order Received' }
}, { timestamps: true });

export default mongoose.model('Order', OrderSchema);
