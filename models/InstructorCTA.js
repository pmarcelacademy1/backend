import mongoose from 'mongoose';

const instructorCTASchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  buttonText: { type: String, required: true },
  buttonLink: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const InstructorCTA = mongoose.model('InstructorCTA', instructorCTASchema);

export default InstructorCTA