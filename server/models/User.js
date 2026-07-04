import mongoose from 'mongoose';

const AddressSchema = new mongoose.Schema({
  id: { type: String, required: true },
  label: { type: String, required: true },
  address: { type: String, required: true }
});

const UserSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  role: { type: String, default: 'customer' },
  avatar: { type: String },
  savedAddresses: [AddressSchema],
  ecoPoints: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('User', UserSchema);
