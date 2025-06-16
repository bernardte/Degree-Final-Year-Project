import axiosInstance from "@/lib/axios";
import { useState } from "react";
import useToast from "./useToast";

const useRequest = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { showToast } = useToast();

  const request = async (
    method: "get" | "post" | "put" | "patch" | "delete",
    url: string,
    data: any = {}, // optional for GET/DELETE
    config = {},
    message: string,
    action: "success" | "error" | "warn" | "info",
  ) => {
    setIsLoading(true);

    try {
      const response = await axiosInstance.request({
        method,
        url: "/api" + url,
        data,
        ...config,
      });

      if (response?.data) {
        showToast(action, message);
        return response.data;
      }
    } catch (error: any) {
      const errorMsg =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Request failed";

      if (errorMsg.includes("Access denied")) {
        showToast("warn", errorMsg);
      } else {
        showToast("error", errorMsg);
      }
    } finally {
      setIsLoading(false);
    }

    return null;
  };

  return {
    request,
    isLoading,
  };
};

export default useRequest;
