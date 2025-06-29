import express from "express";
import eventContoller from "../controllers/event.controller.js";
import verifyRoles from "../middleware/verifyRoles.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/event-enquiry", eventContoller.enquireEvents);
router.get("/get-all-event-request-for-calendar-view", protectRoute, verifyRoles, eventContoller.getAllEventRequestForCalendarView)

export default router;