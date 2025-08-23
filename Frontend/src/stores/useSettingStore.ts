import axiosInstance from "@/lib/axios";
import { Settings } from "@/types/interface.type";
import { create } from "zustand";

interface settingStore {
  isLoading: boolean;
  error: string | null;
  tableData: Settings[];
  limit: number;
  page: number;
  totalPages: number;
  setTotalPages: (totalPages: number) => void;
  setPage: (page: number) => void;
  fetchUsersTrackingData: (
    role: string,
    type: string,
    startDate: string | null,
    endDate: string | null,
    page: number,
    limit: number,
  ) => Promise<void>;
}

const useSettingStore = create<settingStore>()((set) => ({
  isLoading: false,
  error: null,
  tableData: [],
  limit: 0,
  page: 1,
  totalPages: 0,
  setTotalPages: (totalPages: number) => {
    set({ totalPages: totalPages })
  },
  setPage: (page: number) => {
    set({ page: page})
  },
  fetchUsersTrackingData: async (
    role = "",
    type = "",
    startDate = null,
    endDate = null,
    page = 1,
    limit = 10,
  ) => {
    set({ isLoading: true, error: null });
    const params = new URLSearchParams({
      limit: String(limit),
      page: String(page),
      ...(role && { role }),
      ...(type && { type }),
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
    });
    await axiosInstance
      .get(
        `/api/systemSetting/get-user-activity?${params.toString()}`,
      )
      .then((response) =>{
        console.log("Res: ", response?.data?.data)
         set({ 
          tableData: response?.data?.data,
          limit: response?.data?.pagination?.limit, 
          page: response?.data?.pagination?.page,
          totalPages: response?.data?.pagination?.totalPages
        })
      })
      .catch((error) => set({ error: error?.response?.data?.error }))
      .finally(() => set({ isLoading: false }));
  },
}));

export default useSettingStore;
