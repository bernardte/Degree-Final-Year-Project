import Notification from "../models/notification.model.js"

const getAllNotification = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    console.log("Errpr om getAllNotification: ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default {
    getAllNotification,
}