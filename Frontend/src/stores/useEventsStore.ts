import { create } from "zustand";
import { Event } from "@/types/interface.type";
import axiosInstance from "@/lib/axios";

interface eventStore {
    events: Event[];
    isLoading: boolean;
    error: string | null;
    fetchAllEvents: () => Promise<void>;
}

const useEventsStore = create<eventStore>((set) => ({
  events: [],
  isLoading: false,
  error: null,
  fetchAllEvents: async () => {
    set({ isLoading: true, error: null})
    try {
        const response = await axiosInstance.get(
          "/api/admin/get-all-enquire-event",
        );
        set({ events: response?.data });
    } catch (error: any) {
        console.log(error?.response?.data?.message || error?.response?.data?.error);
        set({
          error: error?.response?.data?.message || error?.response?.data?.error,
        });
    }finally{
        set({ isLoading: false })
    }
  }
}));

export default useEventsStore;