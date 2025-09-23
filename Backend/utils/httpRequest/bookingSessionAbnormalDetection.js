import axiosInstance from "../../config/axios.js";
import dotenv from "dotenv"

dotenv.config()
export const bookingSessionAbnormalDetection = async (bookingSession) => {
    try {
        const response = await axiosInstance.post(
          `${process.env.PYTHON_BACKEND_URL_API_REQUEST}/predict`, 
            bookingSession
        );

        console.log("your booking session abnormal: ", response.data)

        return response.data;
    } catch (error) {
        console.log("Error in bookingSessionAbnormalDetection: ", error.message);
    }
}

export const bookingAbnormalDetection = async () => {
    try {
        const response = await axiosInstance.post(
          `${process.env.PYTHON_BACKEND_URL_API_REQUEST}/predict-booking-anomaly`,
        );

        console.log("your booking abnormal: ", response.data);
        return response.data
    } catch (error) {
        console.log("Error in bookingAbnormalDetection: ", error.message);
    }
}