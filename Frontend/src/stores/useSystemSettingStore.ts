import { create } from "zustand";
import {
  RewardHistories,
  RewardSettings,
  HotelInfo,
  SuspiciousEvent,
} from "@/types/interface.type";
import axiosInstance from "@/lib/axios";
import axios from "axios";

interface useSystemSettingStore {
  systemSetting: RewardSettings;
  rewardPointsHistory: RewardHistories[];
  suspeciousEvents: SuspiciousEvent[];
  hotelInformation: HotelInfo | null;
  error: null | string;
  isLoading: boolean;
  suspeciousEventsError: null | string;
  suspeciousEventsIsLoading: boolean;
  suspeciousEventsTotalPage: number;
  suspeciousEventsCurrentPage: number;
  suspeciousEventsTotalItems: number;
  logo: string;
  fetchSystemSettingRewardPoint: () => Promise<void>;
  fetchRewardPointsHistory: () => Promise<void>;
  fetchAllHotelInformationInCustomerSide: () => Promise<void>;
  fetchAllSuspiciousEvent: (
    page: number,
    limit: number,
    searchTerm: string,
    severity: string,
    status: string,
    sortBy: "date" | "severity",
    sortOrder: "asc" | "desc",
  ) => Promise<void>;
  setSuspiciousCurrentPage: (currentPage: number) => void;
  updateMarkAsSolved: (suspiciousEventId: string, markAsSolved: boolean) => Promise<void>;
}

let controller: AbortController | null = null;

const useSystemSettingStore = create<useSystemSettingStore>()((set) => ({
  error: null,
  suspeciousEventsError: null,
  suspeciousEventsIsLoading: false,
  suspeciousEventsTotalPage: 0,
  suspeciousEventsTotalItems: 0,
  suspeciousEventsCurrentPage: 1,
  isLoading: false,
  rewardPointsHistory: [],
  suspeciousEvents: [],
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
    },
  },
  fetchSystemSettingRewardPoint: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(
        "/api/systemSetting/reward-points",
      );
      set({ systemSetting: response.data.newData[0].value });
    } catch (error: any) {
      set({ error: error?.response?.data?.error });
    } finally {
      set({ isLoading: false });
    }
  },
  fetchRewardPointsHistory: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(
        "/api/systemSetting/getAllRewardHistory",
      );
      if (response?.data) {
        set({ rewardPointsHistory: response.data.history });
      }
    } catch (error: any) {
      set({ error: error?.response?.data?.error });
    } finally {
      set({ isLoading: false });
    }
  },
  fetchAllHotelInformationInCustomerSide: async () => {
    axiosInstance
      .get("/api/systemSetting/get-all-hotel-information")
      .then((response) => {
        set({ logo: response?.data?.hotelInformation?.logo });
        set({ hotelInformation: response?.data?.hotelInformation });
      })
      .catch((error) => set({ error: error?.response?.data?.error }));
  },
  fetchAllSuspiciousEvent: async (
    page: number = 1,
    limit: number = 50,
    searchTerm: string = "",
    severity?: string,
    status?: string,
    sortBy: "date" | "severity" = "date",
    sortOrder: "asc" | "desc" = "desc",
  ) => {
    try {
      // If there is a previous request -> cancel
      if (controller) {
        controller.abort();
      }
      controller = new AbortController();
      set({ suspeciousEventsIsLoading: true });
      const response = await axiosInstance.get(
        "/api/systemSetting/suspicious-event",
        {
          params: {
            page,
            limit,
            search: searchTerm || "",
            severity: severity && severity !== "all" ? severity : undefined,
            status: status && status !== "all" ? status : undefined,
            sortBy,
            sortOrder,
          },
          signal: controller.signal,
        },
      );

      set({
        suspeciousEvents: response?.data?.events || [],
        suspeciousEventsTotalPage: response?.data?.totalPages || 0,
        suspeciousEventsCurrentPage: page,
        suspeciousEventsTotalItems: response?.data?.totalEvents || 0,
      });
    } catch (error: any) {
      if (axios.isCancel(error)) {
        console.log("request cancelled");
      } else {
        set({
          suspeciousEventsError:
            error?.response?.data?.error || error?.response?.data?.message,
        });
      }
    } finally {
      set({ suspeciousEventsIsLoading: false });
    }
  },
  setSuspiciousCurrentPage: (currentPage: number) => {
    set({ suspeciousEventsCurrentPage: currentPage });
  },
  updateMarkAsSolved: async (
    suspiciousEventId: string,
    markAsSolved: boolean,
  ) => {
    axiosInstance
      .patch(
        `/api/systemSetting/suspicious-event-mark-as-solved/${suspiciousEventId}`,
        { handled: markAsSolved },
      )
      .then((response) => {
        set((prevState) => ({
          suspeciousEvents: prevState.suspeciousEvents.map((event) =>
            event._id === suspiciousEventId
              ? { ...event, handled: true, ...response?.data }
              : event,
          ),
        }));
      })
      .catch((error: any) =>
        set({
          suspeciousEventsError:
            error?.response?.data?.error || error?.response?.data?.message,
        }),
      )
  },
}));

export default useSystemSettingStore;
