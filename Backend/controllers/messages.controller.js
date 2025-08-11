import Conversation from "../models/conversation.model.js";
import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import { getIO } from "../config/socket.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";
import { checkIsRead } from "../utils/checkMessageIsRead.js";
import axiosInstance from "../config/axios.js";
import { sendToAI } from "../websocket/websocket.js";

//TODO: maybe need to adjust of this, when superadmin require to view the message
const getAllMessages = async (req, res) => {
  const { conversationId } = req.params;
  try {
    const retrieveMessages = await Message.find({ conversationId });

    return res.status(201).json(retrieveMessages);
  } catch (error) {
    console.log("Error in getAllMessages: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const sendMessage = async (req, res) => {
  const { newMessage, senderType, senderId, lastMessageAt } = req.body;
  console.log(lastMessageAt);
  const { conversationId } = req.params;
  const uploadImage = req.files?.image || null;

  console.log(req.body);
  console.log(req.file);

  if (!senderId || !conversationId || !senderType) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    // Guest or user can always send to their own conversation
    //TODO: Maybe need to change senderId instead of using userCode as the _id
    // The guest user determines whether he is the session initiator by userCode.

    // The user user determines whether he has permission to send by whether the userId matches.
    let loginUserName = "";

    // if login user then check their usercode is same as their name or not
    if (!senderId.startsWith("guest") && senderType === "user") {
      const userDoc = await User.findById(senderId).select("name").lean();
      if (!userDoc) return res.status(404).json({ message: "User not found" });
      loginUserName = userDoc.name;
    }

    const isGuest =
      senderType === "guest" &&
      conversation.userCode?.toString() === `${senderId}`;
    const isUser =
      senderType === "user" && conversation.userCode === loginUserName;
    console.log("boolean: ", isUser);

    const isBot = senderType === "bot" && conversation.handleByChatbot;
    console.log(`isGuest: ${isGuest}, isUser: ${isUser}`);
    if ((isGuest || isUser) && conversation.handleByChatbot) {
      try {
        const currentUserMessage = await Message.find({ conversationId })
          .select("senderType content -_id") 
          .lean();
        console.log("hello world: ", newMessage);

        // Tell frontend customer have send a new message
        getIO().to(conversationId).emit("new-message", {
          senderType: senderType,
          content: newMessage
        })

        console.log(typeof conversationId, newMessage);

        sendToAI(conversationId, newMessage, currentUserMessage.map(m => ({
          role: m.senderType,
          content: m.content
        })));


        // getIO().to(conversationId).emit("bot-suggestions", {
        //   suggestions: aiResponse.suggestions,
        // });
      
        getIO().emit("handover-needed", { 
          conversationId,
          reason: "AI recognition failed, please intervene manually",
        });
        

      } catch (error) {
        console.log("AI customer service error:", error.message);
      }
    }

    // If admin, only allow if it's the one who locked it
    let isAllowedAdmin = false;
    if (senderType === "admin" || senderType === "superAdmin") {
      const currentAdmin = await User.findById(senderId);
      const superAdmin = await User.findOne({ role: "superAdmin" });
      if (!currentAdmin) {
        return res.status(403).json({ message: "Admin not found" });
      }

      //? allow which user role to send message， first time conversation
      if (!conversation.isLock) {
        // Lock conversation for this admin
        conversation.isLock = true;
        conversation.lockedBy = currentAdmin._id;
        conversation.visibleToAdmins = [currentAdmin._id, superAdmin._id];
        isAllowedAdmin = true;
      } else if (
        conversation.lockedBy?.toString() === currentAdmin._id.toString() ||
        currentAdmin.role === "superAdmin" //allow super admin to send message
      ) {
        // Already locked by this admin
        isAllowedAdmin = true;
      }
    }

    const uploadUrls = uploadImage
      ? await uploadToCloudinary(uploadImage)
      : null;

    // If sender not allowed
    if (!isGuest && !isUser && !isAllowedAdmin && !isBot) {
      return res
        .status(403)
        .json({ error: "You are not allowed to send this message." });
    }

    const isRead = await checkIsRead(conversation, senderType);

    // Create the message
    const message = await Message.create({
      conversationId,
      content: newMessage,
      senderId,
      senderType,
      image: uploadUrls,
      isRead: isRead,
    });

    //! get the lastest conversation and send back to the admin frontend to render out new conversation
    const updateConversation = await Conversation.findById(conversationId)
      .populate({
        path: "lockedBy",
        select: "_id name role",
      })
      .lean();

    conversation.lastMessage = newMessage;
    conversation.lastMessageAt = new Date(lastMessageAt);
    await conversation.save();
    getIO().to(conversationId).emit("new-message", message);
    getIO().emit("new-conversation", updateConversation);
    return res.status(201).json(message);
  } catch (error) {
    console.log("Error in sendMessage:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const markMessageAsRead = async (req, res) => {
  const { conversationId } = req.params;
  const { userId, userType } = req.body;

  if (!conversationId || !userId || !userType) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  try {
    // Only mark the messages sent by the other party as read
    await Message.updateMany(
      {
        conversationId,
        isRead: false,
        senderType: { $ne: userType }, //no include my ownself
      },
      {
        isRead: true,
      }
    );
    return res.status(200).json({ success: true });
  } catch (error) {
    console.log("Error in Mark read error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const getMostAskQuestion = async (req, res) => {
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  try {
    const pipeline = [
      {
        $match: {
          senderType: { $in: ["user", "guest"] },
          createdAt: { $gte: since },
        },
      },
      // Filter out very short chat content (<5 characters)
      { $match: { $expr: { $gt: [{ $strLenCP: "$content" }, 4] } } },
      { $group: { _id: "$content", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 50 },
    ];

    const topQs = await Message.aggregate(pipeline);
    res.status(200).json(topQs);
  } catch (error) {
    console.log("getMostAskQuestion: ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default {
  getAllMessages,
  sendMessage,
  markMessageAsRead,
  getMostAskQuestion,
};
