import mongoose from 'mongoose';

const carouselItemSchema = new mongoose.Schema({

  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const CarouselItem = mongoose.model('CarouselItem', carouselItemSchema);

export default CarouselItem