import axios from "axios";
import useAuthStore from "../stores/useAuthStore";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const token = useAuthStore.getState().token;
      console.log("Interceptor Token:", token);

      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }

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
