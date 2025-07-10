import useNotificationStore from "@/stores/useNotificationStore";
import { Beer, Bell, Check, Filter } from "lucide-react";
import React, { SetStateAction } from "react";

const NotificationHeader = ({
  setShowFilters,
  showFilters,
}: {
  setShowFilters: React.Dispatch<SetStateAction<boolean>>;
  showFilters: boolean;
}) => {
  const { markAllAsRead, unreadNotification, handleDeleteAllNotification, notifications } = useNotificationStore(
    (state) => state,
  );
  return (
    <div className="mb-8 flex items-center justify-between">
      <div className="flex items-center">
        <div className="mr-4 rounded-lg bg-indigo-100 p-3">
          <Bell className="h-6 w-6 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600">
            {unreadNotification} unread{" "}
            {unreadNotification === 1 ? "notification" : "notifications"}
          </p>
        </div>
      </div>

      <div className="flex space-x-3">
        <button
          onClick={markAllAsRead}
          disabled={unreadNotification === 0}
          className="hidden items-center rounded-lg bg-indigo-600 px-4 py-2 text-white transition-colors hover:bg-indigo-700 sm:flex"
        >
          <Check className="mr-2 h-4 w-4" />
          Mark all as read
        </button>
        <button
          onClick={handleDeleteAllNotification}
          disabled={notifications.length === 0}
          className={`hidden items-center rounded-lg ${notifications.length > 0 ? " bg-rose-600 hover:bg-rose-700" : "bg-gray-500"} px-4 py-2 text-white transition-colors sm:flex`}
        >
          <Beer className="mr-2 h-4 w-4" />
          Delete all notifications
        </button>
        <button
          className="flex items-center rounded-lg bg-indigo-600 px-3 py-2 text-white sm:hidden"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default NotificationHeader;
