import mongoose from 'mongoose';

const LoginLogSchema = new mongoose.Schema({
  email: { type: String, required: true, index: true },
  userId: { type: String },
  status: { type: String, enum: ['success', 'failed'], required: true },
  timestamp: { type: Date, default: Date.now },
  ipAddress: { type: String },
  userAgent: { type: String }
}, { timestamps: true });

export default mongoose.model('LoginLog', LoginLogSchema);
