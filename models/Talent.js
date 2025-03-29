import mongoose from "mongoose"



const talentSchema = new mongoose.Schema({
  name: String,
  role: String,
  photo: String,
});
const Talent = mongoose.model('Talent', talentSchema);


export default Talent
