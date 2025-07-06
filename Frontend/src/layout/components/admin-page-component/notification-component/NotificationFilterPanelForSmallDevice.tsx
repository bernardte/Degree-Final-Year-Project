import { Filter, X } from "lucide-react";
import { SetStateAction } from "react";
import { notificationTypes } from "@/constant/notificationType";

const NotificationFilterPanelForSmallDevice = ({
  activeFilter,
  setShowFilters,
  setActiveFilter,
}: {
  activeFilter: string
  setShowFilters: React.Dispatch<SetStateAction<boolean>>;
  setActiveFilter: React.Dispatch<SetStateAction<string>>;
}) => {
  return (
    
    <div className="mb-6 rounded-xl bg-white p-4 shadow-sm sm:hidden">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center">
          <Filter className="mr-2 h-5 w-5 text-gray-500" />
          <h2 className="font-medium text-gray-700">Filter by type</h2>
        </div>
        <button onClick={() => setShowFilters(false)}>
          <X className="h-5 w-5 text-gray-500" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => {
            setActiveFilter("all");
            setShowFilters(false);
          }}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            activeFilter === "all"
              ? "bg-indigo-100 text-indigo-700"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          All
        </button>

        {Object.entries(notificationTypes).map(([type, config]) => (
          <button
            key={type}
            onClick={() => {
              setActiveFilter(type);
              setShowFilters(false);
            }}
            className={`flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              activeFilter === type
                ? `${config.color}`
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <config.icon className="mr-2 h-4 w-4" />
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default NotificationFilterPanelForSmallDevice;
