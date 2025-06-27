import React, { useEffect, useState, ReactNode } from "react";
import useAuthStore from "@/stores/useAuthStore";
import axiosInstance from "@/lib/axios";
import { Loader } from "lucide-react";

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { login, logout, setAuthLoading } = useAuthStore();
  const [isChecking, setIsChecking] = useState<boolean>(true);

  const updateAxiosHeader = (token: string | null) => {
    if (token) {
      axiosInstance.defaults.headers.common["Authorization"] =
        `Bearer ${token}`;
    } else {
      delete axiosInstance.defaults.headers.common["Authorization"];
    }
  };

  useEffect(() => {
    const refreshAuth = async () => {
      setAuthLoading(true);
      try {
        const response = await axiosInstance.post(
          "/api/refreshToken/refresh-token",
          {},
          { withCredentials: true },
        );

        const { accessToken, user } = response.data;
        login(user, accessToken, user.role, user.profilePic);
        updateAxiosHeader(accessToken);
      } catch (error) {
        console.error("Error refreshing token:", error);
        logout();
        updateAxiosHeader(null);
      } finally {
        setIsChecking(false);
        setAuthLoading(false);
      }
    };

    refreshAuth();
  }, [login, logout, setAuthLoading]);

  if (isChecking) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader size={36} className="animate-spin text-blue-600" />
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthProvider;
