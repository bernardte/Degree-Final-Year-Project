import axios from "axios";
import useAuthStore from "../stores/useAuthStore";
import { generateSessionId } from "@/utils/generateSessionId";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: any [] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if(error){
      prom.reject(error);
    }else{
      prom.resolve(token);
    }
  });

  failedQueue = [];
}

// request interceptor to add Authorization header and sessionId
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

// response interceptor to handle 401 errors and token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if(error.response?.status === 401 && !originalRequest._retry){
      if(isRefreshing){

        //! if refreshToken request is already in progress, queue the requests, 
        //! wait for the new refresh access token and retry the original request again after received it. 
        return new Promise((resolve, reject): void => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers["Authorization"] = `Bearer ${token}`;
          return axiosInstance(originalRequest)
        }).catch((error) => Promise.reject(error));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axiosInstance.post(
          "/api/refreshToken/refresh-token",
          {},
          { withCredentials: true },
        )
        const { accessToken, user } = response.data;
        useAuthStore.getState().login(user, accessToken, user.role, user.profilePic);
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
        processQueue(null, accessToken);
        return axiosInstance(originalRequest);
      } catch(error){
        processQueue(error, null);
        useAuthStore.getState().logout();
        return Promise.reject(error);
      }finally{
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
)

export default axiosInstance;
