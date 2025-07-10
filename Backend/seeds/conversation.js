// seed/conversations.seed.ts
import mongoose from "mongoose";
import dotenv from "dotenv";
import Conversation from "../models/conversation.model.js"; // adjust path if needed

dotenv.config();

const seedConversations = async () => {
  try {
    console.log("📌 Connecting to:", process.env.MONGODB_URI);

    await mongoose.connect(process.env.MONGODB_URI);

    // Clear existing conversations
    await Conversation.deleteMany({});

    // Sample seed data
    const conversations = [
      {
        userId: new mongoose.Types.ObjectId("6803aaa763349ba8dca90311"),
        userCode: "GUEST#789",
        lockedBy: new mongoose.Types.ObjectId("6803a87b63349ba8dca90308"),
        mode: "chatbot",
        status: "open",
        bookingId: "BOOK-789123",
        roomType: "Deluxe Double Room",
        unreadCount: 2,
        lastMessage: "I need to change my check-in date",
        lastMessageAt: new Date("2023-04-15T10:30:00Z"),
        isLock: true,
      },
      {
        userId: new mongoose.Types.ObjectId("6803aaa763349ba8dca90311"),
        userCode: "GUEST#101",
        lockedBy: new mongoose.Types.ObjectId("6803aacd63349ba8dca90315"),
        mode: "human",
        status: "open",
        bookingId: "BOOK-101112",
        roomType: "Ocean View Suite",
        unreadCount: 0,
        lastMessage: "There's an issue with the room facilities",
        lastMessageAt: new Date("2023-04-14T16:45:00Z"),
        isLock: true,
      },
      {
        userId: new mongoose.Types.ObjectId("64f1a9e8e7404a4318b2c999"), // registered user
        userCode: "USER#889",
        lockedBy: new mongoose.Types.ObjectId("6803aacd63349ba8dca90315"),
        mode: "human",
        status: "closed",
        bookingId: "BOOK-200101",
        roomType: "Standard Room",
        unreadCount: 0,
        lastMessage: "Thank you for the support",
        lastMessageAt: new Date("2023-04-13T09:00:00Z"),
        isLock: true,
      },
    ];

    const saved = await Conversation.insertMany(conversations);
    console.log("✅ Seeded conversations:", saved);
    console.log("✅ Conversation seeds inserted successfully.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding conversations:", err);
    process.exit(1);
  }
};

//! to run seed, use this line of code node seeds/conversations.js
seedConversations();
