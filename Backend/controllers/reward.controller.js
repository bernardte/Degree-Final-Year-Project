import Reward from "../models/reward.model.js";
import ClaimedReward from "../models/claimedReward.model.js";
import RewardHistory from "../models/rewardHistory.model.js";
import User from "../models/user.model.js";
import notifyUsers from "../utils/notificationSender.js";
import { generateRewardCode } from "../logic function/generateRewardCode.js";
import SystemSetting from "../models/systemSetting.model.js";

const addReward = async (req, res) => {
  const reward = req.body;

  const { name, description, points, category, status, icon, discountPercentage } = reward;

  if (!name || !description || !points || !category || !status || !icon) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if(points <= 0){
    return res.status(400).json({ error: "Points must be greater than 0" });
  }

  try {
    const existingReward = await Reward.findOne({ name });
    if (existingReward) {
      return res.status(400).json({ error: "Reward already exists" });
    }
    const newReward = new Reward({
      name,
      description,
      discountPercentage,
      points,
      category,
      status,
      icon,
    });
    await newReward.save();

    //* notify all admins
    const allAdmins = await User.find({
      role: { $in: ["admin", "superAdmin"] },
    });
    const adminIds = allAdmins.map((admin) => admin._id);
    await notifyUsers(adminIds, `New reward comming ${name}`, "reward");

    res.status(201).json(newReward);
  } catch (error) {
    console.log("Error in addReward: ", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const fetchRewardList = async (req, res) => {
  try {
    const reward = await Reward.find().sort({ createdAt: -1 });
    res.status(200).json(reward);
  } catch (error) {
    console.log("Error in fetchRewardList: ", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteReward = async (req, res) => {
  const { rewardId } = req.params;
  const user = req.user;
  try {
    const reward = await Reward.findByIdAndDelete(rewardId);
    if (!reward) {
      return res.status(404).json({ error: "Reward not found" });
    }

    //* notify all admins 
    const allAdmins = await User.find({
      role: { $in: ["admin", "superAdmin"] },
    });
    const adminIds = allAdmins.map((admin) => admin._id);
    await notifyUsers(
      adminIds,
      `Existing reward ${reward.name}, have been deleted by ${user.name}`,
      "reward"
    );
    
    res.status(200).json({ message: "Reward deleted successfully" });
  } catch (error) {
    console.log("Error in deleteReward: ", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const editReward = async (req, res) => {
  const { rewardId } = req.params;
  const {
    name,
    description,
    points,
    category,
    status,
    icon,
    discountPercentage,
  } = req.body;

  console.log("request body: ", req.body)
  try {
    const reward = await Reward.findById(rewardId);
    if (!reward) {
      return res.status(404).json({ error: "Reward Not Found" });
    }

    // Check if name is changed and already exists in another document
    if (name && name !== reward.name) {
      const existingReward = await Reward.findOne({
        name,
        _id: { $ne: rewardId },
      });
      if (existingReward) {
        return res
          .status(400)
          .json({ error: "A reward with this name already exists" });
      }
    }

    // Points validation
    if (points && points <= 0) {
      return res
        .status(400)
        .json({ error: "Reward Points must be greater than 0" });
    }

    // Update fields
    reward.name = name || reward.name;
    reward.description = description || reward.description;
    reward.points = points || reward.points;
    reward.category = category || reward.category;
    reward.status = status || reward.status;
    reward.icon = icon || reward.icon;

    // Handle discountPercentage
    if (icon === "Percent") {
      if (discountPercentage == null || discountPercentage <= 0) {
        return res
          .status(400)
          .json({ error: "Discount percentage must be greater than 0" });
      }
      reward.discountPercentage = discountPercentage;
    } else {
      reward.discountPercentage = null;
    }
    

    await reward.save();

    //* notify all admins
    const allAdmins = await User.find({
      role: { $in: ["admin", "superAdmin"] },
    });
    const adminIds = allAdmins.map((admin) => admin._id);
    await notifyUsers(
      adminIds,
      `Existing reward ${name}, have been updated by ${req.user.name}`,
      "reward"
    );

    res.status(200).json(reward);
  } catch (error) {
    console.log("Error in editReward: ", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


const claimReward = async (req, res) => {
  const userId = req.user._id;
  const { rewardId } = req.params;
  try {
    const user = await User.findById({ _id: userId });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const redemptionSetting = await SystemSetting.findOne({
      key: "rewardPointsSetting",
    });
    const minRedemption = redemptionSetting?.value?.minRedeemPoints || 0;
    const maxRedemption = redemptionSetting?.value?.maxRedeemPoints || Infinity;
    const redemptionEnabled =
      redemptionSetting?.value?.redemptionEnabled ?? true;
    
    if (!redemptionEnabled) {
      return res
        .status(400)
        .json({ error: "Reward redemption is currently disabled" });
    }

    if (user.rewardPoints < minRedemption) {
      return res.status(400).json({
        error: `You need at least ${minRedemption} points to redeem rewards.`,
      });
    }
    
    const reward = await Reward.findById(rewardId);
    if (!reward) {
      return res.status(400).json({ error: "Reward not found" });
    }

    //* check reward are claimed previously 
    const rewardBeingClaimed = await ClaimedReward.findOne({
        user: userId,
        reward: rewardId,
        status: "active",
    }).where("expiredAt").gt(new Date());

    if (rewardBeingClaimed) {
        return res.status(400).json({ error: "Reward already claimed" });
    }

    if (reward.status !== "active") {
      return res.status(400).json({ error: "Reward is no longer active" });
    }

    if (user.rewardPoints < reward.points) {
      return res
        .status(400)
        .json({ error: "Not enough reward points to redeem" });
    }

    if (reward.points > maxRedemption) {
      return res.status(400).json({
        error: `Maximum redemption per reward is ${maxRedemption} points.`,
      });
    }

    // Deduct points for user reward points
    user.rewardPoints -= reward.points;
    await user.save();
    const rewardCode = generateRewardCode();

    const claimedReward = new ClaimedReward({
      user: userId,
      reward: reward._id,
      redeemedAt: new Date(),
      rewardCode: rewardCode,
      discountPercentage: reward.discountPercentage,
      expiredAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Reward expires in 30 days
      status: "active",
    });
    await claimedReward.save();
    // Add to reward history to check if user has claimed this reward before
    const updateRewardHistory = new RewardHistory({
        user: userId,
        points: reward.points,
        description: `Redeemed reward: ${reward.name}`,
        type: "redeem",
        source: "redemption",
    })
    await updateRewardHistory.save();

    return res.status(200).json({
      message: "Reward redeemed successfully",
      claimedReward,
      userPoints: user.rewardPoints,
    });
  } catch (error) {
    console.log("Error in claimReward: ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getUserClaimedReward = async (req, res) => {
  const userId = req.user._id;
  try {
    // update reward Status if expired
    await ClaimedReward.updateMany(
      { status: "active", expiredAt: { $lte: new Date() } },
      { $set: { status: "expired" } }
    );

    const claimedRewards = await ClaimedReward.find({ user: userId })
      .populate("reward", "name description points category icon")
      .where("expiredAt").gt(new Date())
      .sort({ redeemedAt: -1 });

    res.status(200).json(claimedRewards);
  } catch (error) {
    console.log("Error in getUserClaimedReward: ", error.message);
  }
}

const showAllRewardForUser = async (req, res) => {
  try {
    const showAllReward = await Reward.find({ status: "active" }).sort({ createdAt: -1 });
    res.status(200).json(showAllReward);
  } catch (error) {
    console.log("Error in showAllRewardForUser: ", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

const handleUpdateRewardStatus = async (req, res) => {
  const { rewardId } = req.params;
  const { status } = req.body;
  try {
    const reward = await ClaimedReward.findById(rewardId).select("status expiredAt");
    if (reward.status === "active") {
      reward.status = status;
      await reward.save();
      const expiredAtFormatted = new Date(reward.expiredAt).toLocaleDateString(
        "en-US",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        }
      );

      return res.status(200).json({ message: `Please used before ${expiredAtFormatted}` });
    }

  } catch (error) {
    console.log("Error in handleUpdateRewardStatus: ", error.message);
    res.status(500).json({ error: "Internal Server Error" })
  }
}

const applyRewardCode = async (req, res) => {
  const { code } = req.body;
  const userId = req.user._id;
  if(!code){
    return res.status(400).json({ error: "Please enter a valid code" });
  }

  try {
    // update reward Status if expired, everytime the reward code being apply.
    await ClaimedReward.updateMany(
      { status: "active", expiredAt: { $lte: new Date() } },
      { $set: { status: "expired" } }
    );

    const claimedReward = await ClaimedReward.findOne({
      rewardCode: code,
      discountPercentage: { $ne: null },
    });

    if (!claimedReward) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid reward code" });
    }

    if (!claimedReward.user.equals(userId)) {
      return res.status(400).json({
        success: false,
        error: "Only the redeem user is able to use this reward",
      });
    }

    // Check if reward is expired
    const now = Date.now();
    if (
      claimedReward.expiredAt &&
      now >= new Date(claimedReward.expiredAt).getTime()
    ) {
      return res
        .status(400)
        .json({ success: false, error: "Reward has expired" });
    }

    if (claimedReward.status !== "active") {
      return res.status(400).json({
        success: false,
        error: "Reward Code is already used.",
      });
    }

    claimedReward.status = "used";
    await claimedReward.save();

    res.status(200).json({
      success: true,
      discount: claimedReward.discountPercentage,
      status: claimedReward.status,
      message: `Reward ${claimedReward.rewardCode} applied successfully`,
    });
  } catch (error) {
    console.log("Error in applyRewardCode:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const removeApplyRewardCode = async (req, res) => {
  const { code } = req.body;
  const userId = req.user._id;

  if (!code) {
    return res
      .status(400)
      .json({ success: false, error: "Reward code is required" });
  }

  try {
    await ClaimedReward.updateMany(
      { status: "active", expiredAt: { $lte: new Date() } },
      { $set: { status: "expired" } }
    );

    const claimedReward = await ClaimedReward.findOne({
      rewardCode: code,
    }).select("user status");
    if (!claimedReward) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid reward code" });
    }

    if (!claimedReward.user.equals(userId)) {
      return res
        .status(400)
        .json({
          success: false,
          error: "Only redeemed reward user able to remove it.",
        });
    }

    claimedReward.status = "active";
    await claimedReward.save();

    return res.status(200).json({
      success: true,
      message: `Reward ${code} has been removed and is now reusable`,
    });
  } catch (error) {
    console.log("Error in removeApplyRewardCode: ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getRewardHistoryForCertainUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 10, type } = req.query;
    const skip = (page - 1) * limit;

    const query = { user: userId };
    if (type && type !== "all") query.type = type;

    const rewardHistory = await RewardHistory.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await RewardHistory.countDocuments(query);

    res.status(200).json({
      rewardHistory: rewardHistory,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    console.log("Error in getRewardHistoryForCertainUser:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export default {
  addReward,
  deleteReward,
  fetchRewardList,
  editReward,
  claimReward,
  getUserClaimedReward,
  showAllRewardForUser,
  handleUpdateRewardStatus,
  applyRewardCode,
  removeApplyRewardCode,
  getRewardHistoryForCertainUser,
};
