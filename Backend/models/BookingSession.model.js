import mongoose from "mongoose";

const bookingSessionSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
    },
    // ← if logged-in: populated; if guest: null
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: false,
    },
    guestId: {
      type: String,
      default: null,
      requrired: false,
    },
    // ← if guest: filled; if logged-in: left undefined
    guestDetails: {
      type: new mongoose.Schema({
        contactName: { type: String, required: false },
        contactEmail: { type: String, required: false },
        contactNumber: { type: String, required: false },
      }),
      required: false, // make guestDetails optional
    },
    additionalDetail: { type: String, required: false, default: "" },
    roomId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
        required: true,
      },
    ],
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },
    totalGuest: {
      adults: { type: Number, required: true },
      children: { type: Number, required: true },
    },
    totalPrice: { type: Number, required: true },
    breakfastIncluded: { type: Number, default: 0 },
    // Payment tracking
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "canceled"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["card", "fpx", "grabpay", ""],
      default: "",
    },
    paymentIntentId: {
      type: String,
      required: false,
    }, // Stripe Payment Intent ID after payment created
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 1800, // session auto-expires
    },
    rewardDiscount: {
      type: Number,
      default: 0,
    },
    rewardCode: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("BookingSession", bookingSessionSchema);
