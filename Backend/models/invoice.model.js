import mongoose from "mongoose"

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      required: true,
    },
    invoiceDate: {
      type: Date,
      required: true,
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "booking",
      required: true,
    },
    loyaltyTier: {
      type: String,
      required: false,
    },
    invoiceAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["issued", "cancelled"],
      default: "issued",
    },
    paymentMethod: {
      type: String,
      enum: ["card", "fpx", "grabpay"],
      default: "card",
    },
    paymentStatus: {
      type: String,
      enum: ["paid", "pending", "failed"],
      default: "pending",
    },
    paymentIntentId: {
      type: String,
      required: true,
    },
    paymentDate: {
      type: String,
      required: true,
    },
    pdfUrl: {
      type: String,
      required: false,
    },
    billingName: {
      type: String,
      required: true,
    },
    billingEmail: {
      type: String,
      required: true,
    },
    billingPhoneNumber: {
      type: String,
      required: false,
    },
    bookingReference: {
      type: String,
      required: true,
    },
    rewardDiscount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Invoice = mongoose.model("invoice", invoiceSchema);


export default Invoice;