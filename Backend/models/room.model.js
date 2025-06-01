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
      trim: true,
    },
    roomType: {
      type: String,
      required: true,
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
          "air conditioning",
          "mini fridge",
          "private bathroom",
          "room service",
          "in room safe",
          "sofa",
          "desk lamp",
        ],
      },
    ],
    bedType: {
      type: String,
      enum: ["King", "Queen", "Single", "Double", "Twin"],
    },
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
    isActivate: {
      type: Boolean,
      default: true,
    },
    scheduledDeactivationDate: { 
      type: Date, 
      default: null 
    },
    // average rating
    rating: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
        username: { type: String },
        bookingReference: { type: String },
        rating: { type: Number, min: 1, max: 5 },
        comment: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const Room = mongoose.model("Room", roomSchema);

export default Room;
