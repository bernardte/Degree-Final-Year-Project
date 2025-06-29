import { create } from "zustand";
import { Event } from "@/types/interface.type";
import axiosInstance from "@/lib/axios";

interface eventStore {
  events: Event[];
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  fetchAllEvents: (page: number) => Promise<void>;
  updateEventsStatus: (eventId: string, newStatus: string) => void;
  fetchEventsForCalendarView: () => Promise<void>;
}

const useEventsStore = create<eventStore>((set) => ({
  events: [],
  isLoading: false,
  currentPage: 1,
  totalPages: 1,
  error: null,
  updateEventsStatus: (eventId: String, newStatus: string) => {
    set((prevState) => ({
      events: prevState.events.map((event) =>
        eventId === event._id ? { ...event, status: newStatus } : event,
      ),
    }));
  },
  fetchAllEvents: async (page: number, limit = 10) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(
        `/api/admin/get-all-enquire-event?page=${page}&limit=${limit}`,
      );
      const { events, totalPages, currentPage } = response?.data;
      set({ events, totalPages, currentPage });
    } catch (error: any) {
      console.log(
        error?.response?.data?.message || error?.response?.data?.error,
      );
      set({
        error: error?.response?.data?.message || error?.response?.data?.error,
      });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchEventsForCalendarView: async () => {
    set({ isLoading: true, error: null });
    axiosInstance
      .get("/api/event/get-all-event-request-for-calendar-view")
      .then((response) => {
        console.log(response?.data);
        set({ events: response?.data });
      })
      .catch((error) => set({ error: error?.response?.data?.error }))
      .finally(() => set({ isLoading: false }));
  },
}));

export default useEventsStore;
