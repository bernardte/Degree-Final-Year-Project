import express from "express";
import checkoutController from "../controllers/checkout.controller.js";
const router = express.Router();
router.post("/payment-gateway", checkoutController.createCheckoutSession);
router.get("/session/:sessionId", checkoutController.updatePaymentDetails);

export default router;