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

export default router;
