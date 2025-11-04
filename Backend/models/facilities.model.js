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
  category: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: false,
  },
  iconColor: {
    type: String,
    required: false,
  },
  isActivate: {
    type: Boolean,
    default: true,
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
}, { timestamps: true }
);

const Facility = mongoose.model("facility", facilitiesSchema);

export default Facility;