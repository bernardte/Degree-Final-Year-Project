import Booking from "../models/booking.model.js";
import BookingSession from "../models/BookingSession.model.js";
import Room from "../models/room.model.js";


export const bookingTrends = async (range) => {
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

  return formattedTrend;
}

export const getRoomTypeStats = async () => {
    const stats = await Booking.aggregate([
      //* room in booking schema is an array so need to spread out
      { $unwind: "$room" },

      //* associate room schema
      {
        $lookup: {
          from: "rooms", //! mongodb collection name, mongodb automatically change model to lower case and add plural("s") as the collection name
          localField: "room",
          foreignField: "_id",
          as: "roomInfo",
        },
      },

      // *expand room info to object
      { $unwind: "$roomInfo" },

      {
        $group: {
          _id: "$roomInfo.roomType", //*Group by roomType in the Room table
          count: { $sum: 1 },
        },
      },

      { $sort: { count: -1 } },
    ]);

    return stats;
}

export const ratingDistribution = async () => {
    const stats = await Room.aggregate([
      { $unwind: "$reviews" },
      {
        $group: {
          _id: "$reviews.rating",
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: -1 } },
    ]);

    return stats;
}

export const bookingStatusDistribution = async () => {
    const stats = await Booking.aggregate([
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 },
            },
        },
        { $sort: { count: -1 } },
    ]);
    return  stats;
}

export const bookingSessionUpdate = async () => {
  const bookingSession = await BookingSession.find().populate([
    { path: "roomId", select: "roomName" },
    { path: "userId", select: "username email profilePic" },
  ])

  return bookingSession;
}
