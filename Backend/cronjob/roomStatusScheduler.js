import cron from "node-cron";
import Room from "../models/room.model.js";

const roomStatusScheduler = cron.schedule(
  "*/15 * * * *",
  async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to 00:00:00

    try {
      const result = await Room.updateMany(
        {
          scheduledDeactivationDate: { $lte: today },
          isActivate: true,
        },
        { $set: { isActivate: false } }
      );

      console.log(
        `[Room Deactivation] ${
          result.modifiedCount
        } rooms deactivated at ${today.toISOString()}`
      );
    } catch (error) {
      console.error("[Room Deactivation] Error deactivating rooms:", error);
    }
  },
  {
    scheduled: true,
    timezone: "Asia/Kuala_Lumpur",
  }
);

export default roomStatusScheduler;