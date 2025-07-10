import { useState, useEffect, useRef } from "react";
import ConversationSidebar from "@/layout/components/admin-page-component/chat-component/Conversation component/ConversationSidebar";
import ChatHeader from "@/layout/components/admin-page-component/chat-component/Chat-component/ChatHeader";
import MessageContainer from "@/layout/components/admin-page-component/chat-component/Chat-component/MessageContainer";
import MessageInput from "@/layout/components/admin-page-component/chat-component/Chat-component/MessageInput";
import NoConversationSelected from "@/layout/components/admin-page-component/chat-component/Conversation component/NoConversationSelected";
import axiosInstance from "@/lib/axios";
import useAuthStore from "@/stores/useAuthStore";
import useToast from "@/hooks/useToast";
import useMessageStore from "@/stores/useMessageStore";
import useConversationStore from "@/stores/useConversationStore";
import { Conversation } from "@/types/interface.type";
import { useSocket } from "@/context/SocketContext";

const AdminChatPage = () => {
  const { fetchAllConversation, conversations, addNewConversation, updateConversation } =
    useConversationStore();
  const { messagesMap, fetchMessage, pushMessage } =
    useMessageStore((state) => state);
  // set setselected user
  const [activeConversation, setActiveConversation] =
  useState<Conversation | null>(null);
  const messages = messagesMap[activeConversation?._id ?? ""] ?? [];
  const [newMessage, setNewMessage] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [uploadImage, setUploadImage] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { user } = useAuthStore();
  const guestId = localStorage.getItem("guestId");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const senderId = user?._id || guestId;
  const socket = useSocket();

  let senderType = "bot";
  if (user) {
    if (user.role === "admin") senderType = "admin";
    else if (user.role === "superAdmin") senderType = "superAdmin";
    else if (user.role === "user") senderType = "user";
  } else if (guestId) {
    senderType = "guest";
  }

  const filteredConversations = searchTerm
    ? conversations.filter((conv) =>
        conv.userCode.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : conversations;

  //* fetch all message
  useEffect(() => {
    if (activeConversation) {
      fetchMessage(activeConversation?._id);
    }

    fetchAllConversation();
  }, [fetchMessage, fetchAllConversation, activeConversation]);

  //* Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  //* scroll to the new message, which is bottom, when old conversation is being click.
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Handle sending a new message
  const handleSendMessage = async () => {
    if (newMessage.trim() === "") return;
    if (!activeConversation?._id) return;
    const formData = new FormData();
    formData.append("newMessage", newMessage);
    formData.append("senderType", senderType);
    if (senderId) {
      formData.append("senderId", senderId);
    }
    console.log(uploadImage);
    if (uploadImage) {
      formData.append("image", uploadImage);
    }

    formData.append("lastMessageAt", new Date().toISOString());

    setLoading(true);
    try {
      await axiosInstance.post(
        "/api/messages/" + activeConversation?._id,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      setNewMessage("");
      setUploadImage(null);
    } catch (error: any) {
      showToast("error", error?.response?.data?.error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if(activeConversation?._id && socket){
      socket.emit("join-room", activeConversation?._id);
    }

    socket?.on("new-message", (message) => {
      console.log("New Message: ", message);
      if(activeConversation?._id){
        pushMessage(message.conversationId, message);
      }

      updateConversation(message.conversationId, message.content, new Date(message.createdAt))
    })

    socket?.on("new-conversation", (conversation) => {
      addNewConversation(conversation);
    })

    return () => {
      socket?.off("new-message");
      socket?.off("new-conversation");
    }

  }, [socket, activeConversation?._id])

  useEffect(() => {
    const markAsRead = async () => {
      if (activeConversation?._id && activeConversation && messages.length > 0) {
        try {
          await axiosInstance.patch(
            `/api/messages/mark-as-read/${activeConversation?._id}`,
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
  }, [activeConversation?._id, activeConversation, messages, senderId, senderType]);

  return (
    <div className="flex h-screen bg-gray-50 p-4">
      {/* Conversations sidebar */}
      <ConversationSidebar
        filteredConversations={filteredConversations}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setActiveConversation={setActiveConversation}
        activeConversation={activeConversation}
      />

      {/* Main chat area */}
      <div className="flex flex-grow flex-col rounded-xl bg-white shadow-md">
        {activeConversation ? (
          <>
            {/* Chat header */}
            <ChatHeader activeConversation={activeConversation} />

            {/* Messages area */}
            <MessageContainer
              messages={messages ?? []}
              messagesEndRef={messagesEndRef}
              activeConversation={activeConversation}
            />

            {/* Message input area */}
            <MessageInput
              newMessage={newMessage}
              setNewMessage={setNewMessage}
              handleSendMessage={handleSendMessage}
              loading={loading}
              uploadImage={uploadImage}
              setUploadImage={setUploadImage}
            />
          </>
        ) : (
          // Empty state when no conversation is selected
          <NoConversationSelected />
        )}
      </div>
    </div>
  );
};

export default AdminChatPage;
