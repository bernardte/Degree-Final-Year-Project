import { create } from "zustand";
import { persist, devtools, createJSONStorage } from "zustand/middleware";
import { User } from "@/types/interface.type";
import useBookingStore from "./useBookingStore";

interface authStore {
  isAuthenticated: boolean;
  isAuthLoading: boolean; //for refresh token use purpose
  isAdmin: boolean;
  isAdminVerified: boolean;
  showLoginPopup: boolean;
  showSignupPopup: boolean;
  user: User | null;
  token: string | null;
  roles: string | null;
  setIsAuthenticated: (authentication: boolean) => void;
  setAuthLoading: (loading: boolean) => void;
  setIsAdminVerified: (verification: boolean) => void;
  setOpenLoginPopup: (open: boolean) => void;
  setOpenSignupPopup: (open: boolean) => void;
  setIsAdmin: (verifyAdmin: boolean) => void;
  login: (user: User, token: string, role: string) => void;
  logout: () => void;
}

const useAuthStore = create<authStore>()(
  devtools(
    persist(
      (set) => ({
        isAuthenticated: false,
        isAdmin: false,
        isAdminVerified: false,
        isAuthLoading: false,
        showLoginPopup: false,
        showSignupPopup: false,
        user: null,
        token: null,
        roles: null,

        setIsAuthenticated: (authentication) =>
          set({ isAuthenticated: authentication }),

        setAuthLoading: (loading) =>
          set({ isAuthLoading: loading }, false, "SET_LOADING"),

        setIsAdminVerified: (verification) => {
          set({ isAdminVerified: verification }, false, "SET_ADMIN_VERIFICATION")
          localStorage.setItem("admin-verified", String(verification));
        },

        setIsAdmin: (verifyAdmin) =>
          set({ isAdmin: verifyAdmin }, false, "SET_ADMIN"),

        login: (user, token, role) => {
          console.log("user", user);
          console.log("role", role);
          set(
            { user, token, isAuthenticated: true, roles: role },
            false,
            "LOGIN",
          );
          // Clear bookings state
          useBookingStore.getState().clearBookingInformation();
        },

        logout: () => {
          // Reset the in-memory Zustand state
          set(
            {
              user: null,
              token: null,
              roles: null,
              isAuthenticated: false,
              isAdmin: false,
              showLoginPopup: false,
              showSignupPopup: false,
            },
            false,
            "LOGOUT",
          );
          // Clear bookings state
          useBookingStore.getState().clearBookingInformation();
          localStorage.clear();
          // This is more robust to clear the persist local storage state
          //! Remove specific persisted user state (extra safe)
          createJSONStorage(() => localStorage)?.removeItem("user") ??
            Promise.resolve();
        },

        setOpenLoginPopup: (open) =>
          set(
            { showLoginPopup: open, showSignupPopup: false },
            false,
            "TOGGLE_LOGIN_POPUP",
          ),

        setOpenSignupPopup: (open) =>
          set(
            { showSignupPopup: open, showLoginPopup: false },
            false,
            "TOGGLE_SIGNUP_POPUP",
          ),
      }),
      {
        name: "user", // <- this becomes "zustand-persist-user"
        partialize: (state) => ({
          user: { username: state.user?.username, email: state.user?.email },
          roles: state.roles,
          isAuthenticated: state.isAuthenticated,
          isAdmin: state.isAdmin,
        }),
      },
    ),
    { name: "user", enabled: false },
  ),
);

export default useAuthStore;
