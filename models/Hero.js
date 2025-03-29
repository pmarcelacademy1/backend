import mongoose from 'mongoose';

const heroSchema = new mongoose.Schema({
   user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  videoUrl: { type: String, required: true },
  buttonText: { type: String, default: 'Get Started now' },
  buttonLink: { type: String, default: '/courses' },
});

const Hero = mongoose.model('Hero', heroSchema);

export default Hero