import express from "express";
import eventContoller from "../controllers/event.controller.js";

const router = express.Router();

router.post("/event-enquiry", eventContoller.enquireEvents);

export default router;