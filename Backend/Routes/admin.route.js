import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import adminControllers from "../controllers/admin.controller.js";
import verifyRoles from "../middleware/verifyRoles.js";
import accessControl from "../middleware/accessControl.js";
const router = express.Router();

router.use(protectRoute, verifyRoles); // Protect all routes with authentication middleware
// room 
router.post("/add-room", accessControl("rooms", "create_room"),adminControllers.addRoom);
router.put("/update-room/:roomId", accessControl("rooms", "update_room"),adminControllers.updateRoom);
router.delete("/delete-room/:roomId", adminControllers.deleteRoom);

//booking
router.delete("/delete-booking/:bookingId", accessControl("booking", "cancel_any"),adminControllers.deleteBooking); // Delete a booking by ID
router.get("/get-all-bookings", accessControl("booking", "view_all"), adminControllers.getAllBookings); // Get all bookings
router.get("/get-booking-by-user/:userId", accessControl("booking", "view"), adminControllers.getBookingByUserId); // Get all bookings by user ID
router.get(
  "/filterBookings",
  adminControllers.filterBookingsByPaymentStatusAndBookingStatus
); // Filter bookings based on query parameters)
router.get("/filter-available-room", adminControllers.filterAvailableRoomsForAdmin);//filter all available room
router.get("/get-all-enquire-event", accessControl("events", "view_all"), adminControllers.getAllEventsQuery)
router.patch(
  "/update-booking/:bookingId",
  accessControl("booking", "update_booking_status"),
  adminControllers.updateBookingStatus
); // Update booking status by ID
router.patch(
  "/update-paymentStatus",
  accessControl("payments", "update_payment_status"),
  adminControllers.updatePaymentStatus
); // Update payment status by ID

export default router;