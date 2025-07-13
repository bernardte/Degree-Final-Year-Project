import express from "express";
import faqController from "../controllers/faq.controller.js";

const router = express.Router();

router.route("/").get(faqController.fetchAllFAQ).post(faqController.createFAQ);

export default router;
