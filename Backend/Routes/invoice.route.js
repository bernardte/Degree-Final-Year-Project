import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import invoiceController from "../controllers/invoice.controller.js";

const router = express.Router();

router.route("/invoice/:invoiceId").get(protectRoute, invoiceController.getInvoice);


export default router