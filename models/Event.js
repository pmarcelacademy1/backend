import  mongoose from 'mongoose';



const eventSchema = new mongoose.Schema({
  name: String,
  description: String,
  time: String,
  coverPhoto: String,
  photos: [String],
});
const Event = mongoose.model('Event', eventSchema);

export default Event