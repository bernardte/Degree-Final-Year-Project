import mongoose from "mongoose";

const roomSchema = mongoose.Schema(
  {
    roomNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    roomName: {
      type: String,
      required: true,
      trim: true
    },
    roomType: {
      type: String,
      required: true,
      enum: ["double bed", "balcony", "single", "double", "sea view", "deluxe", "deluxe twin"],
    },
    description: {
      type: String,
      trim: true,
    },
    roomDetails: {
      type: String,
      required: true,
    },
    pricePerNight: {
      type: Number,
      required: true,
    },
    amenities: [
      {
        type: String,
        enum: [
          "wifi",
          "tv",
          "ac",
          "fridge",
          "balcony",
          "bathtub",
          "pool",
          "gym",
          "parking",
          "breakfast",
        ],
      },
    ],
    images: [
      {
        type: String,
      },
    ],
    capacity: {
      adults: { type: Number, required: true, max: 5, min: 1 }, //adult are required
      children: { type: Number, default: 0 },
    },
    bookings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "booking",
      },
    ],
    reviews: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
        rating: { type: Number, min: 1, max: 5 },
        comment: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const Room = mongoose.model("room", roomSchema);

export default Room;
