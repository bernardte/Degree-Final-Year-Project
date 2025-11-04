import mongoose from "mongoose";

const adminOTPSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    otpCode: {
      type: String,
      required: true,
    },
    expiresAt: { 
      type: Date, 
      required: true 
    },
    attempts: {
      type: Number,
      default: 0
    },
    maxAttempts: {
      type: Number,
      default: 3
    }

  },
  { timestamps: true }
);

const OTP = mongoose.model("OTP", adminOTPSchema);

export default OTP;
