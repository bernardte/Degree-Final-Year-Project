import { useState, useEffect } from "react";
import {
  ShieldCheck,
  Calendar,
  Filter,
  ChevronLeft,
  ChevronRight,
  MapPin,
  CheckCircle,
  Clock,
  User,
  Activity,
} from "lucide-react";
import useSettingStore from "@/stores/useSettingStore";
import { formatDateWithDayAndTime } from "@/utils/formatDate";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format } from "date-fns";

const UserActivityTrackSetting = () => {
  const [filters, setFilters] = useState({
    type: "",
    role: "",
    startDate: "",
    endDate: "",
  });

  const {
    isLoading,
    fetchUsersTrackingData,
    error,
    tableData,
    limit,
    totalPages,
    page,
    setPage,
  } = useSettingStore((state) => state);
  const [openPicker, setOpenPicker] = useState<"start" | "end" | null>(null);

  // handle page change
  useEffect(() => {
    //! when filtering required and current page is not first page reset to first page then after started to fetch the corresponding data
    if (page !== 1 && filters) {
      setPage(1);
      return;
    }

    if (page > 0) {
      fetchUsersTrackingData(
        filters.role,
        filters.type,
        filters.startDate,
        filters.endDate,
        page,
        limit,
      );
    }
  }, [page, filters, fetchUsersTrackingData, limit]);

  useEffect(() => {
    const eventSource = new EventSource(
      "http://localhost:5000/api/systemSetting/stream-activity-fetching",
      {
        //! SSE, doesn't offer adding adding authorization headers directly
        //! Since our authentication is based on HTTP-only cookies,
        //! EventSource will automatically send same-origin cookies.
        withCredentials: true,
      },
    );

    eventSource.onmessage = (event) => {
      try {
        const newActivity = JSON.parse(event.data);

        if (
          (!filters.role || newActivity.userRole === filters.role) &&
          (!filters.type || newActivity.type === filters.type) &&
          (!filters.startDate ||
            new Date(newActivity.createdAt) >= new Date(filters.startDate)) &&
          (!filters.endDate ||
            new Date(newActivity.createdAt) <= new Date(filters.endDate))
        ) {
          useSettingStore.setState((prev) => {
            if(prev.tableData.some((data) => data._id === newActivity._id)){
              return prev;
            }

            return {
              tableData: [newActivity, ...prev.tableData],
            }
          });
        }
      } catch (error) {}
    };
  }, []);

  // handle filter change
  const handleFilterChange = (filterType: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  // get status colors and icon
  const getStatusIcon = (status: string) => {
    if (status === "success") {
      return { icon: CheckCircle, color: "text-green-600" };
    } else if (status === "failed") {
      return { icon: Clock, color: "text-red-600" };
    }
    return { icon: Activity, color: "text-blue-600" };
  };

  return (
    <div className="mb-8 rounded-xl bg-white p-6 shadow-md">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <ShieldCheck className="mr-3 text-blue-600" size={24} />
          <h2 className="text-xl font-semibold text-gray-800">
            Activity Tracking
          </h2>
        </div>

        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span>
            Page {page} of {totalPages}
          </span>
          <span>•</span>
          <span>{limit} per page</span>
        </div>
      </div>

      {/* filter Part */}
      <div className="mb-6 rounded-lg bg-gray-50 p-4">
        <div className="mb-3 flex items-center">
          <Filter size={18} className="mr-2 text-gray-600" />
          <h3 className="text-md font-medium text-gray-700">
            Filter Activities
          </h3>
        </div>
        {/* Filter by type */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Type
            </label>
            <select
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              value={filters.type}
              onChange={(e) => handleFilterChange("type", e.target.value)}
            >
              <option value="">All Types</option>
              <option value="action">Action</option>
              <option value="page view">Page View</option>
            </select>
          </div>

          {/* Filter by role */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              value={filters.role}
              onChange={(e) => handleFilterChange("role", e.target.value)}
            >
              <option value="">All Roles</option>
              <option value="superAdmin">Super Admin</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
              <option value="guest">Guest</option>
            </select>
          </div>

          <div className="relative">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Start Date
            </label>
            <div
              className="flex w-full cursor-pointer items-center justify-between rounded-md border border-gray-300 px-3 py-2 text-sm"
              onClick={() =>
                setOpenPicker(openPicker === "start" ? null : "start")
              }
            >
              {filters.startDate
                ? format(new Date(filters.startDate), "yyyy-MM-dd")
                : "Pick a date"}
              <Calendar size={16} className="text-gray-500" />
            </div>
            {openPicker === "start" && (
              <div className="absolute z-10 mt-2 rounded-md bg-white p-2 shadow-md">
                <DayPicker
                  mode="single"
                  selected={
                    filters.startDate ? new Date(filters.startDate) : undefined
                  }
                  onSelect={(date) => {
                    if (date)
                      handleFilterChange("startDate", date.toISOString());
                    setOpenPicker(null);
                  }}
                />
              </div>
            )}
          </div>

          <div className="relative">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              End Date
            </label>
            <div
              className="flex w-full cursor-pointer items-center justify-between rounded-md border border-gray-300 px-3 py-2 text-sm"
              onClick={() => setOpenPicker(openPicker === "end" ? null : "end")}
            >
              {filters.endDate
                ? format(new Date(filters.endDate), "yyyy-MM-dd")
                : "Pick a date"}
              <Calendar size={16} className="text-gray-500" />
            </div>
            {openPicker === "end" && (
              <div className="absolute z-10 mt-2 rounded-md bg-white p-2 shadow-md">
                <DayPicker
                  mode="single"
                  selected={
                    filters.endDate ? new Date(filters.endDate) : undefined
                  }
                  onSelect={(date) => {
                    if (date) handleFilterChange("endDate", date.toISOString());
                    setOpenPicker(null);
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 活动列表 */}
      <div className="mt-4">
        <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-800">
          <Activity size={20} className="mr-2" />
          Recent Activity
        </h3>

        {isLoading ? (
          <div className="rounded-lg bg-gray-50 p-8 text-center">
            <p className="text-gray-500">Loading activities...</p>
          </div>
        ) : error ? (
          <div className="rounded-lg bg-red-50 p-4 text-center">
            <p className="text-red-500">Error: {error}</p>
          </div>
        ) : tableData.length === 0 ? (
          <div className="rounded-lg bg-gray-50 p-8 text-center">
            <p className="text-gray-500">
              No activities found matching your filters.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg bg-gray-50">
            {tableData.map((activity, index) => {
              const StatusIcon = getStatusIcon(activity.status).icon;
              const statusColor = getStatusIcon(activity.status).color;

              return (
                <div
                  key={activity._id || index}
                  className={`flex items-center justify-between p-4 ${index < tableData.length - 1 ? "border-b border-gray-200" : ""}`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="mt-1">
                      <User size={18} className="text-gray-500" />
                    </div>
                    <div>
                      {activity.userId?.username ? (
                        <p className="text-sm text-gray-500">
                          {activity.userId?.username}
                        </p>
                      ) : (
                        <p className="text-sm text-gray-500">Guest</p>
                      )}
                      <p className="font-medium text-gray-900">
                        {activity.action}
                      </p>
                      <div className="mt-1 flex items-center text-sm text-gray-600">
                        <MapPin size={14} className="mr-1" />
                        {activity.geo?.country}, {activity.geo?.city}
                      </div>
                      <div className="mt-1 flex items-center text-sm text-gray-600">
                        <MapPin size={14} className="mr-1" />
                        IP: {activity.ip}
                      </div>
                      {activity.errorMessage && (
                        <p className="mt-1 text-sm text-rose-500">
                          {activity.errorMessage}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      {formatDateWithDayAndTime(new Date(activity.createdAt))}
                    </p>
                    <div
                      className={`mt-1 flex items-center justify-end ${statusColor}`}
                    >
                      <StatusIcon size={16} className="mr-1" />
                      <span className="text-sm capitalize">
                        {activity.status}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 分页控件 */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between px-2">
          <div className="text-sm text-gray-600">
            Showing {(page - 1) * limit + 1} to{" "}
            {Math.min(page * limit, tableData.length)} of {totalPages * limit}{" "}
            activities
          </div>

          <div className="flex space-x-2">
            <button
              className={`flex items-center rounded-md px-3 py-1.5 text-sm ${page === 1 ? "cursor-not-allowed text-gray-400" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              <ChevronLeft size={16} className="mr-1" />
              Previous
            </button>

            <button
              className={`flex items-center rounded-md px-3 py-1.5 text-sm ${page === totalPages ? "cursor-not-allowed text-gray-400" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
              <ChevronRight size={16} className="ml-1" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserActivityTrackSetting;
