// seed/messages.seed.ts
import mongoose from "mongoose";
import dotenv from "dotenv";
import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";

// Load .env if needed
dotenv.config();

const MONGO_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/your-db-name";

const seedMessages = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Get all conversations
    const conversations = await Conversation.find();

    console.log("Your conversations", conversations);

    if (conversations.length === 0) {
      console.log(
        "⚠️ No conversations found. Please seed conversations first."
      );
      return;
    }

    // Seed messages for each conversation
    const messages = [];

    conversations.forEach((conv) => {
      messages.push(
        {
          conversationId: conv._id,
          senderType: "guest",
          senderId: conv.userId,
          content: "Hi, I have a question about my booking.",
        },
        {
          conversationId: conv._id,
          senderType: "admin",
          senderId: conv.adminId,
          content: "Sure, could you please provide your booking ID?",
        },
        {
          conversationId: conv._id,
          senderType: "guest",
          senderId: conv.userId,
          content: `Yes, my booking ID is ${conv.bookingId}.`,
        }
      );
    });

    // Remove old messages first (optional)
    await Message.deleteMany({});
    await Message.insertMany(messages);

    console.log(`✅ Seeded ${messages.length} messages.`);
  } catch (err) {
    console.error("❌ Error seeding messages:", err.message);
  } finally {
    mongoose.connection.close();
  }
};

seedMessages();
