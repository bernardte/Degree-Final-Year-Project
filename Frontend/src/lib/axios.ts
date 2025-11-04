import axios from "axios";
import useAuthStore from "../stores/useAuthStore";
import { generateSessionId } from "@/utils/generateSessionId";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
});

// ✅ Separate axios instance for refresh
const refreshAxios = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// =======================
// Request Interceptor
// =======================
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = useAuthStore.getState().token;
    const sessionId = generateSessionId();

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    config.headers["x-session-id"] = sessionId;
    if (!config.headers["Content-Type"]) {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// =======================
// Response Interceptor
// =======================
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // ✅ Skip if refresh request itself fails
    if (originalRequest.url?.includes("/api/refreshToken/refresh-token")) {
      return Promise.reject(error);
    }

    // ✅ If unauthorized and not retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject): void => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // ✅ Use the separate refreshAxios instance
        const response = await refreshAxios.post(
          "/api/refreshToken/refresh-token",
          {},
        );
        const { accessToken, user } = response.data;

        // Update store + headers
        useAuthStore
          .getState()
          .login(user, accessToken, user.role, user.profilePic);
        axiosInstance.defaults.headers.common["Authorization"] =
          `Bearer ${accessToken}`;
        processQueue(null, accessToken);

        // Retry the original request
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
