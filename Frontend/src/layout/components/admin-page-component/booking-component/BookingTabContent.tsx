import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import { CalendarClock } from "lucide-react";
import BookingTable from "./BookingTable";
import useBookingStore from "@/stores/useBookingStore";
import Pagination from "../../share-components/Pagination";

const BookingTabContent = ({
  fetchAllBooking,
}: {
  fetchAllBooking: (page: number) => Promise<void>;
}) => {
  const { bookings, currentPage, totalPages } = useBookingStore();

  const handlePageChange = (page: number) => {
    fetchAllBooking(page);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen space-y-6 overflow-visible px-4 sm:px-6 lg:px-8"
    >
      <Card className="relative mx-auto w-full max-w-7xl overflow-visible rounded-2xl border border-blue-200/40 bg-gradient-to-br from-white via-blue-50 to-blue-100 p-6 shadow-xl backdrop-blur-md">
        {/* Floating Decorative Blobs */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-24 -left-20 h-60 w-60 rounded-full bg-blue-300/20 blur-2xl" />
          <div className="absolute -right-20 -bottom-24 h-60 w-60 rounded-full bg-indigo-200/20 blur-2xl" />
        </div>

        {/* Card Header */}
        <CardHeader>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <CardTitle className="flex items-center gap-4">
              <div className="relative rounded-full bg-blue-100 p-2">
                <CalendarClock className="h-7 w-7 animate-pulse text-blue-600" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-blue-800">
                  Booking Management
                </h2>
                <CardDescription className="text-sm text-blue-600/80">
                  Manage system Booking with real-time updates and controls.
                </CardDescription>
              </div>
            </CardTitle>
          </motion.div>
        </CardHeader>

        {/* Booking Table Section */}
        {bookings.length > 0 ? (
          <CardContent className="mt-4">
            <div className="overflow-hidden rounded-lg border border-blue-200 bg-white/70 p-2 shadow-inner backdrop-blur">
              <div className="w-full overflow-x-auto">
                <BookingTable />
                <Pagination
                  onPageChange={handlePageChange}
                  totalPages={totalPages}
                  currentPage={currentPage}
                />
              </div>
            </div>

            {/* Status Summary */}
            <div className="mt-6 flex flex-wrap gap-4">
              {["Pending", "Confirmed", "Cancelled", "Completed"].map(
                (status, index) => (
                  <motion.div
                    key={status}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      delay: 0.5 + index * 0.1,
                      stiffness: 100,
                      damping: 12,
                    }}
                    className="rounded-lg border border-blue-200 bg-gradient-to-br from-blue-100 via-white to-blue-50 px-4 py-2 shadow-sm backdrop-blur-sm"
                  >
                    <span
                      className={`flex items-center gap-2 text-sm font-medium ${
                        status === "Pending"
                          ? "text-amber-300"
                          : status === "Confirmed"
                            ? "text-blue-500"
                            : status === "Cancelled"
                              ? "text-rose-500"
                              : "text-emerald-500"
                      }`}
                    >
                      <span className="h-2 w-2 animate-pulse rounded-full bg-blue-400" />
                      {status} Bookings
                      <span>
                        (
                        {
                          bookings.filter(
                            (booking) =>
                              booking?.status === status.toLowerCase(),
                          ).length
                        }
                        )
                      </span>
                    </span>
                  </motion.div>
                ),
              )}
            </div>
          </CardContent>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center justify-center px-4 py-12 text-center"
          >
            <div className="relative w-full max-w-md">
              {/* Background effect */}
              <div className="absolute -inset-2 rounded-3xl bg-blue-50/40 blur-xl" />

              {/* Main card */}
              <div className="relative rounded-2xl border border-blue-100 bg-white/95 p-8 shadow-lg backdrop-blur-lg transition-shadow duration-300 hover:shadow-xl">
                {/* Animated icon */}
                <motion.div
                  animate={{ rotate: [-5, 5, -5] }}
                  transition={{ repeat: Infinity, duration: 4 }}
                  className="mb-6 inline-flex rounded-full bg-gradient-to-br from-blue-100 to-blue-50 p-4"
                >
                  <CalendarClock className="h-12 w-12 text-blue-400/90" />
                </motion.div>

                {/* Content */}
                <div className="space-y-3">
                  <h2 className="text-2xl font-bold text-blue-600/90">
                    No Booking Found
                  </h2>
                  <p className="text-lg leading-relaxed text-blue-500/80">
                    We couldn't find any active booking sessions.
                    <br />
                    Start by creating a new reservation or check your search
                    parameters.
                  </p>
                </div>

                {/* Animated decorative dots */}
                <div className="mt-6 flex justify-center space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="h-2 w-2 rounded-full bg-blue-300"
                      animate={{ scale: [1, 1.4, 1] }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.5,
                        delay: i * 0.3,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
        {/* Floating Particle Effects */}
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="pointer-events-none absolute h-5 w-5 rounded-full bg-blue-400/30"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${7 + Math.random() * 3}s infinite ease-in-out`,
            }}
          />
        ))}
      </Card>
    </motion.div>
  );
};

export default BookingTabContent;
