import Notification from "../models/notification.model.js";

const getAllNotification = async (req, res) => {
  try {
    const userId = req.user._id;
    const notifications = await Notification.find({ userId }).sort({
      createdAt: -1,
    });
    res.status(200).json(notifications);
  } catch (error) {
    console.log("Error in getAllNotification: ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteAllNotification = async (req, res) => {
  const userId = req.user._id;
  try {
    await Notification.deleteMany({ userId: userId});
    res.status(200).json({ message: "Notifications deleted successfully" });
  } catch (error) {
    console.error("Error in delete all notification:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateNotificationReadStatus = async (req, res) => {
  const { notificationId } = req.params;
  const userId = req.user._id;

  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, userId },
      { isRead: true },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }
    return res.status(200).json(notification);
  } catch (error) {
    console.log("Error in updateNotificationReadStatus: ", error.message);
    return res.status(500).json({ error: "Internal Server Error " });
  }
};

const updateNotificationStatusAllAsRead = async (req, res) => {
  try {
    const userId = req.user._id;
    const notification = await Notification.updateMany(
      {
        userId: userId,
        isRead: false,
      },
      {
        $set: {
          isRead: true,
        },
      }
    );
    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }
    return res.status(200).json(notification);
  } catch (error) {
    console.log("Error in updateNotificationStatusAllAsRead: ", error.message);
    return res.status(500).json({ error: "Internal Server Error " });
  }
};

export default {
  getAllNotification,
  deleteAllNotification,
  updateNotificationReadStatus,
  updateNotificationStatusAllAsRead,
};
