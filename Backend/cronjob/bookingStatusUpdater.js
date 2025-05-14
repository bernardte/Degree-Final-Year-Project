import cron from "node-cron";
import Booking from "../models/booking.model.js";


const bookingStatusUpdater = cron.schedule("0 0 * * *", async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); 

    try{
        const result = await Booking.updateMany(
          { endDate: { $lt: today }, status: { $ne: "completed" } },
          { $set: { status: "completed" } }
        );
        console.log(`Bookings updated to Completed: ${result.modifiedCount}`);
    }catch(error){
        console.log("Error in crontab with update booking status: ", error.message)
    }
});

export default bookingStatusUpdater;