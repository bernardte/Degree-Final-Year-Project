import axiosInstance from "@/lib/axios";
import { Notification } from "@/types/interface.type";
import { create } from "zustand";

interface notificationStore {
  notifications: Notification[];
  unreadNotification: number;
  error: null | string;
  isLoading: boolean;
  addNotification: (notification: Notification) => void;
  setUnreadNotificationsCount: () => void;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  fetchSpecificUserNotifications: () => Promise<void>;
  handleDeleteAllNotification: () => Promise<void>;
}

const useNotificationStore = create<notificationStore>()((set, get) => ({
  notifications: [],
  error: null,
  isLoading: false,
  unreadNotification: 0,
  addNotification: (notification: Notification) => {
    set((prevState) => ({
      notifications: [notification, ...prevState.notifications],
    }));
  },
  fetchSpecificUserNotifications: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/api/notification");
      const data = response.data;
      if (data) {
        set({ notifications: data });
      }
    } catch (error: any) {
      set({ error: error?.response?.data?.error });
    } finally {
      set({ isLoading: false });
    }
  },
  //mark specific notification as read
  markAsRead: async (notificationId: string) => {
    set({ error: null });
    try {
      await axiosInstance.patch(
        "/api/notification/mark-as-read/" + notificationId,
      );
      set((prevState) => ({
        notifications: prevState.notifications.map((notification) =>
          notification._id === notificationId
            ? { ...notification, isRead: true }
            : notification,
        ),
      }));

      // update unread count
      get().setUnreadNotificationsCount();
    } catch (error: any) {
      set({ error: error?.response?.data?.error });
    }
  },
  //mark all notifications as Read
  markAllAsRead: async () => {
    try {
      //? prevent if all notification is read, not allowed to proceed
      if (get().unreadNotification === 0) {
        return;
      }
      await axiosInstance.patch("/api/notification/mark-all-as-read");
      set((prevState) => ({
        notifications: prevState.notifications.map((notification) => ({
          ...notification,
          isRead: true,
        })),
      }));
      // update unread count
      get().setUnreadNotificationsCount();
    } catch (error: any) {
      set({ error: error?.response?.data?.error });
    }
  },

  //calculate unread notifications count
  setUnreadNotificationsCount: () => {
    set((prevState) => {
      const unreadCount = prevState.notifications.filter(
        (notification) => !notification.isRead,
      ).length;
      return {
        unreadNotification: unreadCount,
      };
    });
  },

  handleDeleteAllNotification: async () => {
    try {
      await axiosInstance.delete("/api/notification");
      set({ notifications: [] });
    } catch (error: any) {
      set({ error: error?.response?.data?.error});
    }
  },
}));

export default useNotificationStore;
