import Booking from "../models/booking.model.js";
import { getIO, getUserMap } from "../config/socket.js";
import { bookingTrends, getRoomTypeStats, ratingDistribution, bookingStatusDistribution } from "../utils/bookingStats.js";

//! get the booking tends daily in real-time
export const emitBookingTrendsUpdate = async (range = "7d") => {
   try {
    const formattedTrend = await bookingTrends(range);
    getIO().emit("booking-trend-update", formattedTrend);
    return formattedTrend;
   } catch (error) {
        console.log("Error in emitBookingTrendsUpdate: ", error.message);
   }
};

//! get the reservation roomtype in real-time
export const emitRoomTypeUpdate = async () => {
  try {
    const stats = await getRoomTypeStats();
    getIO().emit("room-type-update", stats);//emit to frontend
  } catch (error) {
      console.log("Error in emitRoomTypeUpdate: ", error.message);
  }
}

export const emitRoomReviewUpdate = async () => {
  try {
    const stats = await ratingDistribution();
    getIO().emit("room-rating-review", stats);
  }catch(error){
    console.log("Error in emitRoomReviewUpdate: ", error.message);
  }
}

export const emitBookingStatusUpdate = async () => {
  try {
    console.log("reached booking status");
    const stats = await bookingStatusDistribution();
    getIO().emit("booking-status-update", stats);
  } catch(error){
    console.log("Error in emitBookingStatusUpdate: ", error.message);
  }
}

export const emitToSpecificUser = (userId, eventName, data = {}) => {
  if (!userId) return;
  const socketUserMap = getUserMap();
  const userSocket = socketUserMap[userId];
  if (userSocket) {
    getIO().to(userSocket).emit(eventName, data);
  }
};


