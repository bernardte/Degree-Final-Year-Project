import mongoose from "mongoose";

const CancellationRequestSchema = mongoose.Schema({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "booking",
    required: true,
  },
  email: { type: String, required: true },
  bookingReference: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "approved", "decline"],
    default: "pending",
  },
  checkInDate: { type: Date, required: true },
  requestedAt: { type: Date, default: Date.now },
  processedAt: Date,
  processedBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
}, { timestamps: true });
const CancellationRequest = mongoose.model(
  "CancellationRequest",
  CancellationRequestSchema
);

export default CancellationRequest;