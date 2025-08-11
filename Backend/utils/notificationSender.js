import Notification from "../models/notification.model.js";
import { getIO, getUserMap } from "../config/socket.js";

/**
 * @param {Array<mongoose.Types.ObjectId>} userIds - Array of user IDs to notify;
 * @param {String} message - Notification message;
 * @param {String} type - Notification type (e.g., "system", "room", "booking", "user", "event", "facility")
 */
const notifyUsers = async (userIds, message, type = "system") => {
  const io = getIO();
  const userMap = getUserMap();

  // 1. Create individual documents per user
  const notifications = userIds.map((userId) => ({
    userId,
    message,
    type,
    isRead: false,
  }));
  
  // 2. Insert all at once
  const savedNotifications = await Notification.insertMany(notifications);

  // 3. Emit only to connected users
  for (const notification of savedNotifications) {
    const userId = notification.userId.toString();
    const socketId = userMap.get(`user:${userId}`);
    if (socketId) {
      io.to(socketId).emit("new-notification", notification);
    }
  }
};



export default notifyUsers;
