import express from 'express';
const router = express.Router();
import Expert from "../models/Expert.js"

// Get All Experts
router.get('/', async (req, res) => {
  try {
    const experts = await Expert.find();
    res.json(experts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add Expert (Admin)
router.post('/', async (req, res) => {
  const expert = new Expert(req.body);
  try {
    const newExpert = await expert.save();
    res.status(201).json(newExpert);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update Expert (Admin)
router.put('/:id', async (req, res) => {
  try {
    const expert = await Expert.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(expert);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete Expert (Admin)
router.delete('/:id', async (req, res) => {
  try {
    await Expert.findByIdAndDelete(req.params.id);
    res.json({ message: 'Expert deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete Expert (Admin)
router.delete('/:id', async (req, res) => {
  try {
    const expert = await Expert.findByIdAndDelete(req.params.id);
    if (!expert) return res.status(404).json({ message: 'Expert not found' });
    res.json({ message: 'Expert deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;