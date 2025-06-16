import axiosInstance from "@/lib/axios";
import { Reward } from "@/types/interface.type";
import { create } from "zustand";

type rewardStore = {
  rewards: Reward[];
  error: string | null;
  isLoading: boolean;
  fetchAllRewardList: () => Promise<void>;
  addRewards: (reward: Reward) => void;
  deleteReward: (rewardId: string) => void;
  updateNewReward: (updateReward: Reward) => void;
};

const useRewardStore = create<rewardStore>()((set) => ({
  rewards: [],
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
}));

export default useRewardStore;
