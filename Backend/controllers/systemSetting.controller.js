import RewardHistory from "../models/rewardHistory.model.js";
import SystemSetting from "../models/systemSetting.model.js";
import notifyUsers from "../utils/notificationSender.js";
import User from "../models/user.model.js";
import OTP from "../models/adminOTP.model.js";
import ActivityLog from "../models/activityLog.model.js";
import { actionMap } from "../utils/constant/ActivityMap.js";
import { generateOccupancyReport } from "../utils/report/generateOccupancyReport.js"
import { generaterRevenueReport } from "../utils/report/generateRevenueReport.js";
import { generateFinancialReport } from "../utils/report/generateFinancialReport.js";
import { generateCancellationReport } from "../utils/report/generateCancellationReport.js";
import Report from "../models/report.model.js";

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
};

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
};
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

  if (newOTP.length < 6) {
    return res
      .status(400)
      .json({ error: "Access code required at least 6 digits! " });
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
  try {
    const otp = await OTP.findOne().select("otpCode");
    if (!otp) {
      return res.status(404).json({ error: "OTP not found" });
    }

    res.status(200).json({
      success: true,
      accessCode: otp.otpCode,
    });
  } catch (error) {
    console.log("Error in getAdminAccessOTP: ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateSettings = async (req, res) => {
  const { settings, key } = req.body;
  const username = req.user.name;
  if (!settings || !key) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const updatedSetting = await SystemSetting.findOneAndUpdate(
      { key }, // filter by key
      { value: settings, updatedAt: Date.now() }, //update value and timestamp
      { new: true, upsert: true } //upsert: true to create if not exists
    );

    if (!updatedSetting) {
      return res.status(404).json({ error: "Settings not found" });
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
    });
  } catch (error) {
    console.log("Error in updatedHotelInformation: ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getHotelInformation = async (req, res) => {
  try {
    const hotelInfo = await SystemSetting.findOne({
      key: "Hotel Information",
    }).select("value");

    if (!hotelInfo) {
      return res.status(404).json({ error: "Hotel information not found" });
    }

    res.status(200).json({
      success: true,
      hotelInformation: hotelInfo.value,
    });
  } catch (error) {
    console.log("Error in getHotelInformation: ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const activityStreamFetching = async (req, res) => {
  //? setup SSE headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  //* Save set already send activityId
  const sentIds = new Set();
  //Use MongoDB Change Stream to monitor ActivityLog table changes
  const changeStream = ActivityLog.watch([], { fullDocument: "updateLookup" });

  changeStream.on("change", (change) => {
    if (change.operationType === "insert") {
      const newActivity = change.fullDocument;

      //* Determine whether the action is in the actionMap，is in it return to the frontend
      if (
        Object.values(actionMap).includes(newActivity.action) &&
        !sentIds.has(newActivity._id.toString())
      ) {
        res.write(`data: ${JSON.stringify(newActivity)}\n\n`);
        sentIds.add(newActivity._id.toString());
      }
    }
  });

  req.on("close", () => {
    changeStream.close();
  });
};

const getUserActivityTracking = async (req, res) => {
  try {
    const { type, role, startDate, endDate } = req.query;
    console.log("your role: ", role);

    let { limit, page } = req.query;
    limit = parseInt(limit) || 10;
    page = parseInt(page) || 1;
    const query = {};
    if (role) query.userRole = role;
    if (type) query.type = type;

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    query.action = { $in: Object.values(actionMap) }; //! Only return records in actionMap

    const skip = (page - 1) * limit;

    const activities = await ActivityLog.find(query)
      .populate("userId", "username")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await ActivityLog.countDocuments(query);

    return res.status(200).json({
      success: true,
      data: activities,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.log("Error in fetching user activity: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const generateReport = async (req, res) => {
  const { type, startDate, endDate } = req.body;

  console.log(req.body);
  if (!type || !startDate || !endDate) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    let reportData = {};
    const start = new Date(startDate);
    const end = new Date(endDate);

    switch (type) {
      case "occupancy":
        reportData = await generateOccupancyReport(start, end);
        break;
      case "revenue":
        reportData = await generaterRevenueReport(start, end);
        break;

      case "financial":
        reportData = await generateFinancialReport(start, end);
        break;
      case "cancellation":
        reportData = await generateCancellationReport(start, end);
        break;

      default:
       return res.status(404).json({ error: "Unable to generate report" });
    }

    const formatDate = (date) =>
      date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });


    const newReport = new Report({
      name: `${type} report ${formatDate(start)} - ${formatDate(end)}`,
      type: type,
      dateRange: { startDate: startDate, endDate: endDate },
      data: reportData,
    });

    await newReport.save();

    res
      .status(201)
      .json({ message: "Report generated successfully", report: newReport });
  } catch (error) {
    console.log("Error in fetching user activity: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default {
  updateRewardPointSetting,
  getRewardPointSetting,
  changeOTPVerificationCode,
  getAllRewardPointHistory,
  getAdminAccessOTP,
  updateSettings,
  getHotelInformation,
  getUserActivityTracking,
  activityStreamFetching,
  generateReport,
};
