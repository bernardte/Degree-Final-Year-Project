import User from "../models/user.model.js";
import Conversation from "../models/conversation.model.js";

/**
 * Automatically assign a conversation to the least busy online admin.
 * Prioritizes those with the fewest locked sessions.
 * Returns the _id of the least busy admin, or null if none are available.
 */
export const assignConversationToAdmin = async () => {
  // Step 1: Find all online admins
  const onlineAdmins = await User.find({
    role: { $in: ["admin", "superAdmin"] },
    isOnline: true,
  });
  

  // Early return if no admins are online
  if (onlineAdmins.length === 0) return null;

  // Step 2: Create a load map with all admin IDs initialized to 0
  const loadMap = {};
  onlineAdmins.forEach((admin) => {
    if (admin?._id) {
      loadMap[admin._id.toString()] = 0;
    }
  });

  // Step 3: Find all "open" conversations that are locked
  const openConversations = await Conversation.find({
    status: "open",
    isLock: true,
  });

  // Step 4: Count how many conversations are locked by each admin
  openConversations.forEach((conversation) => {
    const lockedBy = conversation.lockedBy?.toString();
    if (lockedBy && loadMap.hasOwnProperty(lockedBy)) {
      loadMap[lockedBy]++;
    }
  });

  // Step 5: Find the admin with the fewest locked conversations
  const leastBusyAdminId = Object.entries(loadMap).sort(
    (a, b) => a[1] - b[1]
  )?.[0]?.[0]; // sort by conversation count // get admin ID

  return leastBusyAdminId || null;
};
