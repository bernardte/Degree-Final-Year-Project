import { create } from "zustand";
import { Bookings } from "@/types/interface.type";
import axiosInstance from "@/lib/axios";

interface BookingStore {
  bookingInformation: Bookings[];
  bookings: Bookings[];
  isLoading: boolean;
  error: string | null;
  fetchBooking: () => Promise<void>;
  fetchAllBooking: () => Promise<void>;
}

const useBookingStore = create<BookingStore>((set) => ({
  bookingInformation: [],
  bookings: [],
  isLoading: false,
  error: null,
  fetchBooking: async () => {
    set({ isLoading: true });
    axiosInstance
      .get("/api/bookings/get-user-booking")
      .then((response) => {
        set({ bookingInformation: response.data });
        console.log(response.data);
        if (response.data.error) {
          set({ error: response.data.error });
        }
      })
      .catch((error: any) => {
        console.log("Error in fetch booking", error.message);
        set({ error: error?.response?.data?.error });
      })
      .finally(() => set({ isLoading: false }));
  },

  fetchAllBooking: async () => {
    set({ isLoading: true, error: null });
    axiosInstance.get("/api/admin/get-all-bookings")
    .then((response) => {
      set({ bookings: response?.data })
    })
    .catch(error => set({ error: error?.response?.data?.error || error?.response?.data?.message }))
    .finally(() => set({ isLoading: false }));
  }
}));

export default useBookingStore;