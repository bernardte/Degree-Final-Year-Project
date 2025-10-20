import React, { useEffect, useState, ReactNode } from "react";
import useAuthStore from "@/stores/useAuthStore";
import axiosInstance from "@/lib/axios";
import { Loader } from "lucide-react";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  exp: number;
}

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

  const isTokenExpiringSoon = (token: string): boolean => {
    try {
      const decodedToken: any = jwtDecode<JwtPayload>(token);
      const currentTime = Math.floor(Date.now() / 1000); // in seconds
      const remainingTime = decodedToken.exp - currentTime; 
      return remainingTime < 300; //Less than 5 minute
    } catch (error) {
      return true;
    }
  } 

  const refreshToken = async () => {
      try {
        const response = await axiosInstance.post(
          "/api/refreshToken/refresh-token",
          {},
          { withCredentials: true },
        );

        const { accessToken, user } = response.data;
        login(user, accessToken, user.role, user.profilePic);
        updateAxiosHeader(accessToken);
        return accessToken;
      } catch (error) {
        console.error("Error refreshing token:", error);
        logout();
        updateAxiosHeader(null);
        return null;
      } 
  }

  useEffect(() => {
    const initAuth = async () => {
      setAuthLoading(true);
      await refreshToken();
      setIsChecking(false);
      setAuthLoading(false);
    }

    initAuth();
  }, [login, logout, setAuthLoading]);

  // Every 1 minute check token expiry
  useEffect(() => {
    const interval = setInterval(async () => {
      const token = useAuthStore.getState().token;
      if(token && isTokenExpiringSoon(token)){
        await refreshToken();
      }
    }, 60000); // every 1 minute check 1 time
    return () => {
      clearInterval(interval);
    } 
  }, [])

  

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
