// models/ActivityLog.js
import mongoose from "mongoose";
import { type } from "os";

const ActivityLogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", index: true },
    userRole: {
      type: String,
      enum: ["admin", "superAdmin", "user", "bot", "guest"],
      default: "guest",
    },
    sessionId: { type: String, index: true }, // frontend generate sessionId for each users and return back to backend
    type: { type: String, required: true, index: true }, // 'login' | 'logout' | 'page_view' | 'action' | 'login_failed' ...
    action: { type: String }, // 'click_button', 'search', 'download_report' ...
    metadata: { type: mongoose.Schema.Types.Mixed }, // Page URL, button ID, query conditions
    ip: { type: String, index: true },
    ua: { type: String },
    device: {
      os: String,
      browser: String,
      platform: String,
      isMobile: Boolean,
    },
    geo: {
      country: String,
      city: String,
      ll: [Number], // [lat, lon]
    },
    status: {
      type: String,
      required: true,
      enum: ["success", "failed"]
    },
    errorMessage: {
      type: String,
      default: null
    }
  },
  { timestamps: true }
);

// Commonly used composite indexes
ActivityLogSchema.index({ type: 1, createdAt: -1 });
ActivityLogSchema.index({ userId: 1, createdAt: -1 });

// Automatic expiration (e.g. automatic deletion after 180 days)
ActivityLogSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 24 * 3600 }
);

const ActivityLog = mongoose.model("ActivityLog", ActivityLogSchema);

export default ActivityLog;
