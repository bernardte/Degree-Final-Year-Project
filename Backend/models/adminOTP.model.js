import mongoose from "mongoose";

const adminOTPSchema = mongoose.Schema(
  {
    superAdminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    otpCode: {
        type: String,
        required: true
    },

  },
  { timestamps: true }
);

const OTP = mongoose.model("OTP", adminOTPSchema);

export default OTP;
