import { create } from "zustand";
import { Bookings, CancelBookingRequest } from "@/types/interface.type";
import axiosInstance from "@/lib/axios";

interface BookingStore {
  bookingInformation: Bookings[];
  bookings: Bookings[];
  cancelledBookings: CancelBookingRequest[];
  isLoading: boolean;
  error: string | null;
  updateCancelBookingRequest: (bookingId: string) => void;
  updateBookingStatus: (
    bookingId: string,
    newStatus: "confirmed" | "pending" | "cancelled" | "completed",
    paymentStatus?: "paid" | "unpaid" | "refund",
  ) => void;
  fetchBooking: () => Promise<void>;
  fetchAllBooking: () => Promise<void>;
  removeBooking: (bookingId: string) => void;
  fetchAllCancelBookingRequest: () => Promise<void>;
}

const useBookingStore = create<BookingStore>((set) => ({
  bookingInformation: [],
  bookings: [],
  cancelledBookings: [],
  isLoading: false,
  error: null,
  updateCancelBookingRequest: (bookingId: string) => {
    set((prevState) => ({
      cancelledBookings: prevState.cancelledBookings.map((booking) =>
        booking.bookingId === bookingId
          ? { ...booking, status: "approved" }
          : booking
      ),
    }));
  },
  updateBookingStatus: (
    bookingId: string,
    newStatus: "confirmed" | "pending" | "cancelled" | "completed",
    paymentStatus?: "paid" | "unpaid" | "refund",
  ) => {
    set((prevState) => ({
      bookings: prevState.bookings.map((booking) =>
        booking._id === bookingId
          ? {
              ...booking,
              status: newStatus,
              ...(paymentStatus !== undefined ? { paymentStatus } : {}),
            }
          : booking
      ),
    }));
  },
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
    axiosInstance
      .get("/api/admin/get-all-bookings")
      .then((response) => {
        set({ bookings: response?.data });
      })
      .catch((error) =>
        set({
          error: error?.response?.data?.error || error?.response?.data?.message,
        }),
      )
      .finally(() => set({ isLoading: false }));
  },

  removeBooking: (bookingId: string) => {
    set((prevState) => {
      const updateBookingStatus = prevState.bookings.filter(
        (booking) => booking._id !== bookingId,
      );
      const removeCancelBookingRequest = prevState.cancelledBookings.filter(
        (booking) => booking.bookingId !== bookingId,
      );
      return {
        ...prevState,
        bookings: updateBookingStatus,
        cancelledBookings: removeCancelBookingRequest,
      };
    });
  },

  fetchAllCancelBookingRequest: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(
        "/api/admin/get-all-cancelled-bookings-request",
      );
      if (response.data.error) {
        set({ error: response.data.error });
      }
      set({ cancelledBookings: response.data });
    } catch (error: any) {
      console.log("Error in fetch all cancel booking request", error);
      set({
        error: error?.response?.data?.error || error?.response?.data?.message,
      });
    }
  },
 
}));

export default useBookingStore;