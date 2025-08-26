import axiosInstance from "@/lib/axios";
import { Reservation } from "@/types/interface.type";
import { create } from "zustand";

interface reservationStore {
  reservations: Reservation[];
  isLoading: boolean;
  error: null | string;
  fetchAllRestaurantReservation: () => Promise<void>;
}

const useReservationStore = create<reservationStore>()((set) => ({
  reservations: [],
  isLoading: false,
  error: null,
  fetchAllRestaurantReservation: async () => {
    set({ isLoading: true, error: null })
    axiosInstance
      .get("/api/reservations/get-all-restaurant-reservation")
      .then((response) => set({ reservations: response?.data }))
      .catch((error: any) =>
        set({
          error: error?.response?.data?.error || error?.response?.data?.message,
        }),
      )
      .finally(() => set({ isLoading: false }));
  },
}));

export default useReservationStore;
