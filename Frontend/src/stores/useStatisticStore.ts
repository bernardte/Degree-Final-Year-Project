import { create } from 'zustand'
import { Statistic } from "@/types/interface.type";
import axiosInstance from '@/lib/axios';

interface StatisticStore {
    statisticCardData: Statistic;
    isLoading: boolean;
    error: string | null;
    fetchAllStatisticCardData: () => void;
}


const useStatisticStore = create<StatisticStore>((set) => ({
  statisticCardData: {
    totalBooking: 0,
    totalUsers: 0,
    totalRoom: 0,
    totalRoomAvailable: 0,
  },
  isLoading: false,
  error: null,
  fetchAllStatisticCardData: () => {
    set({ isLoading: true });
    axiosInstance
      .get("/api/statistic")
      .then((response) => { 
        set({ statisticCardData: response?.data }); 
        console.log(response?.data);
    })
    .catch((error) => {
        set({ error: error?.response?.data?.error })
        set({
          statisticCardData: {
            totalBooking: 0,
            totalUsers: 0,
            totalRoom: 0,
            totalRoomAvailable: 0,
          },
        });
    })
      .finally(() => set({ isLoading: false }));
  },
}));


export default useStatisticStore;