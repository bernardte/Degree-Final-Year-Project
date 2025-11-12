import express from "express";
import verifyRoles from "../middleware/verifyRoles.js";
import protectRoute from "../middleware/protectRoute.js";
import systemSettingController from "../controllers/systemSetting.controller.js";
import accessControl from "../middleware/accessControl.js";
import { rateLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.get(
  "/get-all-hotel-information",
  systemSettingController.getHotelInformation
);

router.get(
  "/get-all-carousel",
  systemSettingController.getAllCarousel
);

//update reward point
router.use(rateLimiter("system_global", 30, 60)); // 30 requests per 60 seconds
router.use(protectRoute, verifyRoles);
router
  .route("/reward-points")
  .put(
    rateLimiter("update_reward_points", 10, 60),
    accessControl("rewardPoints", "update"),
    systemSettingController.updateRewardPointSetting
  )
  .get(
    systemSettingController.getRewardPointSetting
  );
router
  .route("/getAllRewardHistory")
  .get(
    systemSettingController.getAllRewardPointHistory
  );

router.get(
  "/get-hotel-information",
  accessControl("settings", "view"),
  systemSettingController.getHotelInformation
);

router.patch(
  "/save-all-settings",
  rateLimiter("update_settings", 10, 60),
  accessControl("settings", "update"),
  systemSettingController.updateSettings
);

router.get(
  "/get-user-activity",
  accessControl("settings", "view_user_activity_tracking"),
  systemSettingController.getUserActivityTracking
);

// fetch data in stream by SSE
router.get(
  "/stream-activity-fetching",
  accessControl("settings", "view_user_activity_tracking"),
  systemSettingController.activityStreamFetching
);

router
  .route("/report")
  .get(
    accessControl("reports", "view"),
    systemSettingController.getAllReportHistory
  )
  .post(
    rateLimiter("generate_report", 5, 60),
    accessControl("reports", "generate"),
    systemSettingController.generateReport
  )
  .delete(
    rateLimiter("delete_reports", 3, 60),
    accessControl("reports", "delete"),
    systemSettingController.deleteAllReports
  );

router.get(
  "/download-report/:reportId",
  accessControl("reports", "download"),
  systemSettingController.reportDownload
);

router.get(
  "/suspicious-event/stream",
  accessControl("suspiciousEvent", "view"),
  systemSettingController.fetchAllSuspiciousEvent
);

router.patch(
  "/suspicious-event-mark-as-solved/:suspiciousEventId",
  rateLimiter("update_suspicious_event", 10, 60),
  accessControl("suspiciousEvent", "update"),
  systemSettingController.updateMarkAsSolved
);

// carousel
router
  .route("/carousel")
  .get(
    accessControl("settings", "view"),
    systemSettingController.fetchCarousel
  )
  .post(
    rateLimiter("create_carousel", 10, 60),
    accessControl("settings", "create_carousel"),
    systemSettingController.createCarousel
  );

router
  .route("/carousel/:carouselId")
  .patch(
    rateLimiter("update_carousel", 10, 60),
    accessControl("settings", "update"),
    systemSettingController.updateCarousel
  )
  .delete(
    rateLimiter("delete_carousel", 3, 60),
    accessControl("settings", "delete"),
    systemSettingController.deleteCarousel
  );

export default router;
