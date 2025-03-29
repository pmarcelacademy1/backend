import mongoose from "mongoose";

const expertSchema = new mongoose.Schema({
   user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
  name: { type: String, required: true },
  role: { type: String, required: true },
  expertise: { type: String, required: true },
  img: { type: String, required: true },
});

const Expert = mongoose.model('Expert', expertSchema);

export default Expert