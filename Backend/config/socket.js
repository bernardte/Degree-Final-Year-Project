import { Server } from "socket.io";
import {
  emitBookingTrendsUpdate,
  emitRoomReviewUpdate,
  emitBookingStatusUpdate,
} from "../socket/socketUtils.js";
import User from "../models/user.model.js";

let io;
const userSocketMapped = new Map(); //* userId -> socket.id


export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
    },
  });

  io.on("connection", async (socket) => {
    console.log("Client connected from frontend: ", socket.id);

    socket.on(
      "user-connected",
      async ({ userId, guestId, username, isGuest, role }) => {
        console.log(
          "user connected: ",
          userId,
          guestId,
          username,
          isGuest,
          role
        );

        socket.data.user = {
          userId, //! Login user
          guestId, //! Non-login user
          username,
          isGuest,
          role, //! login user role
        };

        if (userId) {
          try {
            await User.findByIdAndUpdate({ _id: userId }, { isOnline: true });
          } catch (error) {
            console.error(
              "Failed to update user online status:",
              error.message
            );
          }
        }

        const idKey = userId ? `user:${userId}` : `guest:${guestId}`;

        // Store mapping using .set() if userId exists
        userSocketMapped.set(idKey, socket.id);
        const activeUserIds = Array.from(userSocketMapped.keys())
          .filter((key) => key.startsWith("user:"))
          .map((key) => key.split(":")[1]);
        io.emit("active-users", activeUserIds);
      }
    );

    socket.on("subscribe-booking-trend", async ({ range }) => {
      console.log("Client requested trend update for:", range);
      await emitBookingTrendsUpdate(range); // pass dynamic range
    });

    //! this is from frontend rate-and review pie chart refresh button to make update
    socket.on("request-room-rating-review", async () => {
      console.log("Client requested room rating review update");
      // emit room rating review update
      await emitRoomReviewUpdate(); //broadcasting "room rating review" event
    });

    //! this is from frontend booking status pie chart refresh button
    socket.on("request-update-booking-status", async () => {
      console.log("Client requested booking status update");
      // emit booking status update
      await emitBookingStatusUpdate();
    });

    socket.on("join-room", (conversationId) => {
      console.log("Join Room User: ", conversationId);
      socket.join(conversationId);
    });

    //! get all available admin
    socket.on("get-available-admin", (cb) => {
      for (const [idKey, socketId] of userSocketMapped.entries()) {
        console.log(idKey, ",", socketId);
        if (idKey.startsWith("user:")) {
          const adminSocket = io.sockets.sockets.get(socketId);
          console.log(adminSocket?.data?.user?.userId);
          if (
            adminSocket?.data?.user?.role === "admin" ||
            adminSocket?.data?.user?.role === "superAdmin"
          ) {
            return cb({
              receipentId: adminSocket?.data?.user?.userId,
              socketId,
            });
          }
        }
      }
      // No admin found
      cb(null);
    });

    await emitBookingTrendsUpdate();
    await emitRoomReviewUpdate();
    await emitBookingStatusUpdate();

    socket.on("disconnect", async () => {
      console.log("🛑 Socket disconnected: ", socket.id);
      console.log("🧠 Disconnect user data:", socket.data.user);
      let disconectedUserId;
      for (const [idKey, socketId] of userSocketMapped.entries()) {
        console.log("Checking socketId:", socketId);
        if (socketId === socket.id) {
          console.log("🔗 Match found for:", idKey);
          userSocketMapped.delete(idKey);

          const userId = socket.data.user?.userId;
          console.log("🧾 Extracted userId:", userId);

          if (userId) {
            disconectedUserId = userId;
            try {
              const result = await User.findByIdAndUpdate(userId, {
                isOnline: false,
              });
              console.log("✅ User marked offline:", result);
            } catch (error) {
              console.error("❌ DB update failed:", error.message);
            }
          }

          break;
        }
      }

      if (disconectedUserId) {
        console.log("Emitting user_disconnected for: ", disconectedUserId);
        io.emit("user_disconnected", disconectedUserId);
        const activeUserIds = Array.from(userSocketMapped.keys())
          .filter((key) => key.startsWith("user:"))
          .map((key) => key.split(":")[1]);
        io.emit("active-users", activeUserIds);
      }
    });
  });
};

export const getUserMap = () => userSocketMapped;

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO not initialized");
  }

  return io;
};
