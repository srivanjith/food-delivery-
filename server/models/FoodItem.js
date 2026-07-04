import mongoose from 'mongoose';

const FoodItemSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  restaurantId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  image: { type: String },
  rating: { type: Number, default: 5.0 },
  organic: { type: Boolean, default: false },
  vegan: { type: Boolean, default: false },
  localSourced: { type: Boolean, default: false },
  popular: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('FoodItem', FoodItemSchema);
