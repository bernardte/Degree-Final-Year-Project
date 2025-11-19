import User from "../models/user.model.js";
import Room from "../models/room.model.js";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";
import generateTokensAndSetCookies from "../utils/generateTokensAndSetCookies.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";
import OTP from "../models/adminOTP.model.js";
import dotenv from "dotenv";
import SystemSetting from "../models/systemSetting.model.js";
import { sendResetPasswordEmail } from "../utils/reset-password/resetPassword.js";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { generateOTP } from "../utils/generateAdminOTP.js";
import { sendAdminAccessCode } from "../utils/admin access Code/adminAccessCode.js";
import SuspiciousEvent from "../models/suspiciousEvent.model.js";
import ActivityLog from "../models/activityLog.model.js";

dotenv.config();

const getGuestId = (req, res) => {
  const guestId = req.cookies?.guestId;
  console.log(guestId);
  res.json({ guestId });
};

const signupUser = async (req, res) => {
  const { name, username, email, password } = req.body;

   if (
     typeof email !== "string" ||
     typeof password !== "string" ||
     typeof name !== "string" ||
     typeof username !== "string"
   ) {
     console.warn("Signup rejected - invalid types", {
       ip: req.ip,
       body: req.body,
     });
     return res.status(400).json({ error: "Invalid input types" });
   }

  if (!name.trim() || !username.trim() || !email.trim() || !password.trim()) {
    return res.status(400).json({ error: "Please fill in all fields" });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ error: "Password must be at least 6 characters long" });
  }

  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  try {
    const user = await User.findOne({ $or: [{ email }, { username }] });

    if (user) {
      return res.status(400).json({ error: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      name,
      username,
      email,
      password: hashedPassword,
      role: "user",
    });

    await newUser.save();

    if (newUser) {
      generateTokensAndSetCookies(newUser._id, res, newUser.role);
      return res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        username: newUser.username,
        profilePic: newUser.profilePic,
        role: newUser.role,
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error in signup: ", error.message);
  }
};

const forgetPasswordRequest = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(404).json({ error: "Email Required Missing" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({ error: "Invalid Email" });
    }

    const token = jwt.sign(
      { _id: user._id },
      process.env.JWT_RESET_PASSWORD_TOKEN,
      {
        expiresIn: "15m",
      }
    );

    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 15 * 60 * 1000; // 15 minute
    await user.save();

    const hotelInfoDoc = await SystemSetting.findOne({
      key: "Hotel Information",
    }).select("value");

    const hotelDetail = hotelInfoDoc?.value;
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
    sendResetPasswordEmail(email, resetUrl, hotelDetail);
    res.status(200).json({
      message: "Reset Password Link Has Been Send, Please Check Your Own Email",
    });
  } catch (error) {
    console.log("Error in forgetPasswordRequest: ", error.message);
    res.status(500).json({ error: error.message });
  }
};

const resetPassword = async (req, res) => {
  const { newPassword, token } = req.body;

  if (!token || !newPassword) {
    return res
      .status(400)
      .json({ error: "Token and newPassword are required" });
  }

  try {
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_RESET_PASSWORD_TOKEN);
    } catch (error) {
      return res.status(400).json({ error: "Invalid or link are expired" });
    }

    const user = await User.findOne({
      _id: decodedToken._id,
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(404).json({ error: "Invalid or expired reset link" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;

    user.resetToken = "";
    user.resetTokenExpiry = undefined;
    await user.save();

    res.json({ message: "Password has been reset successfully" });
  } catch (error) {
    console.log("Error in resetPassword: ", error.message);
    res.status(500).json({ error: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "email and password are required" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.locals.errorMessage = "User not found!";
      return res.status(400).json({ error: "User not found" });
    }

    if(user.suspended === true){
      res.locals.errorMessage = "Your account has been suspended. Please contact support.";
      return res.status(403).json({ error: "Your account has been suspended."})
    }

    const isAdmin =
      (user.role === "admin" || user.role === "superAdmin") &&
      user.isOTPVerified === true;
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );

    if (!isPasswordCorrect) {
      res.locals.errorMessage = "Invalid username or password";
      return res.status(400).json({ error: "Invalid username or password" });
    }

    const { accessToken } = generateTokensAndSetCookies(
      user._id,
      res,
      user.role,
    );

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      profilePic: user.profilePic,
      role: user.role,
      token: accessToken,
      isAdmin,
    });
  } catch (error) {
    console.log("Error in login: ", error.message);
    res.status(500).json({ error: error.message });
  }
};

