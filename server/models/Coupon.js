import mongoose from 'mongoose';

const CouponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  discountType: { 
    type: String, 
    enum: ['percentage', 'flat', 'free_delivery'], 
    default: 'percentage' 
  },
  discountValue: { type: Number, required: true },
  minOrderValue: { type: Number, default: 0 },
  maxDiscount: { type: Number },
  active: { type: Boolean, default: true },
  expiryDate: { type: Date }
}, { timestamps: true });

export default mongoose.model('Coupon', CouponSchema);
