// models/SuspiciousEvent.js
import mongoose from "mongoose";

const SuspiciousEventSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    guestId: { type: String },
    type: { type: String },
    reason: { type: String, required: true }, // 'multiple_failed_logins', 'ip_jump', ...
    details: { type: mongoose.Schema.Types.Mixed },
    severity: { type: String, enum: ["low", "medium", "high"], default: "low" },
    handled: { type: Boolean, default: false },
  },
  { timestamps: true }
);

SuspiciousEventSchema.index({ createdAt: -1 });

const SuspiciousEvent = mongoose.model("SuspiciousEvent", SuspiciousEventSchema);
export default SuspiciousEvent;
