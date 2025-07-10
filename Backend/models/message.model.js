import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    senderType: {
      type: String,
      enum: ["user", "guest", "admin", "superAdmin", "bot"],
      default: "guest",
      required: true,
    },
    senderId: {
      type: String,
      required: true,
    },
    content: {
      type: String,
    },
    image: {
      type: String, //Upload image URL
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("message", messageSchema);

export default Message;
