import { useEffect, useState, SetStateAction } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import axiosInstance from "@/lib/axios";
import { Skeleton } from "@/components/ui/skeleton";
import {
  MessageCircle,
  Star,
  RefreshCw,
  BarChart4,
  DoorOpen,
} from "lucide-react";
import { useSocket } from "@/context/SocketContext";

// Register chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const RoomReviewDistributionRealTimeChart = ({ setChartType, chartType } : { setChartType: React.Dispatch<SetStateAction<"rating" | "status">>; chartType: "rating" | "status" }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState<{ _id: number; count: number }[]>([]);
    const [totalReviews, setTotalReviews] = useState(0);
    const { socket } = useSocket();

    const colors = [
        "rgba(239, 68, 68, 0.8)", // red (1-star)
        "rgba(249, 115, 22, 0.8)", // orange (2-star)
        "rgba(250, 204, 21, 0.8)", // yellow (3-star)
        "rgba(59, 130, 246, 0.8)", // blue (4-star)
        "rgba(34, 197, 94, 0.8)", // green (5-star)
    ];

    const hoverColors = [
        "rgba(239, 68, 68, 1)",
        "rgba(249, 115, 22, 1)",
        "rgba(250, 204, 21, 1)",
        "rgba(59, 130, 246, 1)",
        "rgba(34, 197, 94, 1)",
    ];

    const chartData = {
        labels: stats.map((s) => `${s._id} Stars`),
        datasets: [
        {
            data: stats.map((s) => s.count),
            backgroundColor: colors,
            hoverBackgroundColor: hoverColors,
            borderWidth: 0,
            borderRadius: 8,
            spacing: 4,
        },
        ],
    };

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await axiosInstance.get("/api/statistic/room-rating-chart");
            const rawStats = response.data;
            const total = rawStats.reduce(
            (acc: number, item: { count: number }) => acc + item.count,
            0,
            );


            setStats(rawStats);
            setTotalReviews(total);
        } catch (err) {
            console.error("Failed to load rating distribution:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
      if(!socket){
        return
      }

      const handleRoomRatingUpdate = (
        data: { _id: number; count: number }[],
      ) => {
        console.log("📊 Received room review update:", data); // ✅ 确保这里能触发
        setStats(data);
      };

      socket.on("room-rating-review", handleRoomRatingUpdate);

      return () => {
        socket.off("room-rating-review", handleRoomRatingUpdate);
      }
    }, [socket]);

    // Calculate average rating
    const averageRating =
        stats.length > 0
        ? stats.reduce((acc, item) => acc + item._id * item.count, 0) /
            totalReviews
        : 0;



    return (
      <div className="w-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-blue-50 p-5 md:flex-row md:items-center">
          <div className="flex items-start gap-3">
            <div className="rounded-lg border border-indigo-100 bg-white p-2.5 shadow-sm">
              <MessageCircle className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Review Rating Distribution
              </h2>
              <p className="mt-1 max-w-lg text-sm text-gray-600">
                Real-time distribution of guest ratings
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-lg border border-indigo-100 bg-white px-3 py-2 shadow-sm">
              <BarChart4 className="h-5 w-5 text-indigo-600" />
              <span className="font-medium text-indigo-700">
                Total: <span className="font-bold">{totalReviews}</span> reviews
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => socket?.emit("request-room-rating-review")}
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
                  <DoorOpen className="h-4 w-4 text-indigo-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <div className="space-y-6">
                <Skeleton className="h-8 w-1/2" />
                <div className="flex justify-center">
                  <Skeleton className="h-64 w-64 rounded-full" />
                </div>
                <div className="flex justify-center gap-4">
                  {[1, 2, 3, 4, 5].map((_, i) => (
                    <Skeleton key={i} className="h-6 w-6 rounded-full" />
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <Skeleton className="h-8 w-1/3" />
                {[1, 2, 3, 4, 5].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3"
                  >
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-5 w-5 rounded-full" />
                      <Skeleton className="h-6 w-24" />
                    </div>
                    <Skeleton className="h-6 w-12" />
                  </div>
                ))}
              </div>
            </div>
          ) : totalReviews === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 rounded-full bg-gray-100 p-4">
                <MessageCircle className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="mb-2 text-xl font-medium text-gray-700">
                No Review Data
              </h3>
              <p className="max-w-md text-gray-500">
                There are no reviews available to display. Reviews will appear
                here once guests start rating their stays.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {/* Doughnut chart section */}
              <div className="flex flex-col items-center">
                <div className="relative z-1 h-80 w-full max-w-md">
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
                          titleFont: { size: 14 },
                          bodyFont: { size: 13 },
                          padding: 15,
                          displayColors: true,
                          callbacks: {
                            label: (context) => {
                              const value = context.parsed;
                              const percentage = Math.round(
                                (value / totalReviews) * 100,
                              );
                              return `${context.label}: ${value} reviews (${percentage}%)`;
                            },
                          },
                        },
                      },
                    }}
                  />

                  {/* Center text */}
                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-3xl font-bold text-gray-800">
                      {averageRating.toFixed(1)}
                    </div>
                    <div className="pointer-events-none mt-1 flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`relative -z-1 h-4 w-4 ${
                            i < Math.floor(averageRating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="relative -z-1 mt-1 text-sm text-gray-500">
                      Average Rating
                    </p>
                  </div>
                </div>

                {/* Color indicators */}
                <div className="mt-6 flex flex-wrap justify-center gap-4">
                  {chartData.labels.map((label, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div
                        className="h-4 w-4 rounded-full"
                        style={{ backgroundColor: colors[index] }}
                      ></div>
                      <span className="text-sm text-gray-600">{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rating breakdown section */}
              <div className="flex flex-col">
                <div className="space-y-3">
                  {stats.map((stat, index) => {
                    const rating = stat._id;
                    const count = stat.count;
                    const percentage =
                      totalReviews > 0
                        ? Math.round((count / totalReviews) * 100)
                        : 0;

                    return (
                      <div
                        key={rating}
                        className="rounded-xl border border-gray-100 bg-gray-50 p-4 transition-colors hover:border-indigo-200"
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < rating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="font-medium text-gray-700">
                              {rating} Star
                            </span>
                          </div>
                          <span className="font-semibold text-gray-800">
                            {count}
                          </span>
                        </div>

                        <div className="h-2.5 w-full rounded-full bg-gray-200">
                          <div
                            className="h-2.5 rounded-full"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor: colors[index],
                            }}
                          ></div>
                        </div>

                        <div className="mt-2 flex justify-between text-sm text-gray-500">
                          <span>0%</span>
                          <span>{percentage}%</span>
                          <span>100%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
};

export default RoomReviewDistributionRealTimeChart;
