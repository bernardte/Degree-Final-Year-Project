import axiosInstance from "@/lib/axios";
import { Reports, Settings } from "@/types/interface.type";
import { create } from "zustand";

interface settingStore {
  isLoading: boolean;
  loading: boolean;
  error: string | null;
  tableData: Settings[];
  limit: number;
  page: number;
  totalPages: number;
  reports: Reports[];
  setTotalPages: (totalPages: number) => void;
  setPage: (page: number) => void;
  fetchAllReportData: () => Promise<void>;
  fetchUsersTrackingData: (
    role: string,
    type: string,
    startDate: string | null,
    endDate: string | null,
    page: number,
    limit: number,
  ) => Promise<void>;
  handleDownloadReport: (reportId: string, reportType: string, fileFormat: string) => Promise<void>;
}

const useSettingStore = create<settingStore>()((set) => ({
  isLoading: false,
  loading: false,
  error: null,
  tableData: [],
  reports: [],
  limit: 0,
  page: 1,
  totalPages: 0,
  setTotalPages: (totalPages: number) => {
    set({ totalPages: totalPages });
  },
  setPage: (page: number) => {
    set({ page: page });
  },
  fetchAllReportData: async () => {
    set({ isLoading: true, error: null });
    axiosInstance
      .get("/api/systemSetting/report")
      .then((response) => set({ reports: response?.data?.reports }))
      .catch((error: any) => {
        set({
          error: error?.response?.data?.error || error?.response?.data?.message,
        });
      })
      .finally(() => set({ isLoading: false }));
  },
  fetchUsersTrackingData: async (
    role = "",
    type = "",
    startDate = null,
    endDate = null,
    page = 1,
    limit = 10,
  ) => {
    set({ loading: true, error: null });
    const params = new URLSearchParams({
      limit: String(limit),
      page: String(page),
      ...(role && { role }),
      ...(type && { type }),
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
    });
    await axiosInstance
      .get(`/api/systemSetting/get-user-activity?${params.toString()}`)
      .then((response) => {
        console.log("Res: ", response?.data?.data);
        set({
          tableData: response?.data?.data,
          limit: response?.data?.pagination?.limit,
          page: response?.data?.pagination?.page,
          totalPages: response?.data?.pagination?.totalPages,
        });
      })
      .catch((error) => set({ error: error?.response?.data?.error }))
      .finally(() => set({ loading: false }));
  },

  handleDownloadReport: async (reportId: string, reportType: string, fileFormat: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await axiosInstance.get(
        `/api/systemSetting/download-report/${reportId}/?type=${reportType}&format=${fileFormat}`,
        { responseType: "blob" },
      );

      const contentDisposition = response.headers["content-disposition"];
      let fileName = `${reportType}.${fileFormat}`;
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?(.+)"?/);
        if (match && match[1]) {
          fileName = match[1];
        }
      }

      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      set({
        error: error?.response?.data?.error || error?.response?.data?.message,
      });
    }finally{
      set({ isLoading: false });
    }
  },
}));

export default useSettingStore;
