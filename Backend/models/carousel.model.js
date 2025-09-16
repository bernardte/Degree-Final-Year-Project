import mongoose from "mongoose";

const carouselSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  imageUrl: { type: String, required: true },
  category: {
    type: String,
    enum: ["event", "facility", "room", "homepage"],
    default: "homepage",
    required: true,
  },
  link: { type: String, required: false },
  order: { type: Number, default: 0 },
}, { timestamps: true });

carouselSchema.index({ category: 1, order: 1 }, { unique: true });
const Carousel = mongoose.model("Carousel", carouselSchema);


export default Carousel;
