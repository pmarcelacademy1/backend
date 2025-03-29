import express from 'express';
import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";
const router = express.Router();
import FAQ from '../models/FAQ.js';

// Get all FAQs (Public)
router.get('/', async (req, res) => {
  try {
    const faqs = await FAQ.find();
    res.json(faqs);
  } catch (err) {
    console.error('Get FAQs Error:', err);
    res.status(500).json({ message: 'Server error while fetching FAQs', error: err.message });
  }
});


// Authenticated routes
const authRouter = express.Router();
authRouter.use(ClerkExpressWithAuth());
// Create an FAQ (Admin only)
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
    if (!req.body.question || !req.body.answer) {
      return res.status(400).json({ message: 'Question and answer are required' });
    }

    // Create FAQ
    const faq = new FAQ({
      question: req.body.question,
      answer: req.body.answer
    });
    const newFAQ = await faq.save();
    res.status(201).json(newFAQ);
  } catch (err) {
    console.error('FAQ Creation Error:', err);
    res.status(400).json({ message: err.message });
  }
});

// Update an FAQ (Admin only)
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


    // Update FAQ
    const faq = await FAQ.findById(req.params.id);
    if (!faq) return res.status(404).json({ message: 'FAQ not found' });

    Object.assign(faq, req.body);
    const updatedFAQ = await faq.save();
    res.json(updatedFAQ);
  } catch (err) {
    console.error('FAQ Update Error:', err);
    res.status(400).json({ message: err.message });
  }
});

// Delete an FAQ (Admin only)
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

    // Delete FAQ
    const faq = await FAQ.findById(req.params.id);
    if (!faq) return res.status(404).json({ message: 'FAQ not found' });
    await faq.deleteOne();
    res.json({ message: 'FAQ deleted' });
  } catch (err) {
    console.error('FAQ Deletion Error:', err);
    res.status(500).json({ message: 'Server error while deleting FAQ', error: err.message });
  }
});

router.use(authRouter);

export default router;