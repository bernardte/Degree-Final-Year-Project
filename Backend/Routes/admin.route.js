import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import adminControllers from "../controllers/admin.controller.js";
import verifyAdmin from "../middleware/verifyAdmin.js";
const router = express.Router();

router.use(protectRoute, verifyAdmin); // Protect all routes with authentication middleware
// room 
router.post("/add-room", adminControllers.addRoom);
router.put("/update-room/:roomId", adminControllers.updateRoom);
router.delete("/delete-room/:roomId", adminControllers.deleteRoom);

//booking
router.delete("/delete-booking/:bookingId", adminControllers.deleteBooking); // Delete a booking by ID
router.get("/get-all-bookings", adminControllers.getAllBookings); // Get all bookings
router.get("/get-booking-by-user/:userId", adminControllers.getBookingByUserId); // Get all bookings by user ID
router.get(
  "/filterBookings",
  adminControllers.filterBookingsByPaymentStatusAndBookingStatus
); // Filter bookings based on query parameters)
router.get("/filter-available-room", adminControllers.filterAvailableRoomsForAdmin);//filter all available room 
router.patch("/update-booking/:bookingId", adminControllers.updateBookingStatus); // Update booking status by ID
router.patch("update-paymentStatus", adminControllers.updatePaymentStatus); // Update payment status by ID

export default router;