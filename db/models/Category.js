import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  active: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Category', CategorySchema);
