import useAuthStore from "@/stores/useAuthStore";
import React from "react";
import { Navigate } from "react-router-dom";

interface RouteProviderProps{
    children: React.ReactNode
}
const RouteProvider = ({ children }: RouteProviderProps) => {

    const { user } = useAuthStore();

    if(!user) return <Navigate to={"/"} replace/>


  return <>{children}</>;
};

export default RouteProvider;
