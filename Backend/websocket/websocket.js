// aiSocket.js
import WebSocket from "ws";
import { getIO } from "../config/socket.js";
import User from "../models/user.model.js";
import Message from "../models/message.model.js";

let ws;
let buffer = "";
let conversationTextMap = {}

export function initAISocket() {
  ws = new WebSocket(`${process.env.PYTHON_BACKEND_URL}/bot-reply-ws`);

  ws.on("open", () => console.log("Connected to AI service"));

   ws.on("message", async (msg) => {
     try {
       const data = JSON.parse(msg.toString());

       if (!conversationTextMap[data.conversationId]) {
         conversationTextMap[data.conversationId] = "";
       }

       // 累加内容
       conversationTextMap[data.conversationId] += data.token;

       const bot = await User.findOne({ name: "AI Chatbot" }).select("_id");

       // 广播给前端
       getIO().to(data.conversationId).emit("ai-stream", {
         conversationId: data.conversationId,
         content: data.token, // 单次token
         senderType: "bot",
         senderId: bot._id,
         isRead: true,
         image: null,
         createdAt: new Date().toISOString(),
         isFinal: data.isFinal,
       });

       // 如果是最后一个token → 存数据库
       if (data.isFinal) {
         const finalText = conversationTextMap[data.conversationId] || "";
         await Message.create({
           conversationId: data.conversationId,
           content: finalText,
           senderType: "bot",
           senderId: bot._id,
           isRead: true,
         });

         delete conversationTextMap[data.conversationId]; // 清理缓存
       }
     } catch (err) {
       console.error("AI WebSocket message error:", err);
     }
   });



  ws.on("error", (err) => {
    console.error("AI WebSocket error:", err.message);
  });

  ws.on("close", () => {
    console.warn("AI WebSocket closed, reconnecting...");
    ws = null;
    setTimeout(() => {
      if (!ws || ws.readyState === WebSocket.CLOSED) {
        initAISocket();
      }
    }, 2000);
  });
}

export const sendToAI = (conversationId, newMessage, context) => {
  console.log(conversationId, newMessage);
  console.log(ws?.readyState === WebSocket.OPEN);
  if (ws?.readyState === WebSocket.OPEN) {
    ws.send(
      JSON.stringify({
        conversationId: conversationId,
        question: newMessage,
        context: context,
      })
    );
  }
};
