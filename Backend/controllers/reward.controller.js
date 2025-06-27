import Reward from "../models/reward.model.js";
import ClaimedReward from "../models/claimedReward.model.js";
import RewardHistory from "../models/rewardHistory.model.js";
import User from "../models/user.model.js";
import { generateRewardCode } from "../logic function/generateRewardCode.js";
import mongoose from "mongoose";

const addReward = async (req, res) => {
  const reward = req.body;
  console.log(reward);
  if (!reward) {
    return res.status(400).json({ error: "All field are required" });
  }

  const { name, description, points, category, status, icon, discountPercentage } = reward;

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
    console.log("Error in addReward: ", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteReward = async (req, res) => {
  const { rewardId } = req.params;
  try {
    const reward = await Reward.deleteOne({ _id: rewardId });
    if (!reward) {
      return res.status(404).json({ error: "Reward not found" });
    }
    
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
    if (icon !== "Percent") {
      reward.discountPercentage = null;
    }else{
      reward.discountPercentage = discountPercentage;
    }

    await reward.save();
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
    const rewardBeingClaimed = await ClaimedReward.findOne({
        user: userId,
        reward: rewardId,
        status: "active",
    }).where("expiredAt").gt(new Date());
    if (rewardBeingClaimed) {
        return res.status(400).json({ error: "Reward already claimed" });
    }
    const reward = await Reward.findById(rewardId);
    if (!reward) {
      return res.status(400).json({ error: "Reward not found" });
    }
    if (user.rewardPoints < reward.points) {
      return res
        .status(400)
        .json({ error: "Not enough reward points to redeem" });
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
    const reward = await ClaimedReward.findById({_id: rewardId}).select("status expiredAt");
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
    console.log("Error in remodeRewardCode: ", error.message);
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
};
