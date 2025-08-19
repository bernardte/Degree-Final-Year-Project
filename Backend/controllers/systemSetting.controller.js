import RewardHistory from "../models/rewardHistory.model.js";
import SystemSetting from "../models/systemSetting.model.js";
import notifyUsers from "../utils/notificationSender.js";
import User from "../models/user.model.js";
import OTP from "../models/adminOTP.model.js"

const updateRewardPointSetting = async (req, res) => {
    const { settings } = req.body;
    console.log(settings);
    const user = req.user;
    try {
      const Setting = await SystemSetting.findOneAndUpdate(
        { key: "rewardPointsSetting" },
        { value: settings, updatedAt: Date.now() },
        { upsert: true, new: true }
      );

      //* notify all admin
      const allAdmins = await User.find({
        role: { $in: ["admin", "superAdmin"] },
      });
      const adminIds = allAdmins.map((admin) => admin._id);
      console.log("Your Admin: ", adminIds);
      await notifyUsers(
        adminIds,
        `Reward setting have been updated by ${user.name}`,
        "system"
      );

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

//OTP update
const changeOTPVerificationCode = async (req, res) => {
  const { newOTP } = req.body;
  const superAdminId = req.user._id;

  if (!newOTP) {
    return res.status(400).json({ error: "OTP cannot be empty" });
  }

  try {
    const updatedOTP = await OTP.findOneAndUpdate(
      { superAdminId }, //filter
      { otpCode: newOTP }, //update otp
      { new: true, upsert: true } //if not found then create
    );

    //* Notify all admins
    const allAdmins = await User.find({
      role: { $in: ["admin", "superAdmin"] },
    });
    const adminIds = allAdmins.map((admin) => admin._id);

    await notifyUsers(
      adminIds,
      `Admin portal access OTP has been updated to ${newOTP} by ${req.user.name}`,
      "system"
    );

    res.status(200).json({
      message: "OTP updated successfully",
      updatedOTP,
    });
  } catch (error) {
    console.log("Error in changeOTPVerificationCode", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAdminAccessOTP = async (req, res) => {
  const superAdminId = req.user._id;

  try {
    const otp = await OTP.findOne({ superAdminId }).select("otpCode");
    if(!otp){
      return res.status(404).json({ error: "OTP not found" });
    }

    res.status(200).json({
      success: true, 
      accessCode: otp.otpCode,
    })
  } catch (error) {
    console.log("Error in getAdminAccessOTP: ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateSettings = async (req, res) => {
  const { settings, key } = req.body;
  const username = req.user.name;
  if(!settings || !key) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const updatedSetting = await SystemSetting.findOneAndUpdate(
      { key }, // filter by key
      { value: settings, updatedAt: Date.now() }, //update value and timestamp
      { new: true, upsert: true } //upsert: true to create if not exists
    )

    if(!updatedSetting){
      return res.status(404).json({ error: "Settings not found" })
    }

    //* Notify all admins
    const allAdmins = await User.find({
      role: { $in: ["admin", "superAdmin"] },
    });
    const adminIds = allAdmins.map((admin) => admin._id);

    await notifyUsers(
      adminIds,
      `System setting "${key}" has been updated by ${username}`,
      "system"
    );
    res.status(200).json({
      success: true,
      message: "Settings updated successfully",
      updatedSettings: updatedSetting,
    })
  } catch (error) {
    console.log("Error in updatedHotelInformation: ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getHotelInformation = async (req, res) => {
  try {
    const hotelInfo = await SystemSetting.findOne({ key: "Hotel Information"}).select("value");

    if(!hotelInfo){
      return res.status(404).json({ error: "Hotel information not found" });
    }

    res.status(200).json({
      success: true,
      hotelInformation: hotelInfo.value
    })
  
  } catch (error) {
    console.log("Error in getHotelInformation: ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
 
export default {
  updateRewardPointSetting,
  getRewardPointSetting,
  changeOTPVerificationCode,
  getAllRewardPointHistory,
  getAdminAccessOTP,
  updateSettings,
  getHotelInformation
};