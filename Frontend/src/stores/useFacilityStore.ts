import { create } from "zustand";
import { Facility } from "@/types/interface.type";
import axiosInstance from "@/lib/axios";

interface FacilityStore {
  facilities: Facility[];
  isLoading: boolean;
  error: string | null;
  fetchFacility: () => Promise<void>;
  removeFacility: (facilityId: string) => void;
  createFacility: (facility: Facility) => void;
  updateFacility: (facilityId: string, updatedFacility: Facility) => void;
}

const useFacilityStore = create<FacilityStore>((set) => ({
  facilities: [],
  isLoading: false,
  error: null,

  fetchFacility: async() => {
    try {
      set({ isLoading: true, error: null });
      const response = await axiosInstance.get("/api/facilities");
      const data = await response.data;
      console.log(data);
      set({ facilities: data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }finally{
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
      facilities: prevState.facilities.filter((facility) => facility._id !== facilityId),
    }));
  },

  updateFacility: (facilityId: string, updatedFacility: Facility) => {
    set((prevState) => ({
      facilities: prevState.facilities.map((facility) =>
        facility._id === facilityId ? { ...facility, ...updatedFacility } : facility
      ),
    }));
  },

}));

export default useFacilityStore;