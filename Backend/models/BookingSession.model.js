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
      ref: "User",
      required: false,
    },
    // ← if guest: filled; if logged-in: left undefined
    guestDetails: {
      type: new mongoose.Schema({
        contactName: { type: String, required: false },
        contactEmail: { type: String, required: false },
        contactNumber: { type: String, required: false },
        additionalDetails: { type: String },
      }),
      required: false, // ✅ make guestDetails optional
    },
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
    breakfastIncluded: { type: Number, default: false },
    // Payment tracking
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "canceled"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["card", "fpx", "grabpay"],
      default: "card",
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
  },
  { timestamps: true }
);

export default mongoose.model("BookingSession", bookingSessionSchema);
