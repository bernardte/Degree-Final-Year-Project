import { getIO } from "../config/socket.js";
import Conversation from "../models/conversation.model.js";
import User from "../models/user.model.js";
import { assignConversationToAdmin } from "../utils/assignmentAdmin.js";
import mongoose from "mongoose";

const getAllConversation = async (req, res) => {
  const userId = req.user._id;

  try {
    // Get current user
    const currentUser = await User.findById(userId).select(
      "-password -createdAt -loyaltyTier -totalSpent -rewardPoint -updatedAt"
    );
    const isSuperAdmin = currentUser?.role === "superAdmin";

    // Query logic: super admin sees all, others see their locked or visible conversations
    const query = isSuperAdmin ? {} : { visibleToAdmins: userId };

    // Fetch conversations
    const conversations = await Conversation.find(query)
      .sort({ lastMessageAt: -1 })
      .populate({
        path: "lockedBy",
        select: "_id name role",
      });

    // Return merged result
    res.status(200).json({
      conversations: conversations,
    });
  } catch (error) {
    console.log("Error in getAllConversation:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateConversationMessage = async (req, res) => {
  const { conversationId, lastMessage, lastMessageAt } = req.body;
  try {
    const conversation = await Conversation.findById({
      _id: conversationId,
    }).select("lastMessage lastMessageAt");
    conversation.lastMessage = lastMessage || conversation.lastMessage;
    conversation.lastMessageAt = lastMessageAt || conversation.lastMessageAt;
    await conversation.save();
    res.status(201).json(conversation);
  } catch (error) {
    console.log("Error in updateConversationMessage: ", error.message);
    res.status(500).json({ error: "Internal Server Error " });
  }
};

const createConversations = async (req, res) => {
  const { receipentId, mode, lastMessage, lastMessageAt, senderId } = req.body;
  console.log(req.body);

  if ((!receipentId || !mode || !lastMessage || !lastMessageAt, !senderId)) {
    return res.status(400).json({ error: "All field are required" });
  }

  try {
    // if login user then use it name as the usercode
    const isObjectId = mongoose.Types.ObjectId.isValid(senderId);
    let userCode;
    // userId
    if (isObjectId) {
      const userDoc = await User.findById(senderId).select("name").lean();
      if (!userDoc) return res.status(404).json({ error: "User not found" });
      userCode = userDoc.name;
    }else{
      // guest
      userCode = senderId
    }

    const conversationData = {
      userId: receipentId,
      userCode,
      mode,
      status: "open",
      lastMessage,
      lastMessageAt,
    };
    const handleByBot = mode === "bot"; //TODO: after have chatbot make prioritize bot here
    console.log("bot: ", handleByBot)

    if (handleByBot) {
      conversationData.lockedBy = null; // AI does not need to claim manually
      conversationData.handleByChatbot = true;
      conversationData.isLock = false;
    } else {
      // Otherwise, admin will be automatically assigned
      const assignedAdminId = await assignConversationToAdmin();
      console.log("Your assign adminId: ", assignConversationToAdmin);
      if (assignedAdminId) {
        conversationData.lockedBy = assignedAdminId;
        conversationData.isLock = true;
        conversationData.visibleToAdmins = [assignedAdminId];
      }
    }

    const newConversation = await Conversation.create(conversationData);

    res.status(201).json({
      message: "Conversation created successfully",
      conversationId: newConversation._id,
      conversation: newConversation,
    });
  } catch (error) {
    console.log("Error in createConversation: ", error.message);
    res.status(500).json({ error: "Internal Server Error " });
  }
};

const claimConversation = async (req, res) => {
  const adminId = req.user._id;
  const { conversationId } = req.params;

  try {
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }
    if (conversation.isLock) {
      return res.status(400).json({ message: "Already claimed" });
    }

    conversation.isLock = true;
    conversation.lockedBy = adminId;
    conversation.visibleToAdmins = [adminId];
    await conversation.save();

    res
      .status(200)
      .json({ message: "Claimed successfully", conversation: conversation });
  } catch (error) {
    console.log("Error in claimConversation: ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateConversationStatus = async (req, res) => {
  const { conversationId } = req.params;
  const updateStatus = req.body.status;
  try {
    const conversations = await Conversation.findOneAndUpdate({
      _id: conversationId
    }, {
      $set: {
        status: updateStatus
      }
    });

    if(!conversationId){
      return res.status(401).json({error: "No conversation found!"})
    }

    return res.status(201).json(conversations);
  } catch (error) {
    console.log("Error in updateConversationStatus: ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default {
  getAllConversation,
  updateConversationMessage,
  createConversations,
  claimConversation,
  updateConversationStatus,
};
