import { create } from "zustand";
import { Facility } from "@/types/interface.type";
import axiosInstance from "@/lib/axios";

interface FacilityStore {
  facilities: Facility[];
  facility: Facility | null;
  isLoading: boolean;
  totalPages: number;
  currentPage: number;
  error: string | null;
  fetchFacility: () => Promise<void>;
  fetchCertainFacility: (facilityId: string) => Promise<void>;
  fetchPaginatedFacility: (page: number) => Promise<void>;
  removeFacility: (facilityId: string) => void;
  createFacility: (facility: Facility) => void;
  updateFacility: (facilityId: string, updatedFacility: Facility) => void;
}

const useFacilityStore = create<FacilityStore>((set) => ({
  facilities: [],
  facility: null,
  isLoading: false,
  totalPages: 1,
  currentPage: 1,
  error: null,
  fetchPaginatedFacility: async (page: number, limit = 10) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axiosInstance.get(
        `/api/facilities/paginated?page=${page}&limit=${limit}`,
      );
      const { facility, totalPages, currentPage } = await response.data;
      set({ facilities: facility, totalPages, currentPage, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    } finally {
      set({ isLoading: false });
    }
  },
  fetchCertainFacility: async (facilityId: string) => {
    set({ isLoading: true, error: null });
    const metadata = {
      page: `http://localhost:3000/facilities/facility/${facilityId}`,
      actionId: "Entering facilities info page.",
      params: {
        facilityId: facilityId
      },
      extra: {}
    };

    try {
      const response = await axiosInstance.get(
        `/api/facilities/facility/${facilityId}`,
        {
          params: {
            type: "facility view",
            action: "click facility button to get specific facility",
            metadata: JSON.stringify(metadata),
          }
        }
      );
      set({ facility: response?.data })
    } catch (error: any) {
      set({ error: error?.response?.data?.errror })
    }finally{
      set({ isLoading: false });
    }
  },
  fetchFacility: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await axiosInstance.get("/api/facilities");
      const data = await response.data;
      console.log(data);
      set({ facilities: data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    } finally {
      set({ isLoading: false });
    }
  },

  createFacility: (facility: Facility) => {
    set((prevState) => ({
      facilities: [facility, ...prevState.facilities],
    }));
  },

  removeFacility: (facilityId: string) => {
    set((prevState) => ({
      facilities: prevState.facilities.filter(
        (facility) => facility._id !== facilityId,
      ),
    }));
  },

  updateFacility: (facilityId: string, updatedFacility: Facility) => {
    set((prevState) => ({
      facilities: prevState.facilities.map((facility) =>
        facility._id === facilityId
          ? { ...facility, ...updatedFacility }
          : facility,
      ),
    }));
  },
}));

export default useFacilityStore;