import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  //  user: {
  //       type: mongoose.Schema.Types.ObjectId,
  //       ref: "User",
  //       required: true,
  //     },
    title: { type: String, required: true },
    category: { type: String, required: true },
    instructor: { type: String, required: true },
    price: { type: Number, required: true },
    rating: { type: String, default: 4.5 },
    img: { type: String, required: true },
    duration: { type: String, required: true }, // e.g., "6 weeks"
    features: [{ type: String }], // Array of feature strings
  });
  
 const Course = mongoose.model('Course', courseSchema);

 export default Course
