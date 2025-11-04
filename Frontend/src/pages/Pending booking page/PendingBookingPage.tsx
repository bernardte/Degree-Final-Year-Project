import { useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  CalendarDays,
  Clock,
  Banknote,
  BedDouble,
  CircleDollarSign,
  AlertCircle,
  Hotel,
  ArrowRight,
  Loader,
  BookText,
  Waves,
  Baby,
  User,
} from "lucide-react";
import useBookingSessionStore from "@/stores/useBookingSessionStore";
import { formatDateInBookingCheckOut } from "@/utils/formatDate";
import { useNavigate } from "react-router-dom";
import useToast from "@/hooks/useToast";
import axiosInstance from "@/lib/axios";

// Animation configurations
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
  exit: { opacity: 0, scale: 0.95 },
};

const listVariants = {
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const buttonHoverVariants= {
  hover: {
    scale: 1.05,
    boxShadow: "0 4px 14px -2px rgba(59, 130, 246, 0.25)",
  },
  tap: { scale: 0.98 },
};

const PendingBookingPage = () => {
  const {
    fetchBookingSessionByUser,
    userBookingSession,
    isLoading,
    error,
    removeBookingSession,
  } = useBookingSessionStore((state) => state);
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Fetch booking sessions on component mount
  useEffect(() => {
    fetchBookingSessionByUser();
  }, [fetchBookingSessionByUser]);

  // Handle payment confirmation
  const handleConfirmPayment = (sessionId: string) => {
    navigate(`/booking/confirm/${sessionId}`);
  };

  // Handle booking cancellation
  const handleCancelBooking = async (sessionId: string) => {
    try {
      const response = await axiosInstance.delete(
        `/api/bookings/delete-booking-session/${sessionId}`,
      );
      if (response?.data) {
        showToast("success", "Booking cancelled successfully");
        removeBookingSession(sessionId);
      }
    } catch (error) {
      showToast("error", "Failed to cancel booking");
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <Loader className="h-12 w-12 animate-spin text-blue-500" />
        </motion.div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="flex items-center gap-4 rounded-xl bg-red-100 px-8 py-6 shadow-lg"
        >
          <AlertCircle className="h-8 w-8 text-red-600" />
          <div>
            <h3 className="text-lg font-semibold text-red-800">
              Loading Error
            </h3>
            <p className="text-red-700">{error}</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mx-auto my-5 max-w-5xl"
      >
        {/* Header Section */}
        <motion.header
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="mb-12 flex items-center justify-between"
        >
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-blue-900">
              Pending Reservations
            </h1>
            <p className="text-blue-700/80">Manage your upcoming bookings</p>
          </div>
          <div className="rounded-full bg-white/80 p-4 shadow-lg">
            <Waves className="h-8 w-8 text-blue-600" />
          </div>
        </motion.header>

        <AnimatePresence mode="wait">
          {userBookingSession.length === 0 ? (
            // Empty state
            <motion.div
              key="empty-state"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="rounded-2xl bg-white/80 p-12 shadow-xl backdrop-blur-sm"
            >
              <div className="flex flex-col items-center gap-8 text-center">
                <motion.div
                  animate={{ y: [0, -15, 0] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                  className="rounded-full bg-blue-100/80 p-6"
                >
                  <BookText className="h-16 w-16 text-blue-600" />
                </motion.div>
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold text-blue-900">
                    No Pending Bookings
                  </h2>
                  <p className="text-lg text-blue-700/80">
                    Ready to plan your next adventure? Let's create a new
                    booking!
                  </p>
                </div>
                <motion.button
                  whileHover="hover"
                  whileTap="tap"
                  variants={buttonHoverVariants}
                  onClick={() => navigate("/filter-room")}
                  className="flex items-center gap-3 rounded-xl bg-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:bg-blue-700"
                >
                  <Hotel className="h-6 w-6" />
                  Start New Booking
                  <ArrowRight className="h-6 w-6" />
                </motion.button>
              </div>
            </motion.div>
          ) : (
            // Booking list
            <motion.div
              key="booking-list"
              variants={listVariants}
              initial="hidden"
              animate="visible"
              className="grid gap-6"
            >
              {userBookingSession.map((booking) => (
                <motion.div
                  key={booking._id}
                  variants={cardVariants}
                  className="overflow-hidden rounded-2xl bg-white/90 shadow-xl backdrop-blur-sm"
                >
                  <div className="p-8">
                    <div className="flex flex-col justify-between gap-8 md:flex-row">
                      {/* Left Section - Booking Details */}
                      <div className="flex-1 space-y-6">
                        <div className="flex items-center gap-4">
                          <div className="rounded-lg bg-blue-100/50 p-3">
                            <BedDouble className="h-8 w-8 text-blue-600" />
                          </div>
                          <h2 className="block text-2xl font-bold break-words text-blue-900">
                            {Array.isArray(booking.roomName)
                              ? booking.roomName.join(", ")
                              : booking.roomName || "No Room Assigned"}
                          </h2>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div className="flex items-center gap-3 text-blue-800/90">
                            <CalendarDays className="h-6 w-6 text-blue-600" />
                            <span>
                              {formatDateInBookingCheckOut(booking.checkInDate)}{" "}
                              -{" "}
                              {formatDateInBookingCheckOut(
                                booking.checkOutDate,
                              )}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-blue-800/90">
                            <User className="h-6 w-6 text-blue-600" />
                            <span>Adults: {booking.totalGuest.adults}</span>
                            <Baby className="h-6 w-6 text-blue-600" />
                            <span>Children: {booking.totalGuest.children}</span>
                          </div>
                          <div className="flex items-center gap-3 text-blue-800/90">
                            <Clock className="h-6 w-6 text-blue-600" />
                            <span>
                              Created:{" "}
                              {formatDateInBookingCheckOut(booking.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right Section - Price & Actions */}
                      <div className="flex flex-col items-end gap-6">
                        <div className="text-right">
                          <div className="flex items-center justify-end gap-2 text-2xl font-bold text-blue-900">
                            <CircleDollarSign className="h-8 w-8 text-green-600" />
                            RM {booking.totalPrice.toFixed(2)}
                          </div>
                          <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-amber-100/80 px-4 py-2 text-sm text-amber-900 capitalize">
                            <Banknote className="h-5 w-5 text-amber-600" />
                            {booking.paymentStatus} Payment
                          </div>
                        </div>

                        <div className="flex gap-4">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() =>
                              handleCancelBooking(booking.sessionId)
                            }
                            className="cursor-pointer rounded-lg bg-red-100/80 px-6 py-2.5 text-red-800 transition-colors hover:bg-red-200/80"
                          >
                            Cancel Reservation
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() =>
                              handleConfirmPayment(booking.sessionId)
                            }
                            className="cursor-pointer rounded-lg bg-blue-600 px-6 py-2.5 text-white shadow-lg transition-colors hover:bg-blue-700"
                          >
                            Complete Payment
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default PendingBookingPage;
