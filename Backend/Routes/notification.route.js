import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import verifyRole from "../middleware/verifyRoles.js";
import notificationController from "../controllers/notification.controller.js";

const app = express();
const router = express.Router();

app.use(protectRoute, verifyRole);

router.route("/notification").get(notificationController.getAllNotification);

export default router;