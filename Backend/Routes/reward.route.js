import express from "express";
import rewardContoller from "../controllers/reward.controller.js";
import verifyRoles from "../middleware/verifyRoles.js";
import protectRoute from "../middleware/protectRoute.js";
import accessControl from "../middleware/accessControl.js";

const router = express.Router();
router.use(protectRoute, verifyRoles);
router
  .route("/rewards")
  .post(accessControl("rewardPoints", "create"), rewardContoller.addReward)
  .get(rewardContoller.fetchRewardList);
router
  .route("/rewards/:rewardId")
  .delete(accessControl("rewardPoints", "delete"), rewardContoller.deleteReward)
  .patch(accessControl("rewardPoints", "update"), rewardContoller.editReward)

export default router;
