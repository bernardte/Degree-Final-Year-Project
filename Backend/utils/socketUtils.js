import Booking from "../models/booking.model.js";
import { getIO } from "../config/socket.js";

export const emitBookingTrendsUpdate = async (range = "7d") => {
   try {
    const dateRange = {
      "7d": 7,
      "30d": 30,
      "90d": 90,
    }[range] || 7;
  
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - dateRange);
  
    const bookingTrend = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%d %b", // format
              date: "$createdAt",
              timezone: "+08:00", // malaysia time
            },
          },
          count: { $sum: 1 },
        },
      },
      // sorted sequence according to date 
      { $sort: { _id: 1 } },
    ]);
  
    const formattedTrend = bookingTrend.map((item) => ({
      date: item._id,
      bookings: item.count,
    }));
  
    getIO().emit("booking-trend-update", formattedTrend);
    return formattedTrend;
   } catch (error) {
        console.log("Error in emitBookingTrendsUpdate: ", error.message);
   }
};

