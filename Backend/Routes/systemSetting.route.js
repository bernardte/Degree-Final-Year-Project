import express from "express";
import verifyRoles from "../middleware/verifyRoles.js";
import protectRoute from "../middleware/protectRoute.js";
import systemSettingController from "../controllers/systemSetting.controller.js";
import accessControl from "../middleware/accessControl.js";

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

router.patch(
  "/save-all-settings",
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
    accessControl("reports", "generate"),
    systemSettingController.generateReport
  )
  .delete(
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
  accessControl("suspiciousEvent", "update"),
  systemSettingController.updateMarkAsSolved
);

// carousel
router
  .route("/carousel")
  .get(accessControl("settings", "view"), systemSettingController.fetchCarousel)
  .post(
    accessControl("settings", "create_carousel"),
    systemSettingController.createCarousel
  );

router
  .route("/carousel/:carouselId")
  .patch(
    accessControl("settings", "update"),
    systemSettingController.updateCarousel
  )
  .delete(
    accessControl("settings", "delete"),
    systemSettingController.deleteCarousel
  );

export default router;
