import { create } from "zustand";
import { BookingSession } from "@/types/interface.type";
import axiosInstance from "@/lib/axios";

interface BookingSessionStore{
    bookingSession: BookingSession;
    isLoading: boolean;
    error: string | null;
    fetchBookingSession: (sessionId: string) => Promise<void>;
    fetchBookingSessionPaymentDetail: (sessionId: string) => Promise<void>;
}

const useBookingSessionStore = create<BookingSessionStore>((set, get) => ({
    bookingSession: {} as BookingSession,
    isLoading: false,
    error: null,
    fetchBookingSession: async (sessionId: string) => {
        set({isLoading: true })
        axiosInstance
            .get("/api/bookings/get-booking-session/" + sessionId)
            .then((response) => {
            set({bookingSession: response.data.session});
            console.log(response.data.session)
            const updatedBookingSession = get().bookingSession;
            console.log(updatedBookingSession);

            if (response.data.error) {
            set({ error: response.data.error });
            }
            })
            .catch((error: any) => {
            console.log("Error in fetchBookingSession", error.message);
            set({ error: error.message });
            }).finally(() => set({isLoading: false}));
        },

        fetchBookingSessionPaymentDetail: async (sessionId: string) => {
            set({ isLoading: true, error: null })
            axiosInstance
              .get(`/api/checkout/session/${sessionId}`)
              .then((res) => {
                set({ bookingSession: res.data.bookingSession })
              })
              .catch((err: any) => {
                console.error(
                  "Error getting payment details",
                  err.response?.data?.error,
                );
                set({ error: err.response?.data?.error})
              }).finally(() => set({ isLoading: false }));
        }
}));

export default useBookingSessionStore;