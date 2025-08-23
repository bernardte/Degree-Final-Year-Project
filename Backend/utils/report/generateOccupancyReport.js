import Booking from "../../models/booking.model.js";
import Room from "../../models/room.model.js";

export const generateOccupancyReport = async (start, end) => {

    const bookedRooms = await Booking.countDocuments({
      startDate: { $lte: end },
      endDate: { $gte: start },
      paymentStatus: { $in: ["paid"] },
      status: { $in: ["confirmed", "pending"] },
    });

    console.log("booked Rooms: ", bookedRooms);

    const totalRooms = await Room.countDocuments();

    return { 
        bookedRooms,
        totalRooms,
        occupacyRate: ((bookedRooms) / totalRooms * 100).toFixed(2) + "%"
    }
}