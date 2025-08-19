import axios from "axios";
import useAuthStore from "../stores/useAuthStore";
import { generateSessionId } from "@/utils/generateSessionId";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const token = useAuthStore.getState().token;
      const sessionId = generateSessionId();
      console.log("Interceptor Token:", token);
      console.log("Interceptor Session ID:", sessionId);

      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }

      // Ensure sessionId is always set in headers for all requests
      config.headers["x-session-id"] = sessionId;

      // default to application/json if not set
      if (!config.headers["Content-Type"]) {
        config.headers["Content-Type"] = "application/json";
      }
    } catch (error) {
      console.warn("Error in request interceptor:", error);
    }

    console.log("Sending request with config:", config);
    return config;
  },
  (error) => {
    console.error("Interceptor Request Error:", error);
    return Promise.reject(error);
  },
);

export default axiosInstance;
