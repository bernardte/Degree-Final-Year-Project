import { getIO, getUserMap } from "../config/socket.js";

export const checkIsRead = async (conversation, senderType) => {
  const io = getIO();
  const userMap = getUserMap();

  let recipientId;
  let recipientKey;

  if (senderType === "user" || senderType === "guest") {
    // send to locked by admin or super admin
    recipientId = conversation.lockedBy?.toString();
    recipientKey = recipientId ? `user:${recipientId}` : null;
  } else if (senderType === "admin" || senderType === "superAdmin") {
    // send to guest or user
    const userCode = conversation.userCode;
    if (userCode?.startsWith("user_")) {
      recipientId = userCode.replace("user_", "");
      recipientKey = `user:${recipientId}`;
    } else if (userCode?.startsWith("guest_")) {
      recipientId = userCode.replace("guest_", "");
      recipientKey = `guest:${recipientId}`;
    }
  }

  if (!recipientKey) return false;

  const recipientSocketId = userMap.get(recipientKey);
  if (!recipientSocketId) return false;

  const recipientSocket = io.sockets.sockets.get(recipientSocketId);
  if (!recipientSocket) return false;

  const rooms = [...recipientSocket.rooms];
  return rooms.includes(conversation._id.toString());
};
