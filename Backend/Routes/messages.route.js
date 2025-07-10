import express from "express";
import verifyRoles from "../middleware/verifyRoles.js";
import protectRoute from "../middleware/protectRoute.js";
import messagesController from "../controllers/messages.controller.js";

const router = express.Router();

router
  .route("/:conversationId")
  .post(messagesController.sendMessage)
  .get(messagesController.getAllMessages);

router
  .route("/mark-as-read/:conversationId")
  .patch(messagesController.markMessageAsRead);

export default router;
