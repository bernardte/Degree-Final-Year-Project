import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["booking", "system", "room", "user", "event", "facility", "reward"],
    default: "system",
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  
}, { timestamps: true });

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;