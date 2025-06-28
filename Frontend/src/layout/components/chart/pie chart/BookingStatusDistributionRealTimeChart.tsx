import { JSX, SetStateAction, useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import axiosInstance from "@/lib/axios";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CalendarCheck,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  BarChart4,
} from "lucide-react";
import { useSocket } from "@/context/SocketContext";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";

const bookingStatusColors: Record<BookingStatus, string> = {
  pending: "rgba(250, 204, 21, 0.9)", // yellow
  confirmed: "rgba(59, 130, 246, 0.9)", // blue
  cancelled: "rgba(239, 68, 68, 0.9)", // red
  completed: "rgba(34, 197, 94, 0.9)", // green
};

const statusIcons: Record<BookingStatus, JSX.Element> = {
  pending: <Clock className="h-4 w-4 text-yellow-600" />,
  confirmed: <CalendarCheck className="h-4 w-4 text-blue-600" />,
  cancelled: <XCircle className="h-4 w-4 text-red-600" />,
  completed: <CheckCircle className="h-4 w-4 text-green-600" />,
};

const BookingStatusDistributionRealTimeChart = ({
  setChartType,
  chartType,
}: {
  setChartType: React.Dispatch<SetStateAction<"rating" | "status">>;
  chartType: "rating" | "status";
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<{ _id: BookingStatus; count: number }[]>(
    [],
  );
  const [total, setTotal] = useState(0);
  const socket = useSocket();

  // Fetch booking status data from API
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(
        "/api/statistic/booking-status-chart",
      );
      const rawStats = response.data;
      const totalCount = rawStats.reduce(
        (acc: number, item: { count: number }) => acc + item.count,
        0,
      );

      setStats(rawStats);
      setTotal(totalCount);
    } catch (err) {
      console.error("Failed to load booking status data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!socket) {
      return;
    }

    const handleBookingStatusUpdate = (
      data: {
        _id: "pending" |
        "confirmed" |
        "cancelled" |
        "completed",
        count: number;
      }[],
    ) => {
      console.log("Received data: ", data);
      setStats(data);
    };

    socket.on("booking-status-update", handleBookingStatusUpdate);

    return () => {
      socket.off("booking-status-update", handleBookingStatusUpdate);
    };
  }, [socket]);

  // Prepare chart data
  const chartData = {
    labels: stats.map((s) => s._id.charAt(0).toUpperCase() + s._id.slice(1)),
    datasets: [
      {
        data: stats.map((s) => s.count),
        backgroundColor: stats.map((s) => bookingStatusColors[s._id]),
        hoverBackgroundColor: stats.map((s) =>
          bookingStatusColors[s._id].replace("0.9", "1"),
        ),
        borderWidth: 0,
        borderRadius: 8,
        spacing: 4,
        hoverOffset: 15,
      },
    ],
  };

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg">
      {/* Header section */}
      <div className="flex flex-col items-start justify-between gap-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-blue-50 p-5 md:flex-row md:items-center">
        <div className="flex items-start gap-3">
          <div className="rounded-lg border border-indigo-100 bg-white p-2.5 shadow-sm">
            <CalendarCheck className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Booking Status Distribution
            </h2>
            <p className="mt-1 max-w-lg text-sm text-gray-600">
              Real-time overview of booking statuses with percentage breakdown
              and visual indicators
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg border border-indigo-100 bg-white px-3 py-2 shadow-sm">
            <BarChart4 className="h-5 w-5 text-indigo-600" />
            <span className="font-medium text-indigo-700">
              Total: <span className="font-bold">{total}</span> bookings
            </span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => socket?.emit("request-update-booking-status")}
              className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 transition-all hover:bg-gray-50 hover:shadow-sm"
              disabled={isLoading}
            >
              <RefreshCw
                className={`h-5 w-5 text-gray-600 ${isLoading ? "animate-spin" : ""}`}
              />
              <span className="hidden text-gray-700 sm:inline">Refresh</span>
            </button>

            <div className="relative">
              <select
                value={chartType}
                onChange={(e) =>
                  setChartType(e.target.value as "rating" | "status")
                }
                className="appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2 pr-8 pl-9 text-gray-700 hover:border-indigo-400 focus:outline-none"
              >
                <option value="status">Booking Status</option>
                <option value="rating">Review Rating</option>
              </select>
              <div className="absolute top-1/2 left-3 -translate-y-1/2 transform">
                <CalendarCheck className="h-4 w-4 text-indigo-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="p-5">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-8 py-6 lg:grid-cols-2">
            <div className="flex flex-col items-center">
              <Skeleton className="h-64 w-64 rounded-full" />
              <div className="mt-6 flex gap-4">
                {[1, 2, 3, 4].map((_, i) => (
                  <Skeleton key={i} className="h-8 w-20 rounded-lg" />
                ))}
              </div>
            </div>
            <div className="space-y-5">
              {[1, 2, 3, 4].map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="flex justify-between">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-5 w-12" />
                  </div>
                  <Skeleton className="h-3 w-full rounded-full" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Chart section */}
            <div className="flex flex-col items-center">
              <div className="relative h-80 w-full max-w-xs overflow-hidden">
                <Doughnut
                  data={chartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: "65%",
                    plugins: {
                      legend: {
                        display: false,
                      },
                      tooltip: {
                        backgroundColor: "rgba(30, 41, 59, 0.95)",
                        titleFont: { size: 14, weight: "bold" },
                        bodyFont: { size: 13 },
                        padding: 15,
                        displayColors: true,
                        callbacks: {
                          label: (context) => {
                            const value = context.parsed;
                            const percentage = Math.round(
                              (value / total) * 100,
                            );
                            return `${context.label}: ${value} (${percentage}%)`;
                          },
                        },
                      },
                    },
                    animation: {
                      animateRotate: true,
                      // animateScale: true,
                      duration: 1000,
                    },
                  }}
                />

                {/* Center summary */}
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-3xl font-bold text-gray-800">
                    {total}
                  </div>
                  <p className="mt-1 text-sm text-gray-500">Total Bookings</p>
                </div>
              </div>

              {/* Status indicators */}
              <div className="mt-6 flex flex-wrap justify-center gap-4">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 rounded-lg border border-gray-100 bg-gray-50 px-3 py-1.5"
                  >
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: bookingStatusColors[stat._id] }}
                    ></div>
                    <span className="text-sm font-medium text-gray-700">
                      {stat._id.charAt(0).toUpperCase() + stat._id.slice(1)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Status breakdown section */}
            <div className="space-y-6">
              {stats.map((stat, index) => {
                const percentage = Math.round((stat.count / total) * 100);
                return (
                  <div key={index} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="rounded-md border border-gray-200 bg-white p-1.5">
                          {statusIcons[stat._id]}
                        </div>
                        <span className="font-medium text-gray-700">
                          {stat._id.charAt(0).toUpperCase() + stat._id.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-800">
                          {stat.count}
                        </span>
                        <span className="rounded bg-gray-100 px-2 py-1 text-sm font-medium text-gray-600">
                          {percentage}%
                        </span>
                      </div>
                    </div>

                    <div className="h-2.5 w-full rounded-full bg-gray-200">
                      <div
                        className="h-2.5 rounded-full"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: bookingStatusColors[stat._id],
                        }}
                      ></div>
                    </div>

                    <div className="flex justify-between text-xs text-gray-500">
                      <span>0%</span>
                      <span>{percentage}%</span>
                      <span>100%</span>
                    </div>
                  </div>
                );
              })}

            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingStatusDistributionRealTimeChart;
