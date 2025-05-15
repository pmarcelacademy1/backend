import express from 'express';
const router = express.Router();
import Coupon from "../models/Coupon.js";
import Course from "../models/Course.js"; // Import Course model for validation

router.get('/:id', async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }
    res.json(coupon);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching coupon' });
  }
});

router.get('/', async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching coupons' });
  }
});

router.post('/', async (req, res) => {
  const { discount, courseId } = req.body;
  if (discount < 0 || discount > 100) {
    return res.status(400).json({ message: 'Discount must be between 0 and 100' });
  }
  if (courseId) {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Specified course not found' });
    }
  }
  const code = generateCouponCode();
  const coupon = new Coupon({ code, discount, courseId: courseId || null });
  await coupon.save();
  res.json(coupon);
});

router.get('/validate/:code', async (req, res) => {
  try {
    const { courseId } = req.query; // Get courseId from query params
    const coupon = await Coupon.findOne({ code: req.params.code });
    if (!coupon || !coupon.isValid) {
      return res.json({ valid: false, message: 'Invalid or expired coupon code' });
    }
    if (coupon.courseId && courseId && coupon.courseId.toString() !== courseId) {
      return res.json({ valid: false, message: 'Coupon is not valid for this course' });
    }
    res.json({ valid: true, discount: coupon.discount, couponId: coupon._id });
  } catch (error) {
    res.status(500).json({ valid: false, message: 'Error validating coupon' });
  }
});

router.post('/log-usage/:couponId', async (req, res) => {
  try {
    const { couponId } = req.params;
    const { courseId, userName, email, phone, paymentStatus } = req.body;
    if (!courseId || !userName || !email || !phone || !paymentStatus) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const coupon = await Coupon.findById(couponId);
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }
    coupon.usageRecords.push({
      courseId,
      userName,
      email,
      phone,
      paymentStatus,
      usedAt: new Date(),
    });
    await coupon.save();
    res.json({ message: 'Usage logged successfully' });
  } catch (error) {
    console.error('Error in log-usage:', error);
    res.status(500).json({ message: 'Error logging usage', error: error.message });
  }
});

// router.post('/log-usage/:couponId', async (req, res) => {
//   try {
//     const { couponId } = req.params;
//     const { courseId, userName, email, phone, paymentStatus } = req.body;
//     const coupon = await Coupon.findById(couponId);
//     if (!coupon) {
//       return res.status(404).json({ message: 'Coupon not found' });
//     }
//     coupon.usageRecords.push({
//       courseId,
//       userName,
//       email,
//       phone,
//       paymentStatus,
//       usedAt: new Date(),
//     });
//     await coupon.save();
//     res.json({ message: 'Usage logged successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error logging usage', error });
//   }
// });

function generateCouponCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { isValid, discount, code, courseId } = req.body;
    const updateData = {};
    if (typeof isValid === 'boolean') updateData.isValid = isValid;
    if (discount !== undefined) {
      if (discount < 0 || discount > 100) {
        return res.status(400).json({ message: 'Discount must be between 0 and 100' });
      }
      updateData.discount = discount;
    }
    if (code !== undefined) {
      const existingCoupon = await Coupon.findOne({ code, _id: { $ne: id } });
      if (existingCoupon) {
        return res.status(400).json({ message: 'Coupon code already exists' });
      }
      updateData.code = code;
    }
    if (courseId !== undefined) {
      if (courseId) {
        const course = await Course.findById(courseId);
        if (!course) {
          return res.status(404).json({ message: 'Specified course not found' });
        }
        updateData.courseId = courseId;
      } else {
        updateData.courseId = null;
      }
    }
    const coupon = await Coupon.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }
    res.json(coupon);
  } catch (error) {
    res.status(500).json({ message: 'Error updating coupon', error });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ message: 'Coupon deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting coupon' });
  }
});

export default router;