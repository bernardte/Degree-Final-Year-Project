import express from "express";
import reservationController from "../controllers/reservation.controller.js";
import accessControl from "../middleware/accessControl.js";
import verifyRoles from "../middleware/verifyRoles.js";
import protectRoute from "../middleware/protectRoute.js";
const router = express.Router();

router.post("/new-reservation", reservationController.handleNewReservation);
router.get(
  "/get-all-restaurant-reservation",
  protectRoute,
  verifyRoles,
  accessControl("reservation", "view"),
  reservationController.getAllRestaurantReservation
);

export default router;
