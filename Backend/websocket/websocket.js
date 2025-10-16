// aiSocket.js
import WebSocket from "ws";
import { getIO } from "../config/socket.js";
import User from "../models/user.model.js";
import Message from "../models/message.model.js";

let ws;
let conversationTextMap = {};

export function initAISocket() {
  ws = new WebSocket(`${process.env.PYTHON_BACKEND_URL}/bot-reply-ws`);

  ws.on("open", () => console.log("✅ Connected to AI service"));

  ws.on("message", async (msg) => {
    try {
      const data = JSON.parse(msg.toString());
      const io = getIO();

      // Check whether it is a manual customer service transfer signal
      console.log("Received from AI Websocket: ", data);
      if (data.token.handover_to_human === true) {
        console.log(
          `🤝 Conversation ${data.conversationId} -> Handover to human`
        );

        const bot = await User.findOne({ name: "AI Chatbot" }).select("_id");

        // Broadcast "Transfer to manual customer service" notification to the front end
        io.to(data.conversationId).emit("ai-handover", {
          conversationId: data.conversationId,
          content:
            data.fulfillmentText ||
            "We are transferring you to manual customer service. Please wait...",
          senderType: "bot",
          senderId: bot._id,
          isRead: true,
          image: null,
          createdAt: new Date().toISOString(),
          isFinal: true,
          handover_to_human: true,
        });

        // save to database
        await Message.create({
          conversationId: data.conversationId,
          content:
            data.fulfillmentText ||
            "We are transferring you to manual customer service. Please wait...",
          senderType: "bot",
          senderId: bot._id,
          isRead: true,
        });

        // Clear the cache and stop cumulative generation
        delete conversationTextMap[data.conversationId];
        return; // Stop subsequent AI token processing
      }

      // Normal AI reply processing logic
      if (!conversationTextMap[data.conversationId]) {
        conversationTextMap[data.conversationId] = "";
      }

      conversationTextMap[data.conversationId] += data.token;

      const bot = await User.findOne({ name: "AI Chatbot" }).select("_id");

      io.to(data.conversationId).emit("ai-stream", {
        conversationId: data.conversationId,
        content: data.token,
        senderType: "bot",
        senderId: bot._id,
        isRead: true,
        image: null,
        createdAt: new Date().toISOString(),
        isFinal: data.isFinal,
      });

      if (data.isFinal) {
        const finalText = conversationTextMap[data.conversationId] || "";
        await Message.create({
          conversationId: data.conversationId,
          content: finalText,
          senderType: "bot",
          senderId: bot._id,
          isRead: true,
        });
        delete conversationTextMap[data.conversationId];
      }
    } catch (err) {
      console.error("❌ AI WebSocket message error:", err);
    }
  });

  ws.on("error", (err) => {
    console.error("⚠️ AI WebSocket error:", err.message);
  });

  ws.on("close", () => {
    console.warn("🔁 AI WebSocket closed, reconnecting...");
    ws = null;
    setTimeout(() => {
      if (!ws || ws.readyState === WebSocket.CLOSED) {
        initAISocket();
      }
    }, 2000);
  });
}

export const sendToAI = (
  conversationId,
  newMessage,
  senderId,
  senderType,
  context
) => {
  if (ws?.readyState === WebSocket.OPEN) {
    ws.send(
      JSON.stringify({
        senderId,
        senderType,
        conversationId,
        question: newMessage,
        context,
      })
    );
  } else {
    console.warn("⚠️ WebSocket not connected, message not sent");
  }
};
