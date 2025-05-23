import { create } from 'zustand'
import { Statistic } from "@/types/interface.type";
import axiosInstance from '@/lib/axios';

interface StatisticStore {
  statisticCardData: Statistic;
  isLoading: boolean;
  error: string | null;
  fetchAllStatisticCardData: () => void;
  updateRefundBooking: (
    refundAmount: string,
  ) => void;
}


const useStatisticStore = create<StatisticStore>((set) => ({
  statisticCardData: {
    totalBooking: 0,
    totalUsers: 0,
    totalRoom: 0,
    totalRoomAvailable: 0,
    totalRevenue: 0,
    totalRefundAmount: 0,
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
        set({ error: error?.response?.data?.error });
        set({
          statisticCardData: {
            totalBooking: 0,
            totalUsers: 0,
            totalRoom: 0,
            totalRoomAvailable: 0,
            totalRevenue: 0,
            totalRefundAmount: 0,
          },
        });
      })
      .finally(() => set({ isLoading: false }));
  },
  updateRefundBooking: (refundAmount: string) => {
    set((prevState) => {
      return {
        statisticCardData: {
          ...prevState.statisticCardData,
          totalRefundAmount: Number(refundAmount) + prevState.statisticCardData.totalRefundAmount,
        },
      };
    });
  },
}));


export default useStatisticStore;