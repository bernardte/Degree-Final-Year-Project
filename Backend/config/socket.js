import { Server } from "socket.io";
import { emitBookingTrendsUpdate } from "../utils/socketUtils.js";

let io;

export const initializeSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "http://localhost:3000",
            credentials: true,
        },
    });

    io.on("connection", (socket) => {
        console.log("Client connected from frontend: ", socket.id);

        socket.on("user-connected", ({ userId, guestId, username, isGuest }) => {
            console.log("user connected: ", userId, guestId, username, isGuest);

            socket.userData = {
                userId,
                guestId,
                username,
                isGuest
            };
        })

        socket.on("subscribe-booking-trend", async ({ range }) => {
          console.log("Client requested trend update for:", range);
          await emitBookingTrendsUpdate(range); // pass dynamic range
        });
        
        emitBookingTrendsUpdate("")
        socket.on("disconnect", () => {
            console.log("Socket disconnected: ", socket.id);
        });
    });
};

export const getIO = () => {
    if(!io){
        throw new Error("Socket.IO not initialized");
    }

    return io;
}