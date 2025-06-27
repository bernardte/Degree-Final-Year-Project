import express from "express";
import statisticControllers from "../controllers/statistic.controller.js";
import protectRoute from "../middleware/protectRoute.js";
import verifyRoles from "../middleware/verifyRoles.js";
const router = express.Router();

router.get("/", protectRoute, verifyRoles, statisticControllers.getStatistic); // Get all statistics
router.get("/booking-trend", protectRoute, verifyRoles, statisticControllers.getBookingTrends);

export default router;