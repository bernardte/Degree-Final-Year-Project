import { create } from "zustand";
import { Bookings } from "@/types/interface.type";
import axiosInstance from "@/lib/axios";

interface BookingStore {
  bookingInformation: Bookings[];
  isLoading: boolean;
  error: string | null;
  fetchBooking: () => Promise<void>;
}

const useBookingStore = create<BookingStore>((set) => ({
  bookingInformation: [],
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
        set({ error: error.message });
      })
      .finally(() => set({ isLoading: false }));
  },
}));

export default useBookingStore;