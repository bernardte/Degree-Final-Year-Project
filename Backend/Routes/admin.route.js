import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import adminControllers from "../controllers/admin.controller.js";
import verifyRoles from "../middleware/verifyRoles.js";
import accessControl from "../middleware/accessControl.js";
const router = express.Router();

router.use(protectRoute, verifyRoles); // Protect all routes with authentication middleware

//users
router.get(
  "/get-user",
  accessControl("users", "view"),
  adminControllers.getUser
);
router.patch(
  "/update-user-role",
  accessControl("assignRole", "update"),
  adminControllers.updateUserRole
);

// changeOTP
router.post(
  "/change-otp",
  accessControl("OTP", "update"),
  adminControllers.changeOTPVerificationCode
);

// room
router.post(
  "/add-room",
  accessControl("rooms", "create_room", "view_all"),
  adminControllers.addRoom
);
router.put(
  "/update-room/:roomId",
  accessControl("rooms", "update_room"),
  adminControllers.updateRoom
);
router.patch(
  "/schedule-deactivation/:roomId",
  accessControl("rooms", "update_room"),
  adminControllers.updateScheduleRoomStatus
);
router.patch(
  "/update-room-status/:roomId",
  accessControl("rooms", "update_room"),
  adminControllers.updateRoomStatus
); //update room status
router.patch(
  "/updateImageGallery/:roomId",
  accessControl("rooms", "update_room"),
  adminControllers.updateImageGallery
);
router.delete(
  "/delete-room-image-gallery/:roomId",
  accessControl("rooms", "delete_room"),
  adminControllers.deleteRoomImageGallery
);
router.delete(
  "/delete-room/:roomId",
  accessControl("rooms", "delete_room"),
  adminControllers.deleteRoom
);

//booking
router.delete(
  "/delete-booking/:bookingId",
  accessControl("booking", "cancel_any"),
  adminControllers.deleteBooking
); // Delete a booking by ID
router.get(
  "/get-all-bookings",
  accessControl("booking", "view_all"),
  adminControllers.getAllBookings
); // Get all bookings
router.get(
  "/get-booking-by-user/:userId",
  accessControl("booking", "view"),
  adminControllers.getBookingByUserId
); // Get all bookings by user ID
router.get(
  "/filterBookings",
  adminControllers.filterBookingsByPaymentStatusAndBookingStatus
); // Filter bookings based on query parameters)
router.get(
  "/filter-available-room",
  adminControllers.filterAvailableRoomsForAdmin
); //filter all available room

router.get(
  "/get-all-cancelled-bookings-request",
  adminControllers.getAllCancelledBookings
); // Get all cancelled bookings
router.get(
  "/get-all-accept-cancelled-bookings-request",
  accessControl("payments", "view_all"),
  adminControllers.getAllAcceptCancelledBookings
); //get accept cancelled bookings
router.patch(
  "/update-cancellation-request/:requestId",
  accessControl("booking", "cancel_any"),
  adminControllers.updateCancellationRequest
); // Update cancellation request status
router.delete(
  "/delete-cancellation-request/:requestId",
  accessControl("booking", "cancel_any"),
  adminControllers.deleteCancellationRequest
); // Delete cancellation request

router.patch(
  "/update-event-status/:eventId",
  accessControl("events", "update_event_status"),
  adminControllers.acceptEvents
);
router.delete(
  "/delete-event-status/:eventId",
  accessControl("events", "reject_event_status"),
  adminControllers.rejectEvents
);
router.get(
  "/get-all-enquire-event",
  accessControl("events", "view_all"),
  adminControllers.getAllEventsQuery
);
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
