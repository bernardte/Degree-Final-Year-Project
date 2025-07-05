import { Server } from "socket.io";
import {
  emitBookingTrendsUpdate,
  emitRoomReviewUpdate,
  emitBookingStatusUpdate
} from "../socket/socketUtils.js";

let io;
const userSocketMapped = new Map();//* userId -> socket.id

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
    },
  });

  io.on("connection", async (socket) => {
    console.log("Client connected from frontend: ", socket.id);

    socket.on("user-connected", ({ userId, guestId, username, isGuest }) => {
      console.log("user connected: ", userId, guestId, username, isGuest);

      socket.data.user = {
        userId, //! Login user
        guestId,//! Non-login user
        username,
        isGuest,
      };

      const idKey = userId ? `user:${userId}` : `guest:${guestId}`;

      // Store mapping using .set() if userId exists
      userSocketMapped.set(idKey, socket.id);
      
    });

    socket.on("subscribe-booking-trend", async ({ range }) => {
      console.log("Client requested trend update for:", range);
      await emitBookingTrendsUpdate(range); // pass dynamic range
    });


    //! this is from frontend rate-and review pie chart refresh button to make update
    socket.on("request-room-rating-review", async() => {
      console.log("Client requested room rating review update");
      // emit room rating review update
      await emitRoomReviewUpdate();//broadcasting "room rating review" event
    });

    //! this is from frontend booking status pie chart refresh button
    socket.on("request-update-booking-status", async () => {
      console.log("Client requested booking status update");
      // emit booking status update
      await emitBookingStatusUpdate();
    })
    await emitBookingTrendsUpdate();
    await emitRoomReviewUpdate();
    await emitBookingStatusUpdate();
    socket.on("disconnect", () => {
      console.log("Socket disconnected: ", socket.id);

      // Remove user from Map if socket ID matches
      for (const [idKey, socketId] of userSocketMapped.entries()) {
        if (socketId === socket.id) {
          userSocketMapped.delete(idKey);
          break;
        }
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
