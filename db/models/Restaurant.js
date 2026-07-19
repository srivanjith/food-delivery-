import mongoose from 'mongoose';

const RestaurantSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  ownerId: { type: String, index: true },
  name: { type: String, required: true },
  image: { type: String },
  rating: { type: Number, default: 5.0 },
  deliveryTime: { type: String },
  distance: { type: Number },
  location: { type: String },
  description: { type: String },
  address: { type: String },
  contact: { type: String },
  timings: { type: String },
  lat: { type: Number },
  lng: { type: Number },
  categories: [{ type: String }],
  tags: [{ type: String }],
  certifications: [{ type: String }],
  commissionRate: { type: Number, default: 0.15 }, // 15% standard commission
  active: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Restaurant', RestaurantSchema);
