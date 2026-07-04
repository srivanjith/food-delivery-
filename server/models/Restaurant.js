import mongoose from 'mongoose';

const RestaurantSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  image: { type: String },
  rating: { type: Number, default: 5.0 },
  deliveryTime: { type: String },
  distance: { type: Number },
  location: { type: String },
  categories: [{ type: String }],
  description: { type: String },
  address: { type: String },
  lat: { type: Number },
  lng: { type: Number },
  tags: [{ type: String }],
  certifications: [{ type: String }]
}, { timestamps: true });

export default mongoose.model('Restaurant', RestaurantSchema);
