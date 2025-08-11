// ChatWidget.jsx
import { useState, useEffect, useRef } from "react";
import { MessageCircle } from "lucide-react";
import ChatWidgetHeader from "./ChatWidgetHeader";
import ChatWidgetMessageList from "./ChatWidgetMessageList";
import ChatWigetInputArea from "./ChatWigetInputArea";
import useMessageStore from "@/stores/useMessageStore";
import useAuthStore from "@/stores/useAuthStore";
import useToast from "@/hooks/useToast";
import axiosInstance from "@/lib/axios";
import { useSocket } from "@/context/SocketContext";
import { getChatFormattedDate } from "@/utils/formatDate";
import { Message } from "@/types/interface.type";

const ChatWidget = () => {
  // ---------------- state ----------------
  const [newMessage, setNewMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [uploadImage, setUploadImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [showSendMessageDate, setShowMessageDate] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // ---------------- stores / hooks ----------------
  const { user, adminReceipentId, setCurrentAdminReceipentId } = useAuthStore();
  const { showToast } = useToast();
  const socket = useSocket();

  const { messagesMap, fetchMessage, pushMessage } = useMessageStore();
  const [streamingBotMsg, setStreamingBotMsg] = useState("");

  const senderId = user?._id || localStorage.getItem("guestId");
  const senderType = user ? "user" : "guest";
  const [mode, setMode] = useState<"bot" | "human">("bot");
  const streamBuffer = useRef<Record<string, string>>({});

  type TempMessage = Partial<Message> & {
    conversationId: string;
    isFinal: boolean;
    token: string;
  };

  console.log(senderType);
  // The message list of the current conversation; if conversationId is empty, give []
  const messages = messagesMap[conversationId ?? ""] ?? [];

  //? get available admin
  useEffect(() => {
    if (!adminReceipentId && socket?.connected) {
      socket.emit(
        "get-available-admin",
        (admin: { receipentId: string; socketId: string }) => {
          admin && setCurrentAdminReceipentId(admin.receipentId);
        },
      );
    }
  }, [adminReceipentId, socket, setCurrentAdminReceipentId]);

  // ? join conversation room and socket to get message
  useEffect(() => {
    if (!socket || !conversationId) return;

    const onMsg = (msg: Message) => {
      pushMessage(msg.conversationId, msg);
    };

    const listenBotMsg = (msg: Message | TempMessage) => {
      if (!msg?.conversationId) return;

      const { conversationId, isFinal, content } = msg as TempMessage;
      console.log("Message: ", content);

      if (!streamBuffer.current[conversationId]) {
        streamBuffer.current[conversationId] = "";
      }

      if (isFinal) {
        const finalMessage: Message = {
          ...(msg as Message),
          content: streamBuffer.current[conversationId], // 用缓存的完整内容
        };
        pushMessage(conversationId, finalMessage);

        // 清空缓存
        delete streamBuffer.current[conversationId];
        setStreamingBotMsg("");
      } else {
        // 累加 token 到缓存
        streamBuffer.current[conversationId] += content;
        setStreamingBotMsg(streamBuffer.current[conversationId]);
      }
    };

    socket.emit("join-room", conversationId);
    socket.on("new-message", onMsg);
    socket.on("ai-stream", listenBotMsg);

    return () => {
      socket.off("new-message", onMsg);
      socket.off("ai-stream", listenBotMsg);
    };
  }, [socket, conversationId, pushMessage]);

  //? Pull history for the first time/switching session
  useEffect(() => {
    if (conversationId) fetchMessage(conversationId);
  }, [conversationId, fetchMessage]);

  //? scroll every time the message changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  //send message
  const handleSendMessage = async () => {
    if (!newMessage.trim() && !uploadImage) return;

    setLoading(true);
    try {
      //if don't have conversation create a new conversation
      let cid = conversationId;
      if (!cid) {
        const { data } = await axiosInstance.post("/api/conversations", {
          adminReceipentId,
          senderId,
          mode,
          lastMessage: newMessage,
          lastMessageAt: new Date(),
        });
        cid = data.conversationId;
        setConversationId(cid);
      }

      //send new message
      const fd = new FormData();
      fd.append("newMessage", newMessage);
      fd.append("senderType", senderType);
      senderId && fd.append("senderId", senderId);
      uploadImage && fd.append("image", uploadImage);
      fd.append("lastMessageAt", new Date().toISOString());

      const { data: msg } = await axiosInstance.post(
        "/api/messages/" + cid,
        fd,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      if (!cid) return;
      //Put it directly into the map; no need to fetch message again
      pushMessage(cid, msg);
      setShowMessageDate(true);
      setNewMessage("");
      setUploadImage(null);
    } catch (e: any) {
      showToast("error", e?.response?.data?.error ?? "Send failed");
    } finally {
      setLoading(false);
    }
  };

  //mark message as read
  useEffect(() => {
    const markAsRead = async () => {
      if (conversationId && isOpen && messages.length > 0) {
        try {
          await axiosInstance.patch(
            `/api/messages/mark-as-read/${conversationId}`,
            {
              userId: senderId,
              userType: senderType,
            },
          );
        } catch (error) {
          console.error("Failed to mark as read:", error);
        }
      }
    };

    markAsRead();
  }, [conversationId, isOpen, messages, senderId, senderType]);

  return (
    <div className="fixed right-25 bottom-6 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center rounded-full bg-blue-600 p-4 text-white shadow-lg hover:bg-blue-700"
          aria-label="Open chat"
        >
          <MessageCircle size={24} />
        </button>
      ) : (
        <div className="flex h-[500px] w-100 flex-col overflow-hidden rounded-xl border bg-white shadow-xl">
          <ChatWidgetHeader setIsOpen={setIsOpen} />

          <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
            {showSendMessageDate && (
              <div className="mb-4 text-center">
                <span className="inline-block rounded-full bg-gray-200 px-3 py-1 text-sm">
                  {getChatFormattedDate(new Date())}
                </span>
              </div>
            )}

            <ChatWidgetMessageList
              messages={messages}
              messagesEndRef={messagesEndRef}
            />
          </div>

          <ChatWigetInputArea
            newMessage={newMessage}
            uploadImage={uploadImage}
            setNewMessage={setNewMessage}
            handleSendMessage={handleSendMessage}
            handleKeyPress={(e) =>
              e.key === "Enter" &&
              !e.shiftKey &&
              (e.preventDefault(), handleSendMessage())
            }
            setUploadImage={setUploadImage}
            loading={loading}
          />
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
