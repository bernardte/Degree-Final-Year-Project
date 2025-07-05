import Notification from "../models/notification.model.js";
import { getIO, getUserMap } from "../config/socket.js";

/**
 * @param {Array<mongoose.Types.ObjectId>} userIds - Array of users IDs to notify;
 * @param {String} message - the message to send;
 * @param {String} type - Notification type (e.g., message, type = "system", "user", "room", "booking", "facility");
 */

const notifyUsers = async(userIds, message, type = "system") => {
    const io = getIO();
    const userMap = getUserMap();
    for (const userId of userIds){
        const stringifiedUserId = userId.toString();//! consistent with map key of string(userId)
        const socketId = userMap.get(`user:${stringifiedUserId}`); //login user
        console.log("your socketId: ", socketId);

        if (socketId) {
          const notification = new Notification({
            userId,
            message,
            type,
            isRead: false,
          });
          await notification.save();

          // Emit to connected socket if exists
          if (socketId) {
            io.to(socketId).emit('new-notification', notification);
          }
        }
    };
};

export default notifyUsers;