import express from 'express';
import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";
const router = express.Router();
import BlogTeaser from '../models/BlogTeaser.js';

// Get all blog teasers (Public)
router.get('/', async (req, res) => {
  try {
    const teasers = await BlogTeaser.find();
    res.json(teasers);
  } catch (err) {
    console.error('Get Blog Teasers Error:', err);
    res.status(500).json({ message: 'Server error while fetching blog teasers', error: err.message });
  }
});

// Authenticated routes
const authRouter = express.Router();
authRouter.use(ClerkExpressWithAuth());

// Create a blog teaser (Admin only)
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


    // Validate input
    if (!req.body.headline || !req.body.description || !req.body.image) {
      return res.status(400).json({ message: 'Headline, description, and image are required' });
    }

    const teaser = new BlogTeaser({
      headline: req.body.headline,
      description: req.body.description,
      image: req.body.image
    });
    const newTeaser = await teaser.save();
    res.status(201).json(newTeaser);
  } catch (err) {
    console.error('Blog Teaser Creation Error:', err);
    res.status(400).json({ message: err.message });
  }
});

// Update a blog teaser (Admin only)
authRouter.put('/:id', async (req, res) => {
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
    // Update teaser
    const teaser = await BlogTeaser.findById(req.params.id);
    if (!teaser) return res.status(404).json({ message: 'Blog teaser not found' });

    Object.assign(teaser, req.body);
    const updatedTeaser = await teaser.save();
    res.json(updatedTeaser);
  } catch (err) {
    console.error('Blog Teaser Update Error:', err);
    res.status(400).json({ message: err.message });
  }
});

// Delete a blog teaser (Admin only)
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

    // Delete teaser
    const teaser = await BlogTeaser.findById(req.params.id);
    if (!teaser) return res.status(404).json({ message: 'Blog teaser not found' });
    await teaser.deleteOne();
    res.json({ message: 'Blog teaser deleted' });
  } catch (err) {
    console.error('Blog Teaser Deletion Error:', err);
    res.status(500).json({ message: 'Server error while deleting blog teaser', error: err.message });
  }
});

router.use(authRouter);

export default router;