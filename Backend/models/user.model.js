import mongoose from "mongoose";

const usersSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ["admin", "user", "superAdmin", "bot"],
      default: "user",
    },
    isOTPVerified: {
      type: Boolean,
      default: false,
    },
    loyaltyTier: {
      type: String,
      enum: ["bronze", "silver", "gold", "platinum"],
      default: "bronze",
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    profilePic: {
      type: String,
      default: "",
      required: false,
    },
    rewardPoints: {
      type: Number,
      default: 0,
    },
    totalSpent: {
      type: Number,
      default: 0,
    },
    isOnline: {
      type: Boolean,
      default: 0, 
    },
  },
  { timestamps: true }
);

const User = mongoose.model("user", usersSchema);

export default User;