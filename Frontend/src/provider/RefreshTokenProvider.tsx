// Sample for refresh token provider, duplicate with auth provider, with same features to refresh token

import React from "react";
import useAuthStore from "@/stores/useAuthStore";
import axiosInstance from "@/lib/axios";
import { ReactNode, useEffect } from "react";
import { Loader2 } from "lucide-react";

const RefreshTokenProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { login, logout, setAuthLoading, isAuthLoading } = useAuthStore();

  useEffect(() => {
    const refreshToken = async () => {
      setAuthLoading(true);
      try {
        const response = await axiosInstance.post(
          "/api/refreshToken/refresh-token",
          {},
          { withCredentials: true },
        );
        const { token, user } = response.data;
        console.log("response: ", response.data.token);
        console.log("Token refreshed successfully:", token);
        console.log("User data:", user);
        login(user, token, user.role, user.profilePic);
      } catch (error) {
        console.error("Error refreshing token:", error);
        logout();
      } finally {
        setAuthLoading(false);
      }
    };

    refreshToken();
  }, [login, logout, setAuthLoading]);

  if(isAuthLoading){
    return(
      <div className="flex mx-auto items-center">
        <Loader2 size={50} className="text-blue-600 animate-spin"/>
      </div>
    )
  }

  return <>{children}</>;
};

export default RefreshTokenProvider;
