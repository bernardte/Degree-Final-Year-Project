import express from "express";
import statisticControllers from "../controllers/statistic.controller.js";
import protectRoute from "../middleware/protectRoute.js";
import verifyRoles from "../middleware/verifyRoles.js";
const router = express.Router();

router.get("/", protectRoute, verifyRoles, statisticControllers.getStatistic); // Get all statistics
router.get("/booking-trend", protectRoute, verifyRoles, statisticControllers.getBookingTrends);//get the trend chart of booking every day
router.get("/most-booking-room-type-chart", protectRoute, verifyRoles, statisticControllers.getRoomTypeNumberofReservation)//get the room type number of reservation
router.get("/room-rating-chart", protectRoute, verifyRoles, statisticControllers.getRatingsDistribution)//get room review distribution
router.get("/booking-status-chart", protectRoute, verifyRoles, statisticControllers.getBookingStatusDistribution)//get booking status distribution

export default router;