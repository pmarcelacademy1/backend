import express from 'express';
import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";
const router = express.Router();
import Category from '../models/Category.js';

// Public route - anyone can view categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Server error while fetching categories', error: err.message });
  }
});

// Authenticated routes
const authRouter = express.Router();
authRouter.use(ClerkExpressWithAuth());

// Admin-only routes with embedded auth
authRouter.post('/', async (req, res) => {
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
    
    
    // if (!isAdmin) {
    //   return res.status(403).json({ error: 'Forbidden: Admin access required' });
    // }

    // Create category
    if (!req.body.name || typeof req.body.name !== 'string' || req.body.name.trim() === '') {
      return res.status(400).json({ message: 'Category name is required and must be a non-empty string' });
    }
    
    const category = new Category({ name: req.body.name });
    const newCategory = await category.save();
    res.status(201).json(newCategory);
  } catch (err) {
    console.error('Category creation error:', err);
    res.status(400).json({ message: err.message });
  }
});

authRouter.delete('/:id', async (req, res) => {
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
    

    // Delete category
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    await category.deleteOne();
    res.json({ message: 'Category deleted' });
  } catch (err) {
    console.error('Category deletion error:', err);
    res.status(500).json({ message: err.message });
  }
});

router.use(authRouter);

export default router;