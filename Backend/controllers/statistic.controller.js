import Booking from "../models/booking.model.js";
import User from "../models/user.model.js";
import Room from "../models/room.model.js";

const getStatistic = async (req, res) => {
  try {
    const today = new Date(); // Get today's date

    // 1. Get all rooms
    const totalRoom = await Room.find().countDocuments();

    // 2. Get all bookings overlapping with today
    const overlappingBookings = await Booking.find({
      startDate: { $lte: today },
      endDate: { $gte: today },
    });

    console.log(overlappingBookings);

    // 3. Get the IDs of all currently booked rooms
    const bookedRoomIds = overlappingBookings.map((booking) =>
      booking.room.toString()
    );

    console.log(bookedRoomIds);
    const uniqueBookedRoomIds = [...new Set(bookedRoomIds)]; // Remove duplicates

    // 4. Calculate available rooms
    const totalRoomAvailable = totalRoom - uniqueBookedRoomIds.length;

    // 5. Other statistics
    const [totalBooking, totalUsers, revenueResult] = await Promise.all([
      Booking.countDocuments(),
      User.countDocuments(),
      Booking.aggregate([
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$totalPrice" },
            totalRefundAmount: { $sum: { $ifNull: ["$refundAmount", 0] } },
          },
        },
      ]),
    ]);
    const totalRevenue =
      revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;
    const totalRefundAmount = revenueResult[0]?.totalRefundAmount || 0;
    // 6. Respond with statistics
    res.status(200).json({
      totalBooking,
      totalUsers,
      totalRoom,
      totalRoomAvailable,
      totalRevenue,
      totalRefundAmount,
    });
  } catch (error) {
    console.error("Error in getStatistic:", error.message);
    res.status(500).json({ error: error.message });
  }
};
export const getBookingTrends = async (req, res) => {
  try {
    const range = req.query.range || "7d";

    const days =
      {
        "7d": 7,
        "30d": 30,
        "90d": 90,
      }[range] || 7;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

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
              format: "%d %b",//format
              date: {
                $dateTrunc: {
                  date: "$createdAt",
                  unit: "day",
                  timezone: "+08:00",
                },
              },
              timezone: "+08:00",
            },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const formattedTrend = bookingTrend.map((item) => ({
      date: item._id,
      bookings: item.count,
    }));

    res.status(200).json(formattedTrend);
  } catch (error) {
    console.error("Error in getBookingTrends:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export default {
  getStatistic,
  getBookingTrends
};
