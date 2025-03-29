import express from "express"
const router = express.Router()
import Newsletter from "../models/Newsletter.js"
import transporter from "../lib/nodemailer.js";


// Subscribe to newsletter
router.post('/api/newsletter', async (req, res) => {
    try {
      const { email } = req.body;
      const subscriber = new Newsletter({ email });
      await subscriber.save();
      res.status(201).json({ message: 'Subscribed successfully' });
    } catch (error) {
      if (error.code === 11000) {
        res.status(400).json({ error: 'Email already subscribed' });
      } else {
        res.status(500).json({ error: 'Error subscribing' });
      }
    }
  });
  
  // Get all newsletter subscribers (Admin)
  router.get('/api/admin/newsletter', async (req, res) => {
    try {
      const subscribers = await Newsletter.find();
      res.json(subscribers);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching subscribers' });
    }
  });
  
  // Delete newsletter subscriber (Admin)
  router.delete('/api/admin/newsletter/:id', async (req, res) => {
    try {
      await Newsletter.findByIdAndDelete(req.params.id);
      res.json({ message: 'Subscriber deleted' });
    } catch (error) {
      res.status(500).json({ error: 'Error deleting subscriber' });
    }
  });
  
  // Replace the existing bulk-email endpoint in server.js
  
  router.post('/api/admin/newsletter/bulk-email', async (req, res) => {
    try {
      const { subject, message, backgroundColor, imageUrl, videoUrl, linkUrl } = req.body;
      const subscribers = await Newsletter.find();
  
      // Construct HTML email content
      const htmlContent = `
        <div style="background-color: ${backgroundColor || '#ffffff'}; padding: 20px;">
          <h2>${subject}</h2>
          <p>${message}</p>
          ${imageUrl ? `<img src="${imageUrl}" alt="Newsletter Image" style="max-width: 100%;"/>` : ''}
          ${videoUrl ? `<p>Watch our video: <a href="${videoUrl}" target="_blank">Click here</a></p>` : ''}
          ${linkUrl ? `<p>Learn more: <a href="${linkUrl}" target="_blank">Click here</a></p>` : ''}
        </div>
      `;
  
      const emailPromises = subscribers.map(subscriber =>
        transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: subscriber.email,
          subject,
          html: htmlContent // Use HTML instead of plain text
        })
      );
  
      await Promise.all(emailPromises);
      res.json({ message: 'Bulk email sent successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error sending bulk email' });
    }
  });






export default router