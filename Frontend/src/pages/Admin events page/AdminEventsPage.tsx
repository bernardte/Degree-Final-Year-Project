import EventTable from "@/layout/components/admin-page-component/Event-component/EventTable";
import useEventsStore from "@/stores/useEventsStore";
import { motion } from "framer-motion";
import { CalendarX } from "lucide-react";
import { useEffect } from "react";
import Pagination from "@/layout/components/share-components/Pagination";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
};

const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
};

const AdminEventsPage = () => {
  const { events, isLoading, error, fetchAllEvents, currentPage, totalPages } =
    useEventsStore();

  useEffect(() => {
    fetchAllEvents(1);
  }, [fetchAllEvents]);

  const handlePageChange = (page: number) => {
    fetchAllEvents(page);
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 px-4 py-8 sm:px-8 lg:px-16"
    >
      {/* Header section */}
      <motion.div
        variants={headerVariants}
        className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center"
      >
        <div className="space-y-1">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text pb-3 text-3xl font-bold text-transparent drop-shadow-sm"
          >
            Events Management
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-md text-gray-600"
          >
            Manage event request, availability, and configurations
          </motion.p>
        </div>
      </motion.div>

      {/* Table card */}
      {events.length > 0 ? (
        <motion.div
          variants={cardVariants}
          className="rounded-xl border border-gray-200 bg-white p-4 shadow-xl shadow-blue-50/50 sm:p-6"
          whileHover={{
            boxShadow:
              "0 20px 25px -5px rgb(59 130 246 / 0.1), 0 8px 10px -6px rgb(59 130 246 / 0.1)",
          }}
        >
          <div className="before:animate-shine relative overflow-hidden rounded-lg before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent">
            <EventTable isLoading={isLoading} events={events} error={error} />
            {totalPages > 1 && (
              <Pagination
                onPageChange={handlePageChange}
                currentPage={currentPage}
                totalPages={totalPages}
              />
            )}
          </div>

          {/* Pagination section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4"
          >
            <span className="text-sm text-gray-500">
              Showing {events.length} results
            </span>
          </motion.div>
        </motion.div>
      ) : (
        <div className="flex min-h-[50vh] items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-lg"
          >
            <div className="group relative">
              {/* Decorative background blob */}
              <div className="absolute -inset-2 rounded-3xl bg-blue-50/30 blur-lg transition-opacity duration-300" />

              {/* Main card */}
              <div className="relative rounded-2xl border border-blue-100 bg-white/95 p-8 shadow-lg backdrop-blur-lg transition-all duration-300 hover:border-blue-200 hover:shadow-xl">
                {/* Animated icon container */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="mb-6 inline-flex items-center rounded-full bg-gradient-to-br from-blue-100 to-blue-50 p-4"
                >
                  <CalendarX className="h-12 w-12 text-blue-400/90 transition-colors group-hover:text-blue-500" />
                </motion.div>

                {/* Content */}
                <div className="space-y-3">
                  <h2 className="text-2xl font-bold text-blue-600/90">
                    No Event Requests Available
                  </h2>
                  <p className="text-lg leading-relaxed text-blue-500/80">
                    Currently there are no new event requests in the queue.
                    <br />
                    New submissions will appear here automatically.
                  </p>
                </div>

                {/* Decorative elements */}
                <div className="mt-6 flex justify-center space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="h-1.5 w-1.5 animate-pulse rounded-full bg-sky-500/80"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default AdminEventsPage;
