import express from 'express';
import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";
const router = express.Router();
import InstructorCTA from '../models/InstructorCTA.js';

// Get all instructor CTAs (Public)
router.get('/', async (req, res) => {
  try {
    const ctas = await InstructorCTA.find();
    res.json(ctas);
  } catch (err) {
    console.error('Get Instructor CTAs Error:', err);
    res.status(500).json({ message: 'Server error while fetching instructor CTAs', error: err.message });
  }
});

// Authenticated routes
const authRouter = express.Router();
authRouter.use(ClerkExpressWithAuth());

// Create an instructor CTA (Admin only)
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
    if (!req.body.title || !req.body.description || !req.body.image || !req.body.buttonText || !req.body.buttonLink) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const cta = new InstructorCTA({
      title: req.body.title,
      description: req.body.description,
      image: req.body.image,
      buttonText: req.body.buttonText,
      buttonLink: req.body.buttonLink
    });
    const newCTA = await cta.save();
    res.status(201).json(newCTA);
  } catch (err) {
    console.error('Instructor CTA Creation Error:', err);
    res.status(400).json({ message: err.message });
  }
});

// Update an instructor CTA (Admin only)
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

    // Update CTA
    const cta = await InstructorCTA.findById(req.params.id);
    if (!cta) return res.status(404).json({ message: 'Instructor CTA not found' });

    Object.assign(cta, req.body);
    const updatedCTA = await cta.save();
    res.json(updatedCTA);
  } catch (err) {
    console.error('Instructor CTA Update Error:', err);
    res.status(400).json({ message: err.message });
  }
});

// Delete an instructor CTA (Admin only)
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

    // Delete CTA
    const cta = await InstructorCTA.findById(req.params.id);
    if (!cta) return res.status(404).json({ message: 'Instructor CTA not found' });
    await cta.deleteOne();
    res.json({ message: 'Instructor CTA deleted' });
  } catch (err) {
    console.error('Instructor CTA Deletion Error:', err);
    res.status(500).json({ message: 'Server error while deleting instructor CTA', error: err.message });
  }
});

router.use(authRouter);

export default router;