const getUserRewardPoints = async (req, res) => {
  const userId = req.user._id;
  try {
    const user = await User.findById({ _id: userId }).select(
      "rewardPoints loyaltyTier totalSpent"
    );
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    return res.status(200).json({
      userPoints: user.rewardPoints,
      userLoyaltyTier: user.loyaltyTier,
      userTotalSpentMoney: user.totalSpent,
    });
  } catch (error) {
    console.log("Error in getUserRewardPoints: ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const logoutUser = (req, res) => {
  const token = req.cookies.accessToken || req.cookies.refreshToken;

  if (!token) {
    return res.status(401).json({ message: "You're not logged in" });
  }

  try {
    res.clearCookie("accessToken", {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      secure: process.env.NODE_ENV === "production",
      expires: new Date(Date.now()),
      maxAge: 1,
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      secure: process.env.NODE_ENV === "production",
      expires: new Date(Date.now()),
      maxAge: 1,
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error in logout: ", error.message);
  }
};

const updateUserProfile = async (req, res) => {
  const { email, username, newPassword, currentPassword } = req.body;
  const { userId } = req.params;
  const logInUserId = req.user._id;
  let profilePic = null;
  // Safely assign profilePic if it exists
  if (req.files && req.files.profilePic) {
    profilePic = req.files.profilePic;
  }

  console.log("Profile Pic:", profilePic); // will be null if no file uploaded
  try {
    let user = await User.findById(logInUserId);
    if (!user) return res.status(400).json({ error: "User not found" });

    if (userId !== logInUserId.toString()) {
      return res
        .status(400)
        .json({ error: "You can only update your own profile" });
    }

    if (newPassword === currentPassword) {
      return res.status(400).json({
        error: "New password must be different from the current password.",
      });
    }

    if (newPassword && newPassword.length < 6) {
      return res
        .status(400)
        .json({ error: "New password must be at least 6 characters long." });
    }

    if (newPassword && currentPassword) {
      const match = await bcrypt.compare(currentPassword, user.password);

      if (!match) {
        return res.status(400).json({ error: "Current password is incorrect" });
      }
    }

    if (profilePic) {
      if (user.profilePic) {
        await cloudinary.uploader.destroy(
          user.profilePic.split("/").pop().split(".")[0]
        );
      }
      console.log("profilePic: ", profilePic);
      const uploadResponse = await uploadToCloudinary(profilePic);
      profilePic = uploadResponse;
      console.log("profilePic: ", profilePic);
    }

    user.email = email || user.email;
    user.username = username || user.username;
    if (newPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
    }

    if (profilePic) {
      user.profilePic = profilePic;
    }

    user = await user.save();

    //* If the user update their profile this will also update with their corresponding comments username
    //* find all rooms that this user comment and update username fields
    //! reviews.$[review] targets each review subdocument that matches the arrayFilter.
    //! arrayFilters: [{ "review.user": user._id }] makes sure only reviews with that user get updated.
    await Room.updateMany(
      { "rewiews.user": user._id },
      {
        $set: {
          "reviews.$[review].username": user.username,
        },
      },
      {
        arrayFilters: [
          {
            "review.user": user._id,
          },
        ],
      }
    );

    return res.status(200).json({
      message: "Profile updated successfully",
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      profilePic: user.profilePic,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error in updateUserProfile: ", error.message);
  }
};

const getCurrentLoginUser = async (req, res) => {
  const userId = req.user._id;
  try {
    const user = await User.findById(userId).select("-password -isOTPVerified");
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.log("Error in getCurrentLoginUser: ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const sendOTPToEmail = async (req, res) => {
  const adminUser = req.user;

  try {
    const otp = generateOTP();
    const salt = await bcrypt.genSalt(10);
    const hashedOTP = await bcrypt.hash(otp, salt);

    //delete old otp, make sure the otp always latest
    // await OTP.deleteMany({ userId: adminUser._id });
    await OTP.create({
      userId: adminUser._id,
      otpCode: hashedOTP,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      attempts: 0,
      maxAttempts: 3,
    });

    const hotelInfo = await SystemSetting.findOne({
      key: "Hotel Information",
    }).select("value");

    if (!hotelInfo) {
      return res.status(404).json({ error: "Hotel information not found" });
    }

    await sendAdminAccessCode(adminUser.email, otp, hotelInfo.value.name);
    res
      .status(200)
      .json({ message: "OTP has send to your email please check." });
  } catch (error) {
    console.log("Error in sendOTPToEmail: ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const verifyOTP = async (req, res) => {
  const { otp } = req.body;
  const loginUserId = req.user._id;
  console.log(otp);

  if (!otp) return res.status(400).json({ error: "OTP are required" });

  try {
    const accessCode = await OTP.findOne({
      userId: loginUserId,
    }).sort({ createdAt: -1 });

    if (!accessCode) {
      return res.status(400).json({ error: "No OTP found" });
    }

    if (new Date() > accessCode.expiresAt) {
      return res.status(400).json({ error: "Access Code expired" });
    }

    if (accessCode.attempts >= accessCode.maxAttempts) {
      return res.status(400).json({
        error: "Too many failed attempts. Please request a new Access Code.",
      });
    }

    const isOTPCorrect = await bcrypt.compare(otp, accessCode.otpCode || "");

    if (!isOTPCorrect) {
      accessCode.attempts += 1;
      await accessCode.save()

      if (accessCode.attempts >= accessCode.maxAttempts) {
        await OTP.deleteMany({ userId: loginUserId });
        await SuspiciousEvent.create({
          userId: loginUserId,
          guestId: "",
          type: "failed multiple attempt time",
          reason: "Admin Access to admin portal with failed multiple time.",
          details: `${req.user.name} failed multiple access time.`,
          severity: low,
          handled: false,
        });
        res.locals.errorMessage = "Failed multiple access time on admin portal.";

        // const activityLog = await 
        return res.status(400).json({
          error:
            "Too many failed attempts. Access Code deleted. Please request a new one.",
        });


      }

      return res.status(400).json({
        error: "Invalid Access Code",
        remainingAttempts: accessCode.maxAttempts - accessCode.attempts,
      });
    }

    accessCode.attempts = 0;
    await accessCode.save();

    const user = await User.findById({ _id: loginUserId });

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    user.isOTPVerified = true;
    await user.save();

    await OTP.deleteMany({ userId: loginUserId });
    res.status(200).json({
      message: "Access Code verified. Welcome to Admin Portal.",
      role: user.role,
    });
  } catch (error) {
    console.log("Error in verifyOTP: ", error.message);
    res.status(500).json({ error: error.message });
  }
};

const getUserProfile = async (req, res) => {
  const logInUserId = req.user._id;
  const user = await User.findById(logInUserId).select(
    "-password -isOTPVerified"
  );
  if (!user) {
    return res.status(400).json({ error: "User not found" });
  }

  return res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    username: user.username,
    profilePic: user.profilePic,
    role: user.role,
  });
};

const generateGuestId = async (req, res) => {
  let guestId = req.cookies.guestId;
  try {
    if (!guestId) {
      guestId = uuidv4();
      res.cookie("guestId", guestId, {
        httpOnly: false,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });
    }
    res.json(guestId);
  } catch (error) {
    console.log("Error in generateGuestId: ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const unauthorizedAccess = async (req, res) => {
  const { guestId, userId, userRole, sessionId } = req.body;
  const ip =
    req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const ua = req.headers["user-agent"] || "";

  try {
    const response = await ActivityLog.create({
      userId: userId || null, 
      guestId: guestId || null,
      userRole: userRole || "guest",
      sessionId: sessionId || null,
      type: "unauthorized_access",
      action: "attempted_access",
      ip,
      ua,
      status: "failed",
      errorMessage: "Unauthorized Access",
    });

    console.log("response data: ", response)

    res.status(403).json({ error: "Unauthorized Access" });
  } catch (error) {
    console.error("Error logging unauthorized access:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export default {
  getGuestId,
  getUserProfile,
  getUserRewardPoints,
  signupUser,
  forgetPasswordRequest,
  resetPassword,
  loginUser,
  logoutUser,
  updateUserProfile,
  sendOTPToEmail,
  verifyOTP,
  getCurrentLoginUser,
  generateGuestId,
  unauthorizedAccess,
};
