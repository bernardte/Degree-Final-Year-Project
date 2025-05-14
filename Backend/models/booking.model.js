import mongoose from "mongoose";

const bookingSchema = mongoose.Schema(
  {
    userEmail: {
      type: String,
      required: function () {
        // Only require userEmail if user is logged in
        return this.userType === "user";
      },
    },
    bookingCreatedByUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    userType: {
      type: String,
      enum: ["user", "guest"],
      required: true,
    },
    room: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room", // Make sure this refers to your 'Room' model
      },
    ],
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    totalGuests: {
      adults: { type: Number, required: true },
      children: { type: Number, default: 0 },
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    BookingDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
    breakfastIncluded: {
      type: Number,
      default: 0
    },
    paymentStatus: {
      type: String,
      enum: ["paid", "unpaid"],
      default: "unpaid",
    },
    paymentMethod: {
      type: String,
      enum: ["card", "fpx", "grabpay"],
      default: "card",
    },
    breakfastIncluded: {
      type: Number,
      required: false,
    },
    specialRequests: {
      type: String,
      required: false,
      trim: true,
    },
    bookingReference: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    qrCodeImageURL: {
      type: String,
    },
    contactName: {
      type: String,
      required: function () {
        return this.userType === "guest";
      },
      trim: true,
    },
    contactEmail: {
      type: String,
      required: function () {
        return this.userType === "guest";
      },
      trim: true,
    },
    contactNumber: {
      type: String,
      required: function () {
        return this.userType === "guest";
      },
      trim: true,
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model("booking", bookingSchema);

export default Booking;
