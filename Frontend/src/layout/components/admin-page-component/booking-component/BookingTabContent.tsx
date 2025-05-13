import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { CalendarClock } from "lucide-react";
import BookingTable from "./BookingTable";

const BookingTabContent = () => {
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
        <CardContent className="mt-4">
          <div className="overflow-hidden rounded-lg border border-blue-200 bg-white/70 p-2 shadow-inner backdrop-blur">
            <div className="w-full overflow-x-auto">
              <BookingTable />
            </div>
          </div>

          {/* Status Summary */}
          <div className="mt-6 flex flex-wrap gap-4">
            {["Pending", "Cancel"].map((status, index) => (
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
                <span className="flex items-center gap-2 text-sm font-medium text-blue-800">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-blue-500" />
                  {status} Bookings
                  <span className="text-blue-600">
                    ({Math.floor(Math.random() * 50)})
                  </span>
                </span>
              </motion.div>
            ))}
          </div>
        </CardContent>

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
}

export default BookingTabContent;
