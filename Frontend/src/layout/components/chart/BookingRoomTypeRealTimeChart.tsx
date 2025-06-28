import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import useToast from "@/hooks/useToast";
import { useSocket } from "@/context/SocketContext";
import {
  BarChart3,
  Hotel,
  Info,
} from "lucide-react";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
);

const BookingRoomTypeRealTimeChart = () => {
  const [stats, setStats] = useState<{ _id: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const socket = useSocket();
  const { showToast } = useToast();

  const labels = stats.map((s) => s._id);
  const dataCounts = stats.map((s) => s.count);

  // Fetch initial statistics data
  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        "/api/statistic/most-booking-room-type-chart",
      );
      setStats(response.data);
    } catch (error: any) {
      if (error?.response?.data?.error) {
        showToast("error", "Failed to load booking data");
      }
      setStats([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Set up socket listeners for real-time updates
  useEffect(() => {
    if (!socket) return;

    const handleRoomTypeUpdate = (data: { _id: string, count: number }[]) => {
      setStats(data)
    }

    socket.on("room-type-update", handleRoomTypeUpdate);

    return () => {
      socket.off("room-type-update", handleRoomTypeUpdate);
    };
  }, [socket]);

  // Color palette for charts
  const colors = [
    "rgba(54, 162, 235, 0.8)",
    "rgba(255, 99, 132, 0.8)",
    "rgba(75, 192, 192, 0.8)",
    "rgba(255, 159, 64, 0.8)",
    "rgba(153, 102, 255, 0.8)",
    "rgba(255, 205, 86, 0.8)",
    "rgba(201, 203, 207, 0.8)",
    "rgba(143, 188, 143, 0.8)",
    "rgba(233, 150, 122, 0.8)",
    "rgba(32, 178, 170, 0.8)",
  ];

  // Bar chart options
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(30, 41, 59, 0.9)",
        titleFont: { size: 14 },
        bodyFont: { size: 13 },
        padding: 12,
        displayColors: true,
        callbacks: {
          label: (context: any) => {
            return `Bookings: ${context.parsed.y}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 12 } },
      },
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
          font: { size: 12 },
        },
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
          drawBorder: false,
        },
      },
    },
    animation: {
      duration: 800,
      easing: "easeOutQuart" as const,
    },
  };

  return (
    <div className="flex flex-col gap-6">
        {/* Bar Chart Card */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-2 border-b border-slate-100 px-5 pt-5 pb-3">
            <div className="flex flex-row items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-indigo-600" />
              <h3 className="text-xl font-bold text-slate-800">
                Room Type Booking Statistics
              </h3>
            </div>
            <p className="flex items-center gap-1 text-slate-600">
              <Info className="h-4 w-4" />
              Real-time updates on popular room types
            </p>
          </div>

          <div className="p-4">
            <div className="h-80">
              {loading ? (
                <div className="flex h-full items-center justify-center">
                  <div className="flex animate-pulse flex-col items-center">
                    <div className="mb-4 h-16 w-16 rounded-full bg-slate-200"></div>
                    <div className="text-slate-500">
                      Loading booking data...
                    </div>
                  </div>
                </div>
              ) : stats.length > 0 ? (
                <Bar
                  data={{
                    labels,
                    datasets: [
                      {
                        label: "Bookings",
                        data: dataCounts,
                        backgroundColor: colors,
                        borderRadius: 6,
                        borderSkipped: false,
                      },
                    ],
                  }}
                  options={barOptions}
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-slate-500">
                  <div className="rounded-full bg-slate-100 p-4">
                    <Hotel className="h-10 w-10" />
                  </div>
                  <p>No booking data available</p>
                </div>
              )}
            </div>
          </div>
        </div>
    </div>
  );
};

export default BookingRoomTypeRealTimeChart;
