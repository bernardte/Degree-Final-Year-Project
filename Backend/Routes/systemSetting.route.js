import express from "express";
import verifyRoles from "../middleware/verifyRoles.js";
import protectRoute from "../middleware/protectRoute.js";
import systemSettingController from "../controllers/systemSetting.controller.js";
import accessControl from "../middleware/accessControl.js";

const router = express.Router();

//update reward point
router.use(protectRoute, verifyRoles);
router
  .route("/reward-points")
  .put(
    accessControl("rewardPoints", "update"),
    systemSettingController.updateRewardPointSetting
  )
  .get(systemSettingController.getRewardPointSetting);
router
  .route("/getAllRewardHistory")
  .get(systemSettingController.getAllRewardPointHistory);

router.get(
  "/get-hotel-information",
  accessControl("settings", "view"),
  systemSettingController.getHotelInformation
);

//get admin access OTP
router.get(
  "/get-admin-access-otp",
  accessControl("OTP", "view"),
  systemSettingController.getAdminAccessOTP
);

// changeOTP
router.post(
  "/change-otp",
  accessControl("OTP", "update"),
  systemSettingController.changeOTPVerificationCode
);

router.patch(
  "/save-all-settings",
  accessControl("settings", "update"),
  systemSettingController.updateSettings
);

export default router;
