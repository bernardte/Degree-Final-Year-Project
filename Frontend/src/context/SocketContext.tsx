import React, { createContext, useContext, useEffect, useState } from "react";
import useAuthStore from "@/stores/useAuthStore";


// socket.io
import io, { Socket } from "socket.io-client";
const SocketContext = createContext<Socket | null>(null);

// hooks
export const useSocket = () => {
    return useContext(SocketContext);
}

export const SocketContextProvider = ({ children }: { children: React.ReactNode }) => {
    const { user: currentLoginUser } = useAuthStore();
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        // Guest ID fallback
        let guestId = localStorage.getItem("guestId");
        if(!guestId){
            guestId = `guest_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
            localStorage.setItem("guestId", guestId);
        }

        // connect to socket
        const newSocket = io("http://localhost:5000", {
            withCredentials: true,
        });

        newSocket.on("connect", () => {
            console.log("Socket Connected from backend: ", newSocket.id);

            // Emit user info to backend
            newSocket.emit("user-connected", {
                userId: currentLoginUser?._id || null,
                username: currentLoginUser?.username || "Guest",
                guestId: currentLoginUser?._id ? null : guestId,
                isGuest: !currentLoginUser?._id
            });
        });

        setSocket(newSocket);
        return () => {
            newSocket.disconnect();
        };

    }, [currentLoginUser?._id])

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
}