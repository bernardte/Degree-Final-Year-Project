import express from "express";
import statisticControllers from "../controllers/statistic.controller.js";
import protectRoute from "../middleware/protectRoute.js";
import verifyAdmin from "../middleware/verifyAdmin.js";
const router = express.Router();

router.get("/",protectRoute, verifyAdmin, statisticControllers.getStatistic); // Get all statistics

export default router;