import axiosInstance from "@/lib/axios";
import Cookies from "js-cookie";

export const getGuestId = async () => {
  try {
    //Check localStorage first
    let fetchGuestId = localStorage.getItem("guestId");

    if (fetchGuestId) {
      return fetchGuestId; // Return existing guestId
    }

    // If it is not available locally, get it from the backend
    const response = await axiosInstance.get("/api/users/initialize-guest");
    const guestId = response?.data?.guestId || Cookies.get("guestId");

    if (!guestId) {
      console.warn("No guestId is available!");
      return null;
    }

    // Store in localStorage to avoid repeated requests
    localStorage.setItem("guestId", guestId);

    return guestId;
  } catch (error: any) {
    console.log("Error in getGuestId: ", error?.response?.data?.message);
    return null;
  }
};
