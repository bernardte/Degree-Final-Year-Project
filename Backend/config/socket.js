import { Server } from "socket.io";
import {
  emitBookingTrendsUpdate,
  emitRoomTypeUpdate,
  emitRoomReviewUpdate,
  emitBookingStatusUpdate
} from "../socket/socketUtils.js";

let io;

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

      socket.userData = {
        userId,
        guestId,
        username,
        isGuest,
      };
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
    });
  });
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO not initialized");
  }

  return io;
};
