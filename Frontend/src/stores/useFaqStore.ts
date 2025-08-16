import axiosInstance from "@/lib/axios";
import { FAQ } from "@/types/interface.type";
import { create } from "zustand";

interface faqStore {
  isLoading: boolean;
  faqs: FAQ[];
  error: string | null;
  fetchAllFAQ: () => Promise<void>;
}

const useFaqStore = create<faqStore>()((set) => ({
  error: null,
  isLoading: false,
  faqs: [],
  fetchAllFAQ: async () => {
    set({ isLoading: true, error: null });
      axiosInstance
        .get("/api/faqs/")
        .then((response) => set({ faqs: response.data }))
        .catch((error) => set({ error: error?.response?.data?.error}))
        .finally(() => {
            set({ isLoading: false });
        });
  }
}));

export default useFaqStore;
