import { create } from "zustand";
import {
  RewardHistories,
  RewardSettings,
  HotelInfo,
  SuspiciousEvent,
  Carousel,
} from "@/types/interface.type";
import axiosInstance from "@/lib/axios";
import useErrorHandling from "@/hooks/useErrorHandling";

interface useSystemSettingStore {
  systemSetting: RewardSettings;
  rewardPointsHistory: RewardHistories[];
  suspeciousEvents: SuspiciousEvent[];
  carousel: Carousel[];
  hotelInformation: HotelInfo | null;
  error: null | string;
  isLoading: boolean;
  carouselError: null | string;
  carouselErrorType: string;
  carouselIsLoading: boolean;
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
  updateMarkAsSolved: (
    suspiciousEventId: string,
    markAsSolved: boolean,
  ) => Promise<void>;
  fetchAllCarousel: (activeCategory: string) => Promise<void>;
  createNewCarousel: (
    title: string,
    description: string,
    imageFile: File,
    category: "event" | "facility" | "room" | "homepage",
    order: number,
    link?: string,
  ) => Promise<any | null>;
  updateCertainCarousel: (
    carouselId: string,
    updates: {
      title?: string;
      description?: string;
      imageFile?: File;
      link?: string;
      category?: "event" | "homepage" | "room" | "facility";
      order?: number;
    },
  ) => Promise<any | null>;
  deleteCertainCarousel: (arouselId: string) => Promise<any | null>;
  getAllCarousel: (category: string) => Promise<void>;
}

let eventSource: EventSource | null = null;

const useSystemSettingStore = create<useSystemSettingStore>()((set) => ({
  error: null,
  carouselError: null,
  carouselIsLoading: false,
  carouselErrorType: "",
  suspeciousEventsError: null,
  suspeciousEventsIsLoading: false,
  suspeciousEventsTotalPage: 0,
  suspeciousEventsTotalItems: 0,
  suspeciousEventsCurrentPage: 1,
  isLoading: false,
  rewardPointsHistory: [],
  suspeciousEvents: [],
  carousel: [],
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
      // If there is an SSE connection -> Close
      if (eventSource) {
        eventSource.close();
      }

      set({ suspeciousEventsIsLoading: true, suspeciousEventsError: null });

      // Concatenating SSE URLs
      //* to called .env file variable on vite.
      const baseUrl = import.meta.env.VITE_BACKEND_API_URL;
      const url = new URL(
        `${baseUrl}/api/systemSetting/suspicious-event/stream`,
      );
      url.searchParams.append("page", String(page));
      url.searchParams.append("limit", String(limit));
      if (searchTerm) url.searchParams.append("search", searchTerm);
      if (severity && severity !== "all")
        url.searchParams.append("severity", severity);
      if (status && status !== "all") url.searchParams.append("status", status);
      url.searchParams.append("sortBy", sortBy);
      url.searchParams.append("sortOrder", sortOrder);

      // constuct SSE connection
      eventSource = new EventSource(url, { withCredentials: true });

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          set({
            suspeciousEvents: data.events || [],
            suspeciousEventsTotalPage: data.totalPages || 0,
            suspeciousEventsCurrentPage: page,
            suspeciousEventsTotalItems: data.totalEvents || 0,
            suspeciousEventsIsLoading: false,
          });
        } catch (err) {
          console.error("Failed to parse SSE data:", err);
        }
      };

      eventSource.onerror = (err) => {
        console.error("SSE connection error:", err);
        set({
          suspeciousEventsError: "SSE connection error",
          suspeciousEventsIsLoading: false,
        });
        eventSource?.close();
      };
    } catch (error: any) {
      set({
        suspeciousEventsError: error?.message || "unknown error",
        suspeciousEventsIsLoading: false,
      });
    } finally {
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
      );
  },
  fetchAllCarousel: async (activeCategory: string) => {
    set({ carouselIsLoading: true, carouselError: null });
    axiosInstance
      .get("/api/systemSetting/carousel", {
        params: {
          category: activeCategory,
        },
      })
      .then((response) => set({ carousel: response.data }))
      .catch((error) =>
        set({
          carouselError:
            error?.response?.data?.error || error?.response?.data?.message,
        }),
      )
      .finally(() => set({ carouselIsLoading: false }));
  },
  createNewCarousel: async (
    title: string,
    description: string,
    imageFile: File,
    category: "event" | "facility" | "room" | "homepage",
    order: number,
    link?: string,
  ) => {
    try {
      set({ carouselIsLoading: true });
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("order", String(order));

      if (link) {
        formData.append("link", link);
      }

      if (imageFile) {
        console.log("imageFile: ", imageFile);
        formData.append("image", imageFile);
      }
      const response = await axiosInstance.post(
        "/api/systemSetting/carousel",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      set((state) => ({
        carousel: [response.data, ...state.carousel],
      }));

      return response.data;
    } catch (error: any) {
      const { message, type } = useErrorHandling(error);

      set({
        carouselError: message,
        carouselErrorType: type,
      });

      return null;
    } finally {
      set({ carouselIsLoading: false });
    }
  },
  updateCertainCarousel: async (
    carouselId: string,
    updates: {
      title?: string;
      description?: string;
      imageFile?: File;
      link?: string;
      category?: "event" | "homepage" | "room" | "facility";
      order?: number;
    },
  ) => {
    set({ carouselError: null, carouselIsLoading: true });

    try {
      const formData = new FormData();
      Object.entries(updates).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === "imageFile" && value instanceof File) {
            formData.append("image", value);
          } else {
            formData.append(key, String(value));
          }
        }
      });
      const response = await axiosInstance.patch(
        `/api/systemSetting/carousel/${carouselId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      const updatedCarousel = response.data;

      set((state) => ({
        carousel: state.carousel.map((c) =>
          c._id === carouselId ? updatedCarousel : c,
        ),
      }));

      return updatedCarousel;
    } catch (error: any) {
      const { message, type } = useErrorHandling(error);

      set({
        carouselError: message,
        carouselErrorType: type,
      });

      return null;
    } finally {
      set({ carouselIsLoading: false });
    }
  },
  deleteCertainCarousel: async (carouselId: string) => {
    set({ carouselError: null, carouselIsLoading: true });
    try {
      const response = await axiosInstance.delete(
        `/api/systemSetting/carousel/${carouselId}`,
      );
      set((prev) => ({
        carousel: prev.carousel.filter((item) => item._id !== carouselId),
      }));
      return response.data.message;
    } catch (error: any) {
      const { message, type } = useErrorHandling(error);

      set({
        carouselError: message,
        carouselErrorType: type,
      });
    } finally {
      set({ carouselIsLoading: false });
    }
  },
  getAllCarousel: async (category: string) => {
    try {
      const response = await axiosInstance.get(
        "/api/systemSetting/get-all-carousel",
        {
          params: { category },
        },
      );

      set({ carousel: response.data });
    } catch (error: any) {
      const { message, type } = useErrorHandling(error);

      set({
        carouselError: message,
        carouselErrorType: type,
      });
    } finally {
      set({ carouselIsLoading: false });
    }
  },
}));

export default useSystemSettingStore;
