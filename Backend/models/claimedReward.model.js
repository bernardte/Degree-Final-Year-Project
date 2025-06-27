import mongoose from "mongoose";

const ClaimedRewardSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  reward: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "reward",
  },
  rewardCode: {
    type: String,
    unique: true
  },
  discountPercentage: {
    type: Number,
    default: null,
  },
  redeemedAt: {
    type: Date,
    default: Date.now,
  },
  expiredAt: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "used", "expired"],
    default: "active",
  },
});

const ClaimedReward = mongoose.model("ClaimedReward", ClaimedRewardSchema);

export default ClaimedReward;