import cron from "node-cron";
import Booking from "../models/booking.model.js";
import Room from "../models/room.model.js";
import mongoose from "mongoose";

const bookingStatusUpdater = cron.schedule(
  "*/15 * * * *",
  async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today (00:00)

    try {
      // Find bookings to update
      const bookingsToComplete = await Booking.find({
        endDate: { $lt: today },
        status: "confirmed",
      }).select("_id");

      if (bookingsToComplete.length === 0) {
        console.log("No bookings to update.");
        return;
      }

      const bookingIds = bookingsToComplete.map((b) => b._id);

      // Update booking statuses
      const updateResult = await Booking.updateMany(
        { _id: { $in: bookingIds } },
        { $set: { status: "completed" } }
      );

      console.log(
        `Bookings updated to Completed: ${updateResult.modifiedCount}`
      );

      // Remove these booking IDs from the corresponding room's bookings array
      const roomUpdateResult = await Room.updateMany(
        { bookings: { $in: bookingIds } },
        { $pull: { bookings: { $in: bookingIds } } }
      );

      console.log(
        `Rooms updated by removing completed bookings: ${roomUpdateResult.modifiedCount}`
      );
    } catch (error) {
      console.error(
        "Error in crontab with update booking status and room cleanup:",
        error.message
      );
    }
  },
  {
    schedule: true,
    timezone: "Asia/Kuala_Lumpur",
  }
);

export default bookingStatusUpdater;
