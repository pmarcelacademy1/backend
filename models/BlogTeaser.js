import mongoose from 'mongoose';

const blogTeaserSchema = new mongoose.Schema({
  headline: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const BlogTeaser = mongoose.model('BlogTeaser', blogTeaserSchema);

export default  BlogTeaser