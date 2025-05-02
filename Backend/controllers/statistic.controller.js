import RoomAvailability from "../models/roomAvailability.model.js";
import Booking from "../models/booking.model.js";
import User from "../models/user.model.js";
import Room from "../models/room.model.js";

const getStatistic = async (req, res) => {
  try {

    const totalRoom = await Room.countDocuments(); // Total number of rooms
    const roomAvailabilityRecords = await RoomAvailability.countDocuments(); // Total number of available rooms

    const totalUnavailableRooms = roomAvailabilityRecords.reduce(
      (total, record) => {
        return total + record.unavailableRooms.length; // Sum the available rooms from all records
      },
      0
    );

    const totalRoomAvailable = totalRoom - totalUnavailableRooms; // Total available rooms = Total rooms - Unavailable rooms
    
    const [
      totalBooking,
      totalUsers,
      bookingUser,
    ] = await Promise.all([
      Booking.countDocuments(),
      User.countDocuments(),
      Booking.distinct("bookingCreatedByUser") // Gets an array of unique user IDs which in booking collection
    ]);

    const totalBookingUser = bookingUser.length; // Count of unique users who made bookings

    res.status(200).json({
      totalBooking,
      totalUsers,
      totalRoom,
      totalRoomAvailable,
      totalBookingUser,
    });
  } catch (error) {
    console.log("Error in getStatistic: ", error.message);
    res.status(500).json({ error: error.message });
  }
};

export default {
  getStatistic,
};
