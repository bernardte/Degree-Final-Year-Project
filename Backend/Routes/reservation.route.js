import express from "express";
import reservationController from "../controllers/reservation.controller.js";
const router = express.Router();

router.post("/new-reservation", reservationController.handleNewReservation);

export default router