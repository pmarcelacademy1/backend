import  express from 'express';
const router = express.Router();
import Coupon from "../models/Coupon.js"

router.get('/', async (req, res) => {
    try {
      const coupons = await Coupon.find().sort({ createdAt: -1 });
      res.json(coupons);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching coupons' });
    }
  });

   router.post('/', async (req, res) => {
      const { discount } = req.body;
      const code = generateCouponCode();
      const coupon = new Coupon({ code, discount });
      await coupon.save();
      res.json(coupon);
    });
    
    //  router.put('/:id', async (req, res) => {
    //     const coupon = await Coupon.findByIdAndUpdate(
    //       req.params.id,
    //       { isValid: req.body.isValid },
    //       { new: true }
    //     );
    //     res.json(coupon);
    //   });


       router.get('/validate/:code', async (req, res) => {
          const coupon = await Coupon.findOne({ code: req.params.code });
          if (coupon && coupon.isValid) {
            res.json({ valid: true, discount: coupon.discount });
          } else {
            res.json({ valid: false });
          }
        });

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
              const { isValid, discount, code } = req.body;
          
              const updateData = {};
              if (typeof isValid === 'boolean') updateData.isValid = isValid;
              if (discount !== undefined) {
                if (discount < 0 || discount > 100) {
                  return res.status(400).json({ message: 'Discount must be between 0 and 100' });
                }
                updateData.discount = discount;
              }
              if (code !== undefined) {
                // Check for duplicate codes
                const existingCoupon = await Coupon.findOne({ code, _id: { $ne: id } });
                if (existingCoupon) {
                  return res.status(400).json({ message: 'Coupon code already exists' });
                }
                updateData.code = code;
              }
          
              const coupon = await Coupon.findByIdAndUpdate(
                id,
                updateData,
                { new: true, runValidators: true }
              );
          
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