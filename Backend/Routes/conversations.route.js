import express from "express";
import verifyRoles from "../middleware/verifyRoles.js";
import protectRoute from "../middleware/protectRoute.js";
import conversationsController from "../controllers/conversations.controller.js";

const router = express.Router();

router
  .route("/")
  .get(protectRoute, verifyRoles, conversationsController.getAllConversation)
  .patch(
    protectRoute,
    verifyRoles,
    conversationsController.updateConversationMessage
  )
  .post(conversationsController.createConversations);
router
  .route("/claim-conversation/:conversationId")
  .patch(protectRoute, verifyRoles, conversationsController.claimConversation);
router
  .route("/update-conversation-status/:conversationId")
  .patch(
    protectRoute,
    verifyRoles,
    conversationsController.updateConversationStatus
  );
export default router;
