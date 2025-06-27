import express from "express";
import rewardController from "../controllers/reward.controller.js";
import verifyRoles from "../middleware/verifyRoles.js";
import protectRoute from "../middleware/protectRoute.js";
import accessControl from "../middleware/accessControl.js";

const router = express.Router();

router
  .route("/rewards")
  .post(
    protectRoute,
    verifyRoles,
    accessControl("rewardPoints", "create"),
    rewardController.addReward
  )
  .get(protectRoute, rewardController.fetchRewardList);
router
  .route("/rewards/:rewardId")
  .delete(
    protectRoute,
    verifyRoles,
    accessControl("rewardPoints", "delete"),
    rewardController.deleteReward
  )
  .patch(
    protectRoute,
    verifyRoles,
    accessControl("rewardPoints", "update"),
    rewardController.editReward
  );
router
  .route("/reward-claim/:rewardId")
  .post(protectRoute, rewardController.claimReward);
router
  .route("/show-user-claimed-reward")
  .get(protectRoute, rewardController.getUserClaimedReward);
router
  .route("/show-user-all-reward")
  .get(protectRoute, rewardController.showAllRewardForUser);

router.route("/update-reward-status/:rewardId").patch(protectRoute, rewardController.handleUpdateRewardStatus);
router.route("/reward-code-used").post(protectRoute, rewardController.applyRewardCode);
router.route("/remove-reward-code").post(protectRoute, rewardController.removeApplyRewardCode);
export default router;
