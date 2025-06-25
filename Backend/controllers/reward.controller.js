import Reward from "../models/reward.model.js";
import ClaimedReward from "../models/claimedReward.model.js";
import RewardHistory from "../models/rewardHistory.model.js";
import User from "../models/user.model.js";

const addReward = async (req, res) => {
  const reward = req.body;
  console.log(reward);
  if (!reward) {
    return res.status(400).json({ error: "All field are required" });
  }

  const { name, description, points, category, status, icon } = reward;

  try {
    const existingReward = await Reward.findOne({ name });
    if (existingReward) {
      return res.status(400).json({ error: "Reward already exists" });
    }
    const newReward = new Reward({
      name,
      description,
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
    if (!reward) {
      return res.status(404).json({ error: "No rewards found" });
    }
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
  const { name, description, points, category, status, icon } = req.body;
  try {
    const reward = await Reward.findById({ _id: rewardId });
    if (!reward) {
      res.status(404).json({ error: "Reward Not Found" });
    }
    reward.name = name || reward.name;
    reward.description = description || reward.description;
    reward.points = points || reward.points;
    reward.category = category || reward.category;
    reward.status = status || reward.status;
    reward.icon = icon || reward.icon;
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

    const claimedReward = new ClaimedReward({
      user: userId,
      reward: reward._id,
      redeemAt: new Date(),
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

export default {
  addReward,
  deleteReward,
  fetchRewardList,
  editReward,
  claimReward,
};
