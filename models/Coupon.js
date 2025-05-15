import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  code: { type: String, unique: true },
  discount: Number,
  isValid: { type: Boolean, default: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", default: null },
  usageRecords: [{
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    userName: String,
    email: String,
    phone: String,
    paymentStatus: { type: String, enum: ['paid', 'not_paid'], default: 'not_paid' },
    usedAt: { type: Date, default: Date.now },
  }],
  createdAt: { type: Date, default: Date.now }
});


// Ensure usageRecords is always an array
couponSchema.pre('save', function(next) {
  if (!this.usageRecords) {
    this.usageRecords = [];
  }
  next();
});

const Coupon = mongoose.model('Coupon', couponSchema);

export default Coupon;