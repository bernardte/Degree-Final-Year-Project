import { create } from "zustand";
import { User } from "@/types/interface.type";
import axiosInstance from "@/lib/axios";

interface userStore {
    user: User[];
    error: string | null;
    isLoading: boolean;
    updateRole: (userId: string, newRole: "superAdmin" | "admin" | "user") => void;
    setUser: (user: User[]) => void;
    fetchUser: () => Promise<void>;
}

const useUserStore = create<userStore>((set) => ({
  user: [],
  error: null,
  isLoading: false,
  setUser: (user) => set({ user: user }),
  updateRole: (userId: string, newRole: "superAdmin" | "admin" | "user") => {
    set((prevState) => ({
        user: prevState.user.map((user) => user._id === userId ? { ...user, role: newRole} : user)
    }))
  },
  fetchUser: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/api/admin/get-user");
      const users = response.data;
      set({ user: users });
      console.log(users);
    } catch (error: any) {
      console.log("Error in fetchUser: ", error?.response?.data?.error);
      set({ error: error?.response?.data?.error });
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useUserStore;