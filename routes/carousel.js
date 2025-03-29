import express from 'express';
import mongoose from "mongoose";
import { clerkClient } from '@clerk/express';
const router = express.Router();
import CarouselItem from '../models/CarouselItem.js';

// Get all carousel items (public access)
router.get('/', async (req, res) => {
  try {
    const items = await CarouselItem.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create carousel item (Admin only)
router.post('/', async (req, res) => {
  try {
    const clerkUserId = req.auth.userId;
    // Check authentication
    if (!clerkUserId) {
      return res.status(401).json({ error: 'Unauthorized: No user authenticated' });
    }

    const role = req.auth.sessionClaims?.metadata?.role || "user";
    if (role !== "admin") {
      return res.status(403).json({error: 'Forbidden: Admin access required'});
    }
    // Create carousel item
    const item = new CarouselItem({
      title: req.body.title,
      description: req.body.description,
      image: req.body.image
    });
    
    const newItem = await item.save();
    res.status(201).json(newItem);
  } catch (err) {
    console.error('Carousel creation error:', err);
    res.status(400).json({ message: err.message });
  }
});

// Update carousel item (Admin only)
router.put('/:id', async (req, res) => {
  try {
    const clerkUserId = req.auth.userId;
    // Check authentication
    if (!clerkUserId) {
      return res.status(401).json({ error: 'Unauthorized: No user authenticated' });
    }

    const role = req.auth.sessionClaims?.metadata?.role || "user";
    if (role !== "admin") {
      return res.status(403).json({error: 'Forbidden: Admin access required'});
    }
    // Update carousel item
    const item = await CarouselItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    
    item.title = req.body.title || item.title;
    item.description = req.body.description || item.description;
    item.image = req.body.image || item.image;
    
    const updatedItem = await item.save();
    res.json(updatedItem);
  } catch (err) {
    console.error('Carousel update error:', err);
    res.status(400).json({ message: err.message });
  }
});

// Delete carousel item (Admin only)
router.delete('/:id', async (req, res) => {
  try {
    const clerkUserId = req.auth.userId;
    // Check authentication
    if (!clerkUserId) {
      return res.status(401).json({ error: 'Unauthorized: No user authenticated' });
    }

    const role = req.auth.sessionClaims?.metadata?.role || "user";
    if (role !== "admin") {
      return res.status(403).json({error: 'Forbidden: Admin access required'});
    }
    // Delete carousel item
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const item = await CarouselItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    await item.deleteOne();
    res.json({ message: 'Item deleted' });
  } catch (err) {
    console.error('Carousel delete error:', err);
    res.status(500).json({ message: 'Server error while deleting item', error: err.message });
  }
});

export default router;