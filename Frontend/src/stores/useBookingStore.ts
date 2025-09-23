import { create } from "zustand";
import { Bookings, CancelBookingRequest } from "@/types/interface.type";
import axiosInstance from "@/lib/axios";

interface BookingStore {
  bookingInformation: Bookings[];
  bookings: Bookings[];
  cancelledBookings: CancelBookingRequest[];
  acceptCancelledBookingsRequest: CancelBookingRequest[];
  isLoading: boolean;
  isAcceptCancelledBookingsRequestLoading: boolean;
  isCancelBookingRequestLoading: boolean;
  totalPages: number;
  currentPage: number;
  error: string | null;
  setUpdatePaymentStatus: (bookingId: string) => void;
  setBookingStatus: (newStatus: "confirmed" | "pending") => void;
  updateCancelBookingRequest: (bookingId: string) => void;
  updateBookingStatus: (
    bookingId: string,
    newStatus: "confirmed" | "pending" | "cancelled" | "completed",
    paymentStatus?: "paid" | "unpaid" | "refund",
  ) => void;
  clearBookingInformation: () => void;
  fetchBooking: () => Promise<void>;
  fetchAllBookingViewInCalendar: () => Promise<void>;
  fetchAllBooking: (
    page: number,
    limit?: number,
    searchTerm?: string,
  ) => Promise<void>;
  removeBooking: (bookingId: string) => void;
  fetchAllCancelBookingRequest: () => Promise<void>;
  fetchAllAcceptCancelledBooking: () => Promise<void>;
  handleDeleteAllAcceptCancelledBooking: () => Promise<void>;
}

const useBookingStore = create<BookingStore>((set) => ({
  bookingInformation: [],
  bookings: [],
  cancelledBookings: [],
  acceptCancelledBookingsRequest: [],
  bookingSessions: [],
  totalPages: 1,
  currentPage: 1,
  isLoading: false,
  isAcceptCancelledBookingsRequestLoading: false,
  isCancelBookingRequestLoading: false,
  error: null,
  setUpdatePaymentStatus: (bookingId: string) => {
    set((prev) => ({
      bookings: prev.bookings.map((booking) =>
        bookingId === booking._id
          ? { ...booking, paymentStatus: "refund" }
          : booking,
      ),
    }));
  },
  setBookingStatus: (newStatus: "confirmed" | "pending") => {
    set((prev) => ({
      bookings: prev.bookings.map((booking) =>
        booking.status === "pending"
          ? { ...booking, status: newStatus }
          : booking,
      ),
    }));
  },
  handleDeleteAllAcceptCancelledBooking: async () => {
    try {
      const response = await axiosInstance.delete(
        "/api/bookings/deleteAllCancellationBookingRequest",
      );
      if (response?.data) {
        set({ acceptCancelledBookingsRequest: [] });
      }
    } catch (error: any) {
      set({
        error: error?.response?.data?.error || error?.response?.data?.message,
      });
    }
  },
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
  fetchAllAcceptCancelledBooking: async () => {
    set({ isCancelBookingRequestLoading: true, error: null });
    try {
      const response = await axiosInstance.get(
        "/api/admin/get-all-accept-cancelled-bookings-request",
      );
      console.log("fetchAllAcceptCancelledBooking: ", response?.data);
      set({ acceptCancelledBookingsRequest: response.data });
    } catch (error: any) {
      console.error("Full error in fetchAllAcceptCancelledBooking: ", error);
      if (error.response) {
        console.error("Backend responded with: ", error.response.data);
        set({ error: error.response.data?.error });
      } else if (error.request) {
        console.error("Request was made but no response: ", error.request);
        set({ error: "No response received from server." });
      } else {
        console.error(
          "Something went wrong setting up request: ",
          error.message,
        );
        set({ error: error.message });
      }
    } finally {
      set({ isCancelBookingRequestLoading: false });
    }
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

  fetchAllBooking: async (page: number, limit = 10, searchTerm = "") => {
    set({ isLoading: true, error: null });
    console.log("Fetching all bookings with search term: ", searchTerm);
    axiosInstance
      .get(
        `/api/admin/get-all-bookings?page=${page}&limit=${limit}&search=${searchTerm}`,
      )
      .then((response) => {
        const { bookings, totalPages, currentPage } = response.data;
        set({ bookings, totalPages, currentPage });
      })
      .catch((error) =>
        set({
          error: error?.response?.data?.error || error?.response?.data?.message,
          bookings: [],
        }),
      )
      .finally(() => set({ isLoading: false }));
  },

  fetchAllBookingViewInCalendar: async () => {
    set({ isLoading: true, error: null });
    axiosInstance
      .get("/api/admin/get-all-bookings-view-in-calendar")
      .then((response) => {
        set({ bookings: response.data, error: null });
      })
      .catch((error: any) => {
        set({
          error: error?.response?.data?.error || error?.response?.data?.message,
        });
      })
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
    set({ isAcceptCancelledBookingsRequestLoading: true, error: null });
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
    } finally {
      set({ isAcceptCancelledBookingsRequestLoading: false });
    }
  },

 
}));

export default useBookingStore;
