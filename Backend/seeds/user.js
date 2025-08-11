import mongoose from "mongoose";
import User from "../models/user.model.js";// 你的 User 模型路径
import dotenv from "dotenv";
dotenv.config();
const MONGO_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/your-db-name";
await mongoose.connect(MONGO_URI);
console.log("✅ Connected to MongoDB");

// 检查是否已经存在 bot 账号
let botUser = await User.findOne({ role: "bot", username: "ai_chatbot" });

if (!botUser) {
  botUser = await User.create({
    name: "AI Chatbot",
    username: "ai_chatbot",
    role: "bot",
    password: "bot_password_hash", // 生产环境建议 hash，比如用 bcrypt
    email: "ai_chatbot@example.com",
    profilePic: "https://example.com/bot-avatar.png",
  });
  console.log("✅ Bot 用户创建成功:", botUser);
} else {
  console.log("ℹ️ Bot 用户已存在:", botUser._id);
}

mongoose.connection.close();
