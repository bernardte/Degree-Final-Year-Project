import express from "express";
import userControllers from "../controllers/user.controller.js"
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/initialize-guest", userControllers.generateGuestId);
router.get("/getUserProfile", protectRoute, userControllers.getUserProfile);
router.get("/getCurrentLoginUser", protectRoute, userControllers.getCurrentLoginUser);
router.get("/getUserRewardPoints", protectRoute, userControllers.getUserRewardPoints);
router.post("/signup", userControllers.signupUser);
router.post("/forget-password-request", userControllers.forgetPasswordRequest);
router.post("/reset-password", userControllers.resetPassword);
router.post("/verify-otp", protectRoute, userControllers.verifyOTP);
router.post("/login", userControllers.loginUser);
router.post("/logout", userControllers.logoutUser);
router.put("/updateProfile/:userId", protectRoute, userControllers.updateUserProfile);
export default router;