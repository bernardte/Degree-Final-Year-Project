import axiosInstance from '@/lib/axios';
import { Message } from '@/types/interface.type';
import { create } from 'zustand'

interface messageStore {
  messagesMap: Record<string, Message[]>;
  isLoading: boolean;
  error: string | null;
  fetchMessage: (conversationId: string) => Promise<void>;
  pushMessage: (cid: string, msg: Message) => void;
}
  

const useMessageStore = create<messageStore>((set) => ({
  messagesMap: {},
  isLoading: false,
  error: null,

  fetchMessage: async (conversationId: string) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get(
        "/api/messages/" + conversationId,
      );
      set((state) => ({
        messagesMap: {
          ...state.messagesMap,
          [conversationId]: response.data,
        },
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error?.response?.data?.error, isLoading: false });
    }
  },
  pushMessage: (cid, msg) =>
    set((s) => {
      const list = s.messagesMap[cid] ?? [];

      // If there is _id, check for duplicates, otherwise add it directly
      if (msg._id && list.some((m) => m._id === msg._id)) return s;

      return {
        messagesMap: { ...s.messagesMap, [cid]: [...list, msg] },
      };
    }),
}));
  
export default useMessageStore;
