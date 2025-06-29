import express from "express";
import roomControllers from "../controllers/room.controller.js";
import protectRoute from "../middleware/protectRoute.js"; 
import accessControl from "../middleware/accessControl.js";
import verifyRoles from "../middleware/verifyRoles.js"
const router = express.Router();

router.get("/", roomControllers.paginatedAllRooms);
router.get("/get-all-rooms", roomControllers.getAllRooms);
router.get("/room/:roomId", roomControllers.getRoomById);
router.get("/most-booking-room", roomControllers.getMostBookingRoom);
router.get("/get-room-view-calendar", protectRoute, verifyRoles, roomControllers.getRoomViewCalendars);
router.get("/get-each-room-type", roomControllers.getOneRoomPerType);
router.get("/filter", roomControllers.filterRooms);
router.post("/search-available-rooms", roomControllers.searchAvailableRooms);
router.post("/room-review/:roomId", protectRoute, accessControl("rateAndReview", "create"), roomControllers.roomReview);

export default router;