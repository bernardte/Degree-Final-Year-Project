import { create } from "zustand";
import { RewardHistories, RewardSettings, HotelInfo } from "@/types/interface.type";
import axiosInstance from "@/lib/axios";

interface useSystemSettingStore {
    systemSetting: RewardSettings;
    rewardPointsHistory: RewardHistories[];
    hotelInformation: HotelInfo | null;
    error: null | string;
    isLoading: boolean;
    logo: string;
    fetchSystemSettingRewardPoint: () => Promise<void>;
    fetchRewardPointsHistory: () => Promise<void>;
    fetchAllHotelInformationInCustomerSide: () => Promise<void>;
}

const useSystemSettingStore = create<useSystemSettingStore>()((set) => ({
    error: null,
    isLoading: false,
    rewardPointsHistory: [],
    hotelInformation: null,
    logo: "",
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
    fetchAllHotelInformationInCustomerSide: async () => {
        axiosInstance
          .get("/api/systemSetting/get-all-hotel-information")
          .then((response) => {
              set({ logo: response?.data?.hotelInformation?.logo })
              set({ hotelInformation: response?.data?.hotelInformation });
          }).catch((error) => set({ error: error?.response?.data?.error }));
    }
}));

export default useSystemSettingStore;
