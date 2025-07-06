import { Bookmark } from "lucide-react";
import { notification } from "@/types/interface.type"; 
import { notificationTypes } from "@/constant/notificationType";
import NotificationItem from "./NotificationItem";

const NotificationList = ({
  filteredNotifications,
}: {
  filteredNotifications: notification[];
}) => {
    return (
      <ul className="divide-y divide-gray-100">
        {filteredNotifications.map((notification) => {
          const Icon = notificationTypes[notification.type]?.icon || Bookmark;
          const typeConfig = notificationTypes[notification.type];

          return (
              <NotificationItem
                key={notification._id}
                notification={notification}
                Icon={Icon}
                typeConfig={typeConfig}
              />
          );
        })}
      </ul>
    );
};

export default NotificationList;
