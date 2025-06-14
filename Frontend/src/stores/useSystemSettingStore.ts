import { create } from "zustand";
import { RewardHistories, RewardSettings } from "@/types/interface.type";
import axiosInstance from "@/lib/axios";

interface useSystemSettingStore {
    systemSetting: RewardSettings;
    rewardPointsHistory: RewardHistories[];
    error: null | string;
    isLoading: boolean;
    fetchSystemSettingRewardPoint: () => Promise<void>;
    fetchRewardPointsHistory: () => Promise<void>;
}

const useSystemSettingStore = create<useSystemSettingStore>()((set) => ({
    error: null,
    isLoading: false,
    rewardPointsHistory: [],
    systemSetting: {
        bookingRewardPoints: 0,
        earningRatio: 0,
        minRedeemPoints: 0,
        maxRedeemPoints: 0,
        rewardProgramEnabled: false,
        tierMultipliers: {
          bronze: 0,
          silver: 0,
          gold: 0,
          platinum: 0,
        }
    },
    fetchSystemSettingRewardPoint: async () => {
        set({ isLoading: true, error: null })
        try {
            const response = await axiosInstance.get(
              "/api/systemSetting/reward-points",
            );
            set({ systemSetting: response.data.newData[0].value });
        } catch (error: any) {
            set({ error: error?.response?.data?.error })
        }finally{
            set({ isLoading: false })
        }
    },
    fetchRewardPointsHistory: async () => {
        set({isLoading: true, error: null});
        try {
            const response = await axiosInstance.get(
              "/api/systemSetting/getAllRewardHistory",
            );
            if(response?.data){
                set({rewardPointsHistory: response.data.history});
            }
        } catch (error: any) {
            set({ error: error?.response?.data?.error})
        }finally{
            set({isLoading: false})
        }
    },
}));

export default useSystemSettingStore;
