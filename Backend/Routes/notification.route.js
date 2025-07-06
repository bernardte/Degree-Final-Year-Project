import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import verifyRole from "../middleware/verifyRoles.js";
import notificationController from "../controllers/notification.controller.js";

const app = express();
const router = express.Router();

router.use(protectRoute, verifyRole);

router
  .route("/")
  .get(notificationController.getAllNotification)

router
  .route("/mark-as-read/:notificationId")
  .patch(notificationController.updateNotificationReadStatus);
router
  .route("/mark-all-as-read")
  .patch(notificationController.updateNotificationStatusAllAsRead);

export default router;
