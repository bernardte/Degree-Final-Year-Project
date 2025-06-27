import express from "express";
import checkoutController from "../controllers/checkout.controller.js";
const router = express.Router();
router.route("/payment-gateway").post(checkoutController.createCheckoutSession).get(checkoutController.handlePaymentCancelled);
router.get("/session/:sessionId", checkoutController.updatePaymentDetails);

export default router;
