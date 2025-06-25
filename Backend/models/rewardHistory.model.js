import mongoose from "mongoose";

const rewardHistorySchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "booking",
      required: false,
    },
    bookingReference: {
      type: String,
      required: false,
    },
    points: {
      type: Number,
      default: 0,
      required: true,
    },
    description: {
      type: String,
    },
    type: {
      type: String,
      enum: ["redeem", "earn", "tier-upgrade"],
      required: true,
    },
    source: {
      type: String,
      enum: ["booking", "redemption", "loyalty", "others"],
      required: true,
    },
  },
  { timestamps: true }
);

const RewardHistory = mongoose.model("RewardHistory", rewardHistorySchema);

export default RewardHistory;