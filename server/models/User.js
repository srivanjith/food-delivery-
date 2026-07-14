import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

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
  role: { type: String, enum: ['customer', 'restaurant', 'admin', 'delivery'], default: 'customer' },
  avatar: { type: String },
  savedAddresses: [AddressSchema],
  ecoPoints: { type: Number, default: 0 } // Reused for reward coins
}, { timestamps: true });

// Pre-save hook to hash password if modified
UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword) {
  // If password is not hashed yet (e.g. legacy seed data check)
  if (candidatePassword === this.password) return true;
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', UserSchema);
