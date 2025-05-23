import cron from "node-cron";
import Booking from "../models/booking.model.js";


const bookingStatusUpdater = cron.schedule(
  "0 0 * * *",
  async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to start of the day (00:00)

    try {
      const result = await Booking.updateMany(
        { endDate: { $lt: today }, status: "confirmed" },
        { $set: { status: "completed" } }
      );
      console.log(`Bookings updated to Completed: ${result.modifiedCount}`);
    } catch (error) {
      console.log(
        "Error in crontab with update booking status: ",
        error.message
      );
    }
  },
  {
    scheduled: true,
    timezone: "Asia/Kuala_Lumpur",
  }
);

export default bookingStatusUpdater;