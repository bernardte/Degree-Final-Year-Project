import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";
import generateTokensAndSetCookies from "../utils/generateTokensAndSetCookies.js";
import uploadToCloudinary from "../config/cloudinary.js";

const signupUser = async (req, res) => {
  const { name, username, email, password } = req.body;

  if (!name.trim() || !username.trim() || !email.trim() || !password.trim()) {
    return res.status(400).json({ error: "Please fill in all fields" });
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

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "email and password are required" })
  };
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const isAdmin = user.role === "admin" && user.isOTPVerified === true;

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );

    if (!isPasswordCorrect)
      return res.status(400).json({ error: "Invalid username or password" });

    const { accessToken }= generateTokensAndSetCookies(user._id, res, user.role);

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

const logoutUser = (req, res) => {
  const token = req.cookies.accessToken || req.cookies.refreshToken;

  if(!token){
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

  res.status(200).json({ message: "User logged out successfully" });
} catch (error) {
  res.status(500).json({ error: error.message });
  console.log("Error in logout: ", error.message);
}
};

const updateUserProfile = async (req, res) => {
  const { name, email, username } = req.body;
  const { userId } = req.params;
  let { profilePic } = req.body;

  const logInUserId = req.user._id;
  try {
    let user = await User.findById(logInUserId);
    if (!user) return res.status(400).json({ error: "User not found" });

    if (userId !== logInUserId.toString()) {
      return res
        .status(400)
        .json({ error: "You can only update your own profile" });
    }

    if (profilePic) {
      if (user.profilePic) {
        await cloudinary.uploader.destroy(
          user.profilePic.split("/").pop().split(".")[0]
        );
      }

      const uploadResponse = await uploadToCloudinary(profilePic);
      profilePic = uploadResponse.secure_url;
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.username = username || user.username;
    user.profilePic = profilePic || user.profilePic;

    user = await user.save();

    //TODO: after have room models with "comment" property need to add back here.

    return res.status(200).json({
      message: "Profile updated successfully",
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      profilePic: user.profilePic,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error in updateUserProfile: ", error.message);
  }
};

// TODO: must change otp after have admin controller
const verifyOTP = async (req, res) => {
  const { otp } = req.body;
  const loginUserId = req.user._id
  console.log(otp);
  const tempOTP = process.env.TEMPORARY_OTP;

  if (!otp)
    return res.status(400).json({ error: "OTP are required" });

  // temporary otp
  //check if the otp is valid
  if (otp !== tempOTP) {
    return res.status(400).json({ error: "Invalid OTP" });
  }

  try {
    const user = await User.findById({ _id: loginUserId });

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    user.isOTPVerified = true;
    await user.save();

    res.status(200).json({
        message: "OTP verified Role updated.",
        role: user.role,
    });

  } catch (error) {
    console.log("Error in verifyOTP: ", error.message);
    res.status(500).json({ error: error.message });
  }
};

const getUserProfile = async (req, res) => {
  const logInUserId = req.user._id;
  const user = await User.findById(logInUserId).select("-password");
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

export default {
  getUserProfile,
  signupUser,
  loginUser,
  logoutUser,
  updateUserProfile,
  verifyOTP,
};
