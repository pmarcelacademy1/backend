
import express from 'express';
const router = express.Router();
import Hero from "../models/Hero.js"

// Get Hero Data
router.get('/', async (req, res) => {
  try {
    const hero = await Hero.findOne();
    res.json(hero);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update Hero Data (Admin)
router.put('/', async (req, res) => {
  try {
    const hero = await Hero.findOneAndUpdate({}, req.body, { new: true, upsert: true });
    res.json(hero);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete Hero Data (Admin)
router.delete('/', async (req, res) => {
  try {
    await Hero.deleteOne({});
    res.json({ message: 'Hero deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


export default router;