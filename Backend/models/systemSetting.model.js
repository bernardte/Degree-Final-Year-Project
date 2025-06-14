import mongoose from "mongoose";

const systemSettingsSchema = mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    value: { type: mongoose.Schema.Types.Mixed, required: true },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const SystemSetting = mongoose.model("SystemSetting", systemSettingsSchema);

export default SystemSetting;
