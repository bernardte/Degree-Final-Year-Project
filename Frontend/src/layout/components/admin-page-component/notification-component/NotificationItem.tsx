import { Bookmark, BookmarkCheck } from 'lucide-react'
import { formatTime } from "@/utils/formatTime";
import { Notification } from '@/types/interface.type';
import useNotificationStore from "@/stores/useNotificationStore";
import useNotificationObserver from "@/hooks/useNotificationObserver";
import { LucideIcon } from "lucide-react";

const NotificationItems = ({
  notification,
  Icon,
  typeConfig,
}: {
  notification: Notification;
  Icon: LucideIcon;
  typeConfig: {
    icon: LucideIcon;
    color: string;
    borderColor: string;
  };
}) => {
  const markAsRead = useNotificationStore((state) => state.markAsRead);
  const notificationRef = useNotificationObserver(
    notification._id,
    notification.isRead,
  );

  return (
    <li
      className={`p-5 transition-colors hover:bg-gray-50 ${
        !notification.isRead ? "bg-blue-50" : ""
      }`}
    >
      <div className="flex justify-between">
        {/* notification Content */}
        <div className="flex-1">
          <p className="mb-2 font-semibold text-gray-900">
            {notification.message}
          </p>

          <div
            ref={notificationRef}
            className="flex items-center text-sm text-gray-500"
          >
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 ${typeConfig.color}`}
            >
              <Icon className="mr-1.5 h-3.5 w-3.5" />
              {notification.type.charAt(0).toUpperCase() +
                notification.type.slice(1)}
            </span>
            <span className="mx-2">•</span>
            <span>{formatTime(notification.createdAt)}</span>
          </div>
        </div>

        {/* operating button */}
        <div className="ml-4 flex flex-col items-center">
          <button
            onClick={() => markAsRead(notification._id)}
            className={`rounded-full p-1.5 ${
              notification.isRead
                ? "text-gray-400"
                : "text-blue-500 hover:bg-blue-100"
            }`}
          >
            {notification.isRead ? (
              <BookmarkCheck className="h-5 w-5" />
            ) : (
              <Bookmark className="h-5 w-5" />
            )}
          </button>
          {!notification.isRead && (
            <span className="mt-1 text-xs text-blue-600">Unread</span>
          )}
        </div>
      </div>
    </li>
  );
};

export default NotificationItems
