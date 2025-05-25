import { create } from "zustand";
import { Bookings, CancelBookingRequest } from "@/types/interface.type";
import axiosInstance from "@/lib/axios";

interface BookingStore {
  bookingInformation: Bookings[];
  bookings: Bookings[];
  cancelledBookings: CancelBookingRequest[];
  isLoading: boolean;
  totalPages: number;
  currentPage: number;
  error: string | null;
  updateCancelBookingRequest: (bookingId: string) => void;
  updateBookingStatus: (
    bookingId: string,
    newStatus: "confirmed" | "pending" | "cancelled" | "completed",
    paymentStatus?: "paid" | "unpaid" | "refund",
  ) => void;
  clearBookingInformation: () => void;
  fetchBooking: () => Promise<void>;
  fetchAllBooking: (page: number) => Promise<void>;
  removeBooking: (bookingId: string) => void;
  fetchAllCancelBookingRequest: () => Promise<void>;
}

const useBookingStore = create<BookingStore>((set) => ({
  bookingInformation: [],
  bookings: [],
  cancelledBookings: [],
  totalPages: 1,
  currentPage: 1,
  isLoading: false,
  error: null,
  clearBookingInformation: () => {
    set({ bookingInformation: [] });
  },
  updateCancelBookingRequest: (bookingId: string) => {
    set((prevState) => ({
      cancelledBookings: prevState.cancelledBookings.map((booking) =>
        booking.bookingId === bookingId
          ? { ...booking, status: "approved" }
          : booking,
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
          : booking,
      ),
    }));
  },
  fetchBooking: async () => {
    set({ isLoading: true, error: null });
    axiosInstance
      .get("/api/bookings/get-user-booking")
      .then((response) => {
        if (response?.data?.error) {
          set({ error: response.data.error, bookingInformation: [] });
        } else {
          set({ bookingInformation: response.data, error: null });
        }
      })
      .catch((error: any) => {
        console.log("Error in fetch booking", error.message);
        set({ error: error?.response?.data?.error });
      })
      .finally(() => set({ isLoading: false }));
  },

  fetchAllBooking: async (page: number, limit = 5) => {
    set({ isLoading: true, error: null });
    axiosInstance
      .get(`/api/admin/get-all-bookings?page=${page}&limit=${limit}`)
      .then((response) => {
        const { bookings, totalPages, currentPage } = response.data;
        set({ bookings, totalPages, currentPage });
      })
      .catch((error) =>
        set({
          error: error?.response?.data?.error || error?.response?.data?.message,
          bookings: []
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