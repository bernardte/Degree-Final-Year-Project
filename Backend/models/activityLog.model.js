// models/ActivityLog.js
import mongoose from "mongoose";

const ActivityLogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    userRole: { type: String, enum: ["admin", "superAdmin", "user", "bot", "guest"], default: "guest"  },
    sessionId: { type: String, index: true }, // frontend generate sessionId for each users and return back to backend
    type: { type: String, required: true, index: true }, // 'login' | 'logout' | 'page_view' | 'action' | 'login_failed' ...
    action: { type: String }, // 'click_button', 'search', 'download_report' ...
    metadata: { type: mongoose.Schema.Types.Mixed }, // 自定义数据：页面URL、按钮ID、查询条件等
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
  },
  { timestamps: true }
);

// 常用复合索引
ActivityLogSchema.index({ type: 1, createdAt: -1 });
ActivityLogSchema.index({ userId: 1, createdAt: -1 });

// 可选：自动过期（例如180天后自动删除）
ActivityLogSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 180 * 24 * 3600 }
);

const ActivityLog = mongoose.model("ActivityLog", ActivityLogSchema);

export default ActivityLog;
