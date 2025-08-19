import { create } from "zustand";
import { User } from "@/types/interface.type";
import axiosInstance from "@/lib/axios";

interface userStore {
    user: User[];
    currentLoginUser: User | null;
    error: string | null;
    isLoading: boolean;
    currentPage: number;
    totalPages: number
    updateRole: (userId: string, newRole: "superAdmin" | "admin" | "user") => void;
    setUser: (user: User[]) => void;
    fetchUser: (page: number, limit?: number, searchTerm?: string) => Promise<void>;
    fetchCurrentLoginUser: () => Promise<void>;
}

const useUserStore = create<userStore>((set) => ({
  user: [],
  error: null,
  currentLoginUser: null,
  isLoading: false,
  currentPage: 1,
  totalPages: 1,
  setUser: (user) => set({ user: user }),
  updateRole: (userId: string, newRole: "superAdmin" | "admin" | "user") => {
    set((prevState) => ({
        user: prevState.user.map((user) => user._id === userId ? { ...user, role: newRole} : user)
    }))
  },
  fetchUser: async (page: number, limit = 5, searchTerm = "") => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/api/admin/get-user?page=${page}&limit=${limit}&search=${searchTerm}`);
      const { users, totalPages, currentPage } = response.data;
      set({ user: users, totalPages, currentPage });
      console.log(users);
    } catch (error: any) {
      console.log("Error in fetchUser: ", error?.response?.data?.error);
      set({ error: error?.response?.data?.error, user: [] });
    } finally {
      set({ isLoading: false });
    }
  },
  fetchCurrentLoginUser: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/api/users/getCurrentLoginUser");
      const user = response?.data;
      set({ currentLoginUser: user });
    } catch (error: any) {
      console.log("Error in fetchCurrentLoginUser: ", error?.response?.data?.error);
      set({ error: error?.response?.data?.error, currentLoginUser: null });
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useUserStore;