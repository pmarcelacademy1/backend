import mongoose from "mongoose"


const newsletterSchema = new mongoose.Schema({
   user: {
           type: mongoose.Schema.Types.ObjectId,
           ref: "User",
           required: true,
         },
  email: { type: String, required: true, unique: true },
  subscribedAt: { type: Date, default: Date.now }
});

const Newsletter = mongoose.model('Newsletter', newsletterSchema);

export default Newsletter