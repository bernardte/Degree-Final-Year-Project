import axiosInstance from "@/lib/axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useToast from "./useToast";
import useAuthStore from "@/stores/useAuthStore";

const useHandleLogout = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const logout = useAuthStore((state) => state.logout); 
    const { showToast } = useToast();
    const navigate = useNavigate();

    const handleLogout = async () => {
        setIsLoading(true);
        try {
        const { data } = await axiosInstance.post("/api/users/logout");
        if (data.error) {
            showToast("error", data.error.message);
        } else {
            logout();
            localStorage.removeItem("user");
            showToast("success", data.message);
            navigate("/");
        }
        } catch (error: any) {
            showToast("error", error.message);
        } finally {
            setIsLoading(false);
        }
    };
    return { handleLogout, isLoading };
};

export default useHandleLogout;
