
import express from "express";
import roomControllers from "../controllers/room.controller.js";
import protectRoute from "../middleware/protectRoute.js"; 
const router = express.Router();

router.get("/", roomControllers.getAllRooms);
router.get("/room/:roomId", roomControllers.getRoomById);
router.get("/most-booking-room", roomControllers.getMostBookingRoom);
router.get("/get-each-room-type", roomControllers.getOneRoomPerType);
router.get("/filter", roomControllers.filterRooms);
router.post("/search-available-rooms", roomControllers.searchAvailableRooms);
router.post("/room-review/:roomId", protectRoute, roomControllers.roomReview);

export default router;