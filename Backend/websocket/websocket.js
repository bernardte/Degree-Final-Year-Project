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

    ws.on("message", async (chunk) => {
    try {
        buffer += chunk.toString(); // 追加到缓存

        // 检查是否是完整 JSON（简单判断方式）
        // 1. 去掉前后空格
        // 2. 必须以 "{" 开头 以 "}" 结尾
        if (buffer.trim().startsWith("{") && buffer.trim().endsWith("}")) {
            const data = JSON.parse(buffer); // 解析完整 JSON
            console.log("reached")
            buffer = ""; // 清空缓存，准备接收下一条

            if(!conversationTextMap[data.conversationId]){
                conversationTextMap[data.conversationId] = "";
            }

            conversationTextMap[data.conversationId] += data.token

            const bot = await User.findOne({ name: "AI Chatbot" }).select("_id");

            // 处理数据
            getIO()
            .to(data.conversationId)
            .emit("ai-stream", {
                conversationId: data.conversationId,
                content: data.token,
                senderType: "bot",
                senderId: bot._id, // 可以先随便给个固定 ID
                isRead: true,
                image: null,
                createdAt: new Date().toISOString(),
                isFinal: data.isFinal,
            });

            if (data.isFinal === true) {

            const finalText = conversationTextMap[data.conversationId] || "";
            await Message.create({
                conversationId: data.conversationId,
                content: finalText,
                senderType: "bot",
                senderId: bot._id,
                isRead: true,
                });
                delete conversationTextMap[data.conversationId]; // 清理内存
            }
        }
    } catch (err) {
        // 如果还没收完整，不解析
        if (err instanceof SyntaxError) {
        return;
        }
        console.error("AI WebSocket message error:", err);
        buffer = ""; // 避免缓存脏数据
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
