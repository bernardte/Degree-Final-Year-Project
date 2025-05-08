import express from "express";
import bookingControllers from "../controllers/booking.controller.js";
import protectRoute from "../middleware/protectRoute.js";
import accessControl from "../middleware/accessControl.js";
const router = express.Router();

router.post("/create-booking", bookingControllers.createBooking); // Create a new booking
router.post("/create-booking-session", bookingControllers.createBookingSession); // Create a booking session
router.get("/get-booking-session/:sessionId", bookingControllers.getBookingSession); // Create a new booking
router.get("/get-user-booking", protectRoute, accessControl("booking", "view_own"), bookingControllers.getBookingByUser);

export default router;