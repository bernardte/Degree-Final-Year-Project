import { useState } from "react";
import NotificationHeader from "@/layout/components/admin-page-component/notification-component/NotificationHeader";
import NotificationFilterPanelForSmallDevice from "@/layout/components/admin-page-component/notification-component/NotificationFilterPanelForSmallDevice";
import NotificationFilterPanelforLargeDevice from "@/layout/components/admin-page-component/notification-component/NotificationFilterPanelforLargeDevice";
import NoNotificationShows from "@/layout/components/admin-page-component/notification-component/NoNotificationShows";
import NotificationList from "@/layout/components/admin-page-component/notification-component/NotificationList";
import NotificationMarkAsReadForSmallDevice from "@/layout/components/admin-page-component/notification-component/NotificationMarkAsReadForSmallDevice";
import useNotificationStore from "@/stores/useNotificationStore";

const AdminNotificationPage = () => {
  //! notification list is called on NotificationProvider, which called in a top level of admin portal, so this page no need to called again.
  const { notifications } = useNotificationStore((state) => state);
  const [activeFilter, setActiveFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  // filter notifications
  const filteredNotifications =
    activeFilter === "all"
      ? notifications
      : notifications.filter((n) => n.type === activeFilter);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* notification header */}
        <NotificationHeader
          setShowFilters={setShowFilters}
          showFilters={showFilters}
        />

        {/* Filter Panel for large screen*/}
        <NotificationFilterPanelforLargeDevice
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />

        {/*Filter Panel for small screen*/}
        {showFilters && (
          <NotificationFilterPanelForSmallDevice
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            setShowFilters={setShowFilters}
          />
        )}

        {/* Notification List */}
        <div className="overflow-hidden rounded-xl bg-white shadow-sm">
          {filteredNotifications.length === 0 ? (
            <NoNotificationShows />
          ) : (
            <NotificationList filteredNotifications={filteredNotifications} />
          )}
        </div>

        {/* Small Screen Device Mark As Read */}
        <NotificationMarkAsReadForSmallDevice />
      </div>
    </div>
  );
};

export default AdminNotificationPage;
