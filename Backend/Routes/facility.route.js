import express from "express";
import facilityController from "../controllers/facility.controller.js";
const router = express.Router();

router.get("/", facilityController.getFacility); 

export default router;
