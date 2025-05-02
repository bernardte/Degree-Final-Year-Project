import express from "express";
import userControllers from "../controllers/user.controller.js"
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/getUserProfile", protectRoute, userControllers.getUserProfile);
router.post("/signup", userControllers.signupUser);
router.post("/verify-otp", userControllers.verifyOTP);
router.post("/login", userControllers.loginUser);
router.post("/logout", userControllers.logoutUser);
router.put("/updateProfile/:id", protectRoute, userControllers.updateUserProfile);

export default router;