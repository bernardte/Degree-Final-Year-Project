import mongoose from "mongoose";

const facilitiesSchema = mongoose.Schema({
  facilitiesName: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
    maxlength: 500,
    default: "",
  },
  icon: {
    type: String,
    required: true,
  },
  iconColor: {
    type: String,
    required: true,
  },
  openTime: {
    type: String,
    required: true,
  },
  closeTime: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: "",
    required: true,
  }
}, { timeStamps: true }
);

const Facility = mongoose.model("facility", facilitiesSchema);

export default Facility;