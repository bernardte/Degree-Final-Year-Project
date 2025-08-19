import express from "express";
import userControllers from "../controllers/user.controller.js"
import protectRoute from "../middleware/protectRoute.js";
import { enrichActivityLog } from "../middleware/activityLogger.js";

const router = express.Router();

router.get("/getUserProfile", protectRoute, userControllers.getUserProfile);
router.get("/getCurrentLoginUser", protectRoute, userControllers.getCurrentLoginUser);
router.get("/getUserRewardPoints", protectRoute, enrichActivityLog, userControllers.getUserRewardPoints);
router.post("/signup", userControllers.signupUser);
router.post("/verify-otp", protectRoute, userControllers.verifyOTP);
router.post("/login", userControllers.loginUser);
router.post("/logout", userControllers.logoutUser);
router.put("/updateProfile/:userId", protectRoute, userControllers.updateUserProfile);
export default router;