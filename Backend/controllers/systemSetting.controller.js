import RewardHistory from "../models/rewardHistory.model.js";
import SystemSetting from "../models/systemSetting.model.js";
import Notification from "../models/notification.model.js";

const updateRewardPointSetting = async (req, res) => {
    const { settings } = req.body;
    console.log("data", settings);
    try {   
        const Setting = await SystemSetting.findOneAndUpdate(
          { key: "rewardPointsSetting" },
          { value: settings, updatedAt: Date.now() },
          { upsert: true, new: true }
        );

        const notification = new Notification({
          userId: user._id,
          message: `Reward Setting updated`,
          type: "system",
          isRead: false,
        });
        await notification.save();
        getIO().emit("new-notification", notification);

        res.json({ success: true, newData: Setting });
    } catch (error) {
        console.log("Error in updateRewardPointSetting: ", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const getRewardPointSetting = async (req, res) => {
    try {
        const Setting = await SystemSetting.find({
          key: "rewardPointsSetting",
        }).select("value");
        console.log("Setting: ", Setting);
        res.json({ success: true, newData: Setting });
    } catch (error) {
        console.log("Error in getRewardPointSetting: ", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
const getAllRewardPointHistory = async (req, res) => {
  try {
    const history = await RewardHistory.find()
      .populate("user", "username email") // Use the correct field
      .sort({ createdAt: -1 });

    if (!history || history.length === 0) {
      return res.json({ success: false, error: "No data found" });
    }

    res.json({ success: true, history });
  } catch (error) {
    console.log("Error in getAllRewardPoint: ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
  
 
export default {
  updateRewardPointSetting,
  getRewardPointSetting,
  getAllRewardPointHistory,
};