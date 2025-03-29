
import mongoose from "mongoose";

const postCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

const Category = mongoose.model("postCategory", postCategorySchema);
export default Category;