import { useSocket } from "@/context/SocketContext";
import useNotificationStore from "@/stores/useNotificationStore";
import { notification } from "@/types/interface.type";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const NotificationProvider = ({ children } : { children: React.ReactNode}) => {
  const {
    fetchSpecificUserNotifications,
    setUnreadNotificationsCount,
    addNotification,
  } = useNotificationStore((state) => state);
  const socket = useSocket();
  const location = useLocation();

  useEffect(() => {
    fetchSpecificUserNotifications().then(() => setUnreadNotificationsCount());
  }, [fetchSpecificUserNotifications, location.pathname]);

  // Listen to socket for new notifications
  useEffect(() => {
    if (!socket) return;
    
    const handleNewNotification = (notification: notification) => {
        console.log("Received notification:", notification); 
        addNotification(notification); // update store directly
        setUnreadNotificationsCount(); // update count reactively
    }

    //listen from server-side new information 
    socket?.on("new-notification", handleNewNotification);
    return () => {
        socket?.off("new-notification", handleNewNotification);
    }
  }, [socket]);

  return <>{children}</>;
};

export default NotificationProvider;
