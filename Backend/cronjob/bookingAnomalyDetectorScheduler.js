import cron from "node-cron"
import { bookingAbnormalDetection } from "../utils/httpRequest/bookingSessionAbnormalDetection.js"
import SuspiciousEvent from "../models/suspiciousEvent.model.js";
import User from "../models/user.model.js";
import Booking from "../models/booking.model.js"
import mongoose  from "mongoose";

const bookingAnomalyDetectorScheduler = cron.schedule("*/30 * * * *", 
    async () => {
        try {
            const results = await bookingAbnormalDetection();
            
            if (!results || results.length === 0){
                return;
            } 

            for(const result of results){
                let user = null;
                let userId = null;
                let booking = null;

                if(result.bookingCreatedByUser){
                    try {
                        userId = new mongoose.Types.ObjectId(
                        result.bookingCreatedByUser
                        );
                        user = await User.findById(userId);
                    } catch (e) {
                        console.warn(
                        "Invalid userId format:",
                        result.bookingCreatedByUser
                        );
                    }
                }

                if(result.bookingReference){
                    booking = await Booking.findOne({
                        bookingReference: result.bookingReference
                    })

                    console.log("your booking: ", booking);
                }

                const reason = `Abnormal Detected on Booking ${
                  result.bookingReference
                } with ${
                  (user && user.username) ||
                  (booking && booking.contactName) ||
                  "Unknown"
                }`;

                await SuspiciousEvent.create({
                 userId: userId,
                 guestId: result.guestId || "",
                 type: "abnormal",
                 reason: reason,
                 details: booking, // booking 里已经有 bookingReference
                 severity: "medium",
                 handled: false,
               });

                booking = null;
                user = null;
                userId = null;
            }
        } catch (error) {
             console.log(
               "Error in crontab with booking anomaly detector: ",
               error.message
             );
        }
    },
    {
        schedule: true,
        timezone: "Asia/Kuala_Lumpur"
    }
);

export default bookingAnomalyDetectorScheduler;