import { create } from "zustand";
import { BookingSession } from "@/types/interface.type";
import axiosInstance from "@/lib/axios";
interface BookingSessionStore {
  bookingSession: BookingSession;
  userBookingSession: BookingSession[];
  isLoading: boolean;
  error: string | null;
  additionalInfo: string;
  setAdditionalInfo: (info: string) => void;
  removeBookingSessionRoom: (roomId: string) => void;
  removeBookingSession: (sessionId: string) => void;
  fetchBookingSession: (sessionId: string) => Promise<void>;
  fetchBookingSessionPaymentDetail: (sessionId: string) => Promise<void>;
  fetchBookingSessionByUser: () => Promise<void>;
}

const useBookingSessionStore = create<BookingSessionStore>((set, get) => ({
  bookingSession: {} as BookingSession,
  userBookingSession: [],
  isLoading: false,
  error: null,
  additionalInfo: "",
  setAdditionalInfo: (info: string) => {
    set({ additionalInfo: info });
  },
  fetchBookingSession: async (sessionId: string) => {
    set({ isLoading: true });
    axiosInstance
      .get("/api/bookings/get-booking-session/" + sessionId)
      .then((response) => {
        set({ bookingSession: response.data.session });
        console.log(response.data.session);
        const updatedBookingSession = get().bookingSession;
        console.log(updatedBookingSession);

        if (response.data.error) {
          set({ error: response.data.error });
        }
      })
      .catch((error: any) => {
        console.log("Error in fetchBookingSession", error.message);
        set({ error: error.message });
      })
      .finally(() => set({ isLoading: false }));
  },

  fetchBookingSessionPaymentDetail: async (sessionId: string) => {
    set({ isLoading: true, error: null });
    axiosInstance
      .get(`/api/checkout/session/${sessionId}`)
      .then((res) => {
        set({ bookingSession: res.data.bookingSession });
      })
      .catch((err: any) => {
        console.error(
          "Error getting payment details",
          err.response?.data?.error,
        );
        set({ error: err.response?.data?.error });
      })
      .finally(() => set({ isLoading: false }));
  },

  removeBookingSessionRoom: async (roomId: string) => {
    const sessionId = get().bookingSession.sessionId;

    if (!sessionId) {
      console.error("No booking session ID found.");
      return;
    }

    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete(
        `/api/bookings/${sessionId}/remove-room/${roomId}`,
      );

      set((prevState) => ({
        bookingSession: {
          ...prevState.bookingSession,
          roomId: Array.isArray(prevState.bookingSession.roomId)
            ? prevState.bookingSession.roomId.filter(
                (id: string) => id !== roomId,
              )
            : [],
        },
      }));
    } catch (error: any) {
      console.log(
        "Error in remove BookingSession Room: ",
        error?.response?.data?.error,
      );
      set({ error: error?.response?.data?.error });
    } finally {
      set({ isLoading: false, error: null });
    }
  },
  removeBookingSession: (sessionId: string) => {
    set((prevState) => {
      const isCurrentSession = prevState.bookingSession._id === sessionId;

      return {
        userBookingSession: prevState.userBookingSession.filter(
          (session) => session.sessionId !== sessionId,
        ),
        bookingSession: isCurrentSession
          ? ({} as BookingSession)
          : prevState.bookingSession,
      };
    });
  },

  fetchBookingSessionByUser: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(
        "/api/bookings/get-booking-session-by-user",
      );

      // Destructure data
      const bookingSessions = response.data;
      console.log("Fetched Booking Sessions:", bookingSessions);

      set({ userBookingSession: bookingSessions });
    } catch (error: any) {
      console.error("Error in fetchBookingSessionByUser", error.message);
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useBookingSessionStore;