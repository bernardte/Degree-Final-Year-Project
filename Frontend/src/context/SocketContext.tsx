import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import useAuthStore from "@/stores/useAuthStore";
import io, { Socket } from "socket.io-client";
import { generateSessionId } from "@/utils/generateSessionId";

const SocketContext = createContext<Socket | null>(null);

// Custom hook to use socket anywhere
export const useSocket = () => useContext(SocketContext);

export const SocketContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user: currentLoginUser } = useAuthStore();
  const [socket, setSocket] = useState<Socket | null>(null);
  const { adminReceipentId, setCurrentAdminReceipentId } = useAuthStore();
  const adminReceipentRef = useRef(adminReceipentId);
  useEffect(() => {
    // Guest ID fallback
    let guestId = localStorage.getItem("guestId");
    console.log(guestId);
    if (!guestId) {
      guestId = `guest_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      localStorage.setItem("guestId", guestId);
      generateSessionId(); //* To ensure non login user has sessionId for backend to track their activity log
    }

    // 1. Connect to socket only once
    const newSocket = io("http://localhost:5000", {
      withCredentials: true,
    });

    // 2. Set socket on connect
    newSocket.on("connect", () => {
      console.log("✅ Socket connected: ", newSocket.id);
    });

    setSocket(newSocket);

    // 3. Cleanup
    return () => {
      newSocket.disconnect();
    };
  }, []);

  // 4. Emit user info only when both socket is ready and user is loaded
  useEffect(() => {
    if (!socket) return;

    // Either a logged-in user or a guest
    const guestId = localStorage.getItem("guestId");
    const isGuest = !currentLoginUser?._id;

    socket.emit("user-connected", {
      userId: currentLoginUser?._id || null,
      username: currentLoginUser?.username || "Guest",
      guestId: isGuest ? guestId : null,
      isGuest,
      role: currentLoginUser?.role || "guest",
    });

    // setInterval(() => {
    //   socket?.emit("heartbeat");//make sure no activity still able to be online
    // },3000)
  }, [socket, currentLoginUser]);

  // check online admin
  useEffect(() => {
    if (!socket) {
      return;
    }

    const checkAdmin = () => {
      socket.emit(
        "get-available-admin",
        (admin: { receipentId: string; socketId: string } | null) => {
          if (admin) {
            setCurrentAdminReceipentId(admin.receipentId);
            console.log("testing: ", adminReceipentId);
            console.log("In socket context");
          } else {
            setCurrentAdminReceipentId(null);
          }
        },
      );
    };

    checkAdmin();

    const interval = setInterval(checkAdmin, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, [socket, adminReceipentId]);

  useEffect(() => {
    adminReceipentRef.current = adminReceipentId;
  }, [adminReceipentId]);

  useEffect(() => {
    if (!socket) return;

    const handleOfflineUser = (receipentId: string) => {
      console.log("📴 Received user_disconnected:", receipentId);

      if (receipentId === adminReceipentRef.current) {
        console.log("❌ Admin is offline (matched):", receipentId);
        setCurrentAdminReceipentId(null);
      }
    };

    socket.on("user_disconnected", handleOfflineUser);
    return () => {
      socket.off("user_disconnected", handleOfflineUser);
    };
  }, [socket]);
  

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
