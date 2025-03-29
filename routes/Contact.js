import express from "express";
import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";
const router = express.Router();
import Contact from "../models/Contact.js";
import transporter from "../lib/nodemailer.js";

// Public route - Anyone can submit a contact form
router.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    const contact = new Contact({ name, email, subject, message });
    await contact.save();

    // Send email to admin
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: `New Contact Form Submission: ${subject}`,
      text: `Name: ${name || 'Not provided'}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}`
    });

    res.status(201).json({ message: 'Form submitted successfully' });
  } catch (error) {
    console.error('Contact submission error:', error);
    res.status(500).json({ error: 'Error submitting form' });
  }
});

// Authenticated routes
const authRouter = express.Router();
authRouter.use(ClerkExpressWithAuth());
// Admin-only route - Get all contact requests
authRouter.get('/api/admin/contacts', async (req, res) => {
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

    // Fetch contacts
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ error: 'Error fetching contacts' });
  }
});

// Admin-only route - Send response email
authRouter.post('/api/admin/respond', async (req, res) => {
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
    // Send response
    const { contactId, response, email } = req.body;
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Response to Your Inquiry',
      text: response
    });

    await Contact.findByIdAndUpdate(contactId, { status: 'responded' });
    res.json({ message: 'Response sent' });
  } catch (error) {
    console.error('Error sending response:', error);
    res.status(500).json({ error: 'Error sending response' });
  }
});

// Admin-only route - Delete contact
authRouter.delete('/api/admin/contacts/:id', async (req, res) => {
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

    // Delete contact
    const { id } = req.params;
    const contact = await Contact.findByIdAndDelete(id);
    
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ error: 'Error deleting contact', details: error.message });
  }
});

router.use(authRouter);

export default router;