import axiosInstance from "@/lib/axios";
import { Reward, RewardHistory } from "@/types/interface.type";
import { create } from "zustand";

type rewardStore = {
  rewards: Reward[];
  rewardHistory: RewardHistory[];
  error: string | null;
  isLoading: boolean;
  fetchAllRewardList: () => Promise<void>;
  addRewards: (reward: Reward) => void;
  deleteReward: (rewardId: string) => void;
  updateNewReward: (updateReward: Reward) => void;
  getRewardHistoryForCertainUser: (
    page: number,
    limit: number,
    append: boolean,
  ) => Promise<void>;
};

const useRewardStore = create<rewardStore>()((set) => ({
  rewards: [],
  rewardHistory: [],
  error: null,
  isLoading: false,
  fetchAllRewardList: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/api/reward/rewards");
      if (response?.data) {
        set({ rewards: response.data });
      }
    } catch (error: any) {
      console.log("Error in fetchAllRewardList: ", error.message);
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },
  addRewards: (reward: Reward) => {
    set((prev) => ({
      rewards: [reward, ...prev.rewards],
    }));
  },
  deleteReward: (rewardId: string) => {
    set((prev) => ({
      rewards: prev.rewards.filter((reward) => rewardId !== reward._id),
    }));
  },
  updateNewReward: (updateReward: Reward) => {
    set((prev) => ({
      rewards: prev.rewards.map((reward) =>
        reward._id === updateReward._id ? updateReward : reward,
      ),
    }));
  },
  getRewardHistoryForCertainUser: async (
    page = 1,
    limit = 10,
    append = false,
  ) => {
    set({ isLoading: true, error: null });
    axiosInstance
      .get(`/api/reward/rewards-history?page=${page}&limit=${limit}`)
      .then((response) => {
        console.log(response.data.rewardHistory);
        set((state) => ({
          rewardHistory: append
            ? [...state.rewardHistory, ...response.data.rewardHistory]
            : response.data.rewardHistory,
        }));
      })
      .catch((error) => set({ error: error.response?.data?.error }))
      .finally(() => set({ isLoading: false }));
  },
}));

export default useRewardStore;
