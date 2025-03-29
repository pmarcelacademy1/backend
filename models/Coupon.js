import mongoose from "mongoose"

// Coupon Schema
const couponSchema = new mongoose.Schema({
    code: { type: String, unique: true },
    discount: Number, // Percentage discount (e.g., 20 for 20%)
    isValid: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
  });

  const Coupon = mongoose.model('Coupon', couponSchema);

  export default Coupon