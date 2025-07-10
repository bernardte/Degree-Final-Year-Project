// models/conversation.model.ts
import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    // anonymous guest ID or login user Id, assume as a receipent Id
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    userCode: {
      type: String, //example： GUEST#789
      required: true,
    },
    // Current conversation mode
    mode: {
      type: String,
      enum: ["chatbot", "human"],
      default: "chatbot",
    },
    handleByChatbot: {
      type: Boolean,
      default: false,
    },
    // chat status
    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open",
    },
    visibleToAdmins: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // admin users
      },
    ],
    unreadCount: {
      type: Number,
      default: 0,
    },
    lastMessage: {
      type: String,
    },
    lastMessageAt: {
      type: Date,
    },
    //! control only one admin can handle the current concersation, if others admin come in not able to make conversation only view
    isLock: {
      type: Boolean,
    },
    // Which admin is handling this session
    lockedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true }
);

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;
