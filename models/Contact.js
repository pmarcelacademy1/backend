import mongoose from "mongoose"

const contactSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true },
  subject: String,
  message: String,
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

const Contact = mongoose.model('Contact', contactSchema);

export default Contact