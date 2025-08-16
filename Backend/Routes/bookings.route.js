import express from "express";
import bookingControllers from "../controllers/booking.controller.js";
import protectRoute from "../middleware/protectRoute.js";
import accessControl from "../middleware/accessControl.js";
import verifyRoles from "../middleware/verifyRoles.js";
const router = express.Router();
router.post("/create-booking", bookingControllers.createBooking); // Create a new booking
router.post("/create-booking-session", bookingControllers.createBookingSession); // Create a booking session
router.post("/cancel-booking", bookingControllers.cancelBooking); // Cancel a booking
router.get("/get-booking-session/:sessionId", bookingControllers.getBookingSession); // Create a new booking
router.get("/get-booking-session-by-user", protectRoute, bookingControllers.getBookingSessionByUser); // Get booking session by user
router.delete("/delete-booking-session/:sessionId", bookingControllers.deleteBookingSession);//delete booking session
router.delete(
  "/:sessionId/remove-room/:roomId",
  bookingControllers.removeRoomFromBookingSession
);//delete booking session
router.get("/get-user-booking", protectRoute, bookingControllers.getBookingByUser);

//delete cancel booking request
router.delete(
  "/deleteAllCancellationBookingRequest", protectRoute, verifyRoles,
  accessControl("booking", "cancel_any"),
  bookingControllers.handleDeleteAllCancelled
);

router.patch("/update-breakfast-count/:sessionId", bookingControllers.handleUpdateBreakfastCount);
export default router;