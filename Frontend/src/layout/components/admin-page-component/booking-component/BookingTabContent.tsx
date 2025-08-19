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
import { Input } from "@/components/ui/input";
import { useState } from "react";

const BookingTabContent = ({
  fetchAllBooking,
}: {
  fetchAllBooking: (page: number, limit: number, searchTerm: string) => Promise<void>;
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { bookings, currentPage, totalPages } = useBookingStore();

  const handlePageChange = (page: number, limit = 10, searchTerm: "") => {
    fetchAllBooking(page, limit, searchTerm);
  };

  const handleSearch = (page: number, limit: number, searchTerm: string) => {
    if(searchTerm.trim() === "") {
      return;
    }
    fetchAllBooking(page, limit, searchTerm);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen space-y-6 overflow-visible"
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
                <div className="my-4 ml-2 flex items-center gap-3">
                  <Input
                    placeholder="Search by booking reference or Email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm rounded-lg border-gray-300 transition focus:border-blue-500 focus:ring focus:ring-blue-200"
                  />
                  <button
                    onClick={() => handleSearch(1, 10, searchTerm)}
                    className="hover:scale-105 focus:ring-opacity-75 flex min-w-[100px] transform items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 font-medium text-white shadow-lg shadow-blue-500/30 transition-all duration-200 hover:from-blue-600 hover:to-blue-700 focus:ring-2 focus:ring-blue-400 focus:outline-none active:scale-[98%]"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-2 h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    Search
                  </button>
                </div>

                <BookingTable />
                {totalPages > 1 && (
                  <Pagination
                    onPageChange={handlePageChange}
                    currentPage={currentPage}
                    totalPages={totalPages}
                  />
                )}
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
                  <button onClick={() => fetchAllBooking(1, 10, "")} className="mt-4 inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-2 text-white shadow-md transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400">
                    Refresh
                  </button>
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
      </Card>
    </motion.div>
  );
};

export default BookingTabContent;
