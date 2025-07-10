import { getIO, getUserMap } from "../config/socket.js";

export const checkIsRead = async (conversation, senderType) => {
  const io = getIO();
  const userMap = getUserMap();

  let recipientId;
  let recipientKey;

  if (senderType === "user" || senderType === "guest") {
    // 发给 lockedBy 的 admin 或 superAdmin
    recipientId = conversation.lockedBy?.toString();
    recipientKey = recipientId ? `user:${recipientId}` : null;
  } else if (senderType === "admin" || senderType === "superAdmin") {
    // 发给 user 或 guest
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
