// BookingTrendRealtimeChart.tsx
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import {
  ArrowDown,
  ArrowUp,
  BarChart4,
  RefreshCw,
  Info,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "@/lib/axios";
import { useSocket } from "@/context/SocketContext";
import { Skeleton } from "@/components/ui/skeleton";

// 注册Chart.js组件
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler,
);

interface BookingDataPoint {
  date: string;
  bookings: number;
}

const timeRanges = [
  { label: "Past 7 days", value: "7d" },
  { label: "Past 30 days", value: "30d" },
  { label: "Past 90 days", value: "90d" },
];

const BookingTrendRealtimeChart = () => {
  const [chartData, setChartData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<string>("7d");
  const [trendPercentage, setTrendPercentage] = useState<number>(0);
  const [showInfo, setShowInfo] = useState(false);
  const { socket } = useSocket();

//  format Diagram
  const formatChartData = (data: BookingDataPoint[]) => {
    if (!data || data.length === 0) 
    {
        return null;
    }

    //Calculate trend percentage
    if (data.length >= 2) {
      const first = data[0].bookings;
      const last = data[data.length - 1].bookings;
      console.log(first);
      console.log(last);
      const percentage = ((last - first) / first) * 100;
      setTrendPercentage(Math.round(percentage));
    }

    return {
      labels: data.map((d) => d.date),
      datasets: [
        {
          label: "Reservation Count",
          data: data.map((d) => d.bookings),
          borderColor: "#3b82f6",
          backgroundColor: "rgba(59, 130, 246, 0.1)",
          borderWidth: 3,
          pointBackgroundColor: "#fff",
          pointBorderColor: "#3b82f6",
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 7,
          tension: 0.3,
          fill: true,
        },
      ],
    };
  };

  // data initialize
  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get<BookingDataPoint[]>(
        "/api/statistic/booking-trend",
        { params: { range: timeRange } },
      );

      setChartData(formatChartData(response.data));
    } catch (err) {
      setError("Unable to load trend chart");
      console.error("Failed to fetch booking trend:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [timeRange]);

  //listen data update
  useEffect(() => {
    if (!socket) return;

    const handleTrendUpdate = (data: BookingDataPoint[]) => {
      console.log("📦 Received booking-trend-update:", data);
      setChartData(formatChartData(data));
    };

    socket.on("booking-trend-update", handleTrendUpdate);

    return () => {
      socket.off("booking-trend-update", handleTrendUpdate);
    };
  }, [socket]);

  // handle time changes
  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value);

    // tell backend what time range i needed
    if (socket) {
      socket.emit("subscribe-booking-trend", { range: value });
    }
  };

  // refresh data
  const handleRefresh = () => {
    fetchData();
  };

  return (
    <div className="w-full flex flex-col overflow-hidden rounded-xl bg-white shadow-lg">
      {/* header */}
      <div className="border-b border-gray-100 p-5">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-3">
              <BarChart4 className="text-blue-500" size={24} />
              <h2 className="text-xl font-bold text-gray-800">
                Real-time Reservation Trends
              </h2>
              <button
                onClick={() => setShowInfo(!showInfo)}
                className="ml-2 text-gray-400 hover:text-blue-500"
              >
                <Info size={18} />
              </button>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Real-time monitoring of hotel reservations
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center rounded-lg bg-blue-50 px-3 py-1.5">
              {trendPercentage >= 0 ? (
                <ArrowUp className="mr-1 text-green-500" size={16} />
              ) : (
                <ArrowDown className="mr-1 text-red-500" size={16} />
              )}
              <span
                className={`font-medium ${
                  trendPercentage >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {Math.abs(trendPercentage)}%
              </span>
            </div>

            <div className="flex items-center overflow-hidden rounded-lg border border-gray-200">
              <select
                value={timeRange}
                onChange={(e) => handleTimeRangeChange(e.target.value)}
                className="appearance-none bg-white px-3 py-1.5 text-sm outline-none"
              >
                {timeRanges.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none px-2 text-gray-400">
                <ChevronDown size={16} />
              </div>
            </div>

            <button
              onClick={handleRefresh}
              className="rounded-lg bg-gray-50 p-2 text-gray-500 transition-colors hover:bg-blue-50 hover:text-blue-500"
            >
              <RefreshCw size={18} />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {showInfo && (
            <motion.div
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              exit={{ opacity: 0, scaleY: 0 }}
              transition={{ duration: 0.3 }}
              className="origin-top overflow-hidden rounded-lg bg-blue-50 p-3 text-sm text-gray-600"
            >
              This chart shows the real-time hotel booking trends.{" "}
              <span className="text-green-500">Green up arrows </span>
              <strong>indicate an increase</strong> in bookings, and{" "}
              <span className="text-rose-500">red down arrows</span>{" "}
              <strong>indicate a decrease</strong> in bookings. The data is
              automatically updated everytime new booking created.
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Chart Area */}
      <div className="h-[400px] p-5">
        {isLoading ? (
          <div className="flex h-full flex-col justify-center gap-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-4/5" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-6 w-5/6" />
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-6 w-4/5" />
            <Skeleton className="h-6 w-3/4" />
          </div>
        ) : error ? (
          <div className="flex h-full flex-col items-center justify-center py-10 text-center">
            <div className="mb-4 rounded-full bg-red-100 p-3">
              <BarChart4 className="text-red-500" size={36} />
            </div>
            <h3 className="mb-2 text-lg font-medium text-gray-800">
              Unable to load data
            </h3>
            <p className="mb-4 max-w-md text-gray-500">
              {error}, please try again later.
            </p>
            <button
              onClick={fetchData}
              className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
            >
              <RefreshCw size={16} />
              <span>Refresh</span>
            </button>
          </div>
        ) : chartData ? (
          <Line
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false,
                },
                tooltip: {
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  titleColor: "#1f2937",
                  bodyColor: "#1f2937",
                  borderColor: "#e5e7eb",
                  borderWidth: 1,
                  padding: 12,
                  boxPadding: 8,
                  usePointStyle: true,
                  callbacks: {
                    title: (items) => {
                      return `Date: ${items[0].label}`;
                    },
                    label: (context) => {
                      return `Bookings: ${context.parsed.y}`;
                    },
                  },
                },
              },
              scales: {
                x: {
                  grid: {
                    display: false,
                  },
                  ticks: {
                    color: "#6b7280",
                    maxRotation: 0,
                    autoSkip: true,
                    maxTicksLimit: 10,
                  },
                },
                y: {
                  grid: {
                    color: "rgba(0, 0, 0, 0.05)",
                  },
                  ticks: {
                    color: "#6b7280",
                    precision: 0,
                  },
                  beginAtZero: true,
                },
              },
              interaction: {
                mode: "index",
                intersect: false,
              },
              animations: {
                tension: {
                  duration: 1000,
                  easing: "linear",
                },
              },
            }}
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center">
            <BarChart4 className="mb-3 text-gray-300" size={48} />
            <p className="text-gray-500">No data available</p>
          </div>
        )}
      </div>

      {/* Bottom Status Area */}
      <div className="flex flex-1 items-center justify-between border-t border-gray-100 bg-gray-50 p-4 text-sm text-gray-500">
        <div>
          <span className="inline-flex items-center">
            <div className="mr-2 h-3 w-3 rounded-full bg-blue-500"></div>
            Real-time data
          </span>
          <span className="mx-2">•</span>
          <span>Last Update: {new Date().toLocaleTimeString()}</span>
        </div>
        <div className="flex items-center">
          <span className="mr-3 flex items-center text-green-500">
            <ArrowUp size={14} className="mr-1" />
            Growth period
          </span>
          <span className="flex items-center text-red-500">
            <ArrowDown size={14} className="mr-1" />
            Decline period
          </span>
        </div>
      </div>
    </div>
  );
};

export default BookingTrendRealtimeChart;
