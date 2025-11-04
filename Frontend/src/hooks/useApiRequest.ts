import axiosInstance from "@/lib/axios";
import { useState } from "react";
import useToast from "./useToast";

const useRequest = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { showToast } = useToast();

  const request = async (
    method: "get" | "post" | "put" | "patch" | "delete",
    url: string,
    dataOrShowToastDisabled?: any, // can be data or false
    config: any = {},
    message?: string,
    action: "success" | "error" | "warn" | "info" = "success",
    showToastEnabled: boolean = true,
  ) => {
    setIsLoading(true);

    // Handle optional data for GET/DELETE
    const isToastDisabled = dataOrShowToastDisabled === false;
    const data =
      typeof dataOrShowToastDisabled === "object"
        ? dataOrShowToastDisabled
        : {};

    try {
      const response = await axiosInstance.request({
        method,
        url: "/api" + url,
        ...(method === "get" || method === "delete" ? { params: data } : { data }),
        ...config,
      });

      if (response?.data && message && showToastEnabled && !isToastDisabled) {
        showToast(action, message);
      }

      return response.data;
    } catch (error: any) {
      const errorMsg =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Request failed";

        if(errorMsg.includes("Access denied")){
          showToast("warn", errorMsg)
        }else{
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
