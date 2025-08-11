import axiosInstance from "@/lib/axios";
import { create } from "zustand";
import { Conversation } from "@/types/interface.type";

interface conversationStore {
  conversations: Conversation[];
  error: null | string;
  isLoading: boolean;
  addNewConversation: (newConv: Conversation) => void;
  updateConversation: (
    conversationId: string,
    lastMessage: string,
    lastMessageAt: Date,
  ) => Promise<void>;
  fetchAllConversation: () => Promise<void>;
  handleCloseSession: (
    conversationId: string,
    newStatus: "open" | "closed",
  ) => Promise<void>;
}

const useConversationStore = create<conversationStore>()((set) => ({
  conversations: [],
  error: null,
  isLoading: false,
  addNewConversation: (newConv: Conversation) => {
    set((state) => {
      const exists = state.conversations.some(
        (conv) => conv._id === newConv._id,
      );

      const updatedConversations = exists
        ? state.conversations.map((conv) =>
            conv._id === newConv._id ? { ...conv, ...newConv } : conv,
          )
        : [newConv, ...state.conversations]; // prepend if new

      return { conversations: updatedConversations };
    });
  },

  updateConversation: async (conversationId, lastMessage, lastMessageAt) => {
    await axiosInstance.patch("/api/conversations", {
      conversationId,
      lastMessage,
      lastMessageAt,
    });

    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv._id === conversationId
          ? { ...conv, lastMessage, lastMessageAt, unreadCount: 0 }
          : conv,
      ),
    }));
  },

  fetchAllConversation: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/api/conversations");
      set({ conversations: response.data.conversations });
    } catch (error: any) {
      set({ error: error?.response?.data?.error });
    } finally {
      set({ isLoading: false });
    }
  },
  handleCloseSession: async (conversationId: string, newStatus: "open"| "closed") => {
    try {
      await axiosInstance.patch(
        `/api/conversations/update-conversation-status/${conversationId}`,
        { status: newStatus },
      );
       set((prevState) => ({
         conversations: prevState.conversations.map((conv) =>
           conv._id === conversationId ? { ...conv, status: newStatus} : conv,
         ),
       }));
    } catch (error: any) {
      console.log("Error in handle close session", error?.response?.data?.error);
    }
  },
}));

export default useConversationStore;
