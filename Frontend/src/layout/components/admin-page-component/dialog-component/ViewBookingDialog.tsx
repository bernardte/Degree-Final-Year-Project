import React from "react";
import { Bookings, Room } from "@/types/interface.type";
import { motion, AnimatePresence } from "framer-motion";
import { formatDateInBookingCheckOut } from "@/utils/formatDate";
import {
  X,
  BookOpen,
  Calendar,
  User,
  Mail,
  Bed,
  Users,
  CreditCard,
  Wallet,
  MessageCircle,
  CheckCircle,
  Clock,
  AlertCircle,
  Info,
  ArrowRight,
} from "lucide-react";

interface Props {
  booking: Bookings;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  showModal: boolean;
}

const ViewBookingDialog: React.FC<Props> = ({
  booking,
  setShowModal,
  showModal,
}) => {
  // 获取状态图标和颜色
  const getStatusInfo = () => {
    switch (booking.status) {
      case "completed":
        return {
          icon: <CheckCircle className="text-green-500" />,
          bg: "bg-green-100",
          text: "text-green-700",
          label: "Completed",
        };
      case "pending":
        return {
          icon: <Clock className="text-yellow-500" />,
          bg: "bg-yellow-100",
          text: "text-yellow-700",
          label: "Pending",
        };
      case "confirmed":
        return {
          icon: <Info className="text-blue-500" />,
          bg: "bg-blue-100",
          text: "text-blue-700",
          label: "Confirmed",
        };
      default: // cancelled
        return {
          icon: <AlertCircle className="text-red-500" />,
          bg: "bg-red-100",
          text: "text-red-700",
          label: "Cancelled",
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <>
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Dialog content */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 20 }}
              className="relative max-h-[70vh] w-full max-w-2xl overflow-auto rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 shadow-xl"
            >
              {/* Header */}
              <div className="sticky top-0 z-10 rounded-t-2xl bg-gradient-to-r from-indigo-600 to-blue-700 p-6 text-white">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                        <h2 className="flex items-center gap-2 text-2xl font-bold">
                            <BookOpen className="text-white" />
                            Booking Details
                        </h2>
                        {/* Status badge */}
                        <div
                        className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 ${statusInfo.bg} ${statusInfo.text}`}
                        >
                            {statusInfo.icon}
                            <span className="font-medium">{statusInfo.label}</span>
                        </div>
                    </div>
                    <p className="mt-1 text-indigo-100">
                      {booking.bookingReference}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="rounded-full bg-white/20 p-1.5 transition-colors hover:bg-white/30"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="p-6">
                {/* Guest information */}
                <div className="mb-8">
                  <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-800">
                    <User className="text-indigo-600" />
                    Guest Information
                  </h3>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-indigo-100 p-2.5">
                        <User className="h-5 w-5 text-indigo-700" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Contact Person</p>
                        <p className="font-medium">
                          {booking?.bookingCreatedByUser?.name ||
                            booking?.contactName}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-indigo-100 p-2.5">
                        <Mail className="h-5 w-5 text-indigo-700" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">
                          {booking?.bookingCreatedByUser?.email ||
                            booking?.contactEmail}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Booking details */}
                <div className="mb-8">
                  <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-800">
                    <BookOpen className="text-indigo-600" />
                    Booking Details
                  </h3>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-indigo-100 p-2.5">
                        <Bed className="h-5 w-5 text-indigo-700" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Room Type</p>
                        <div className="mt-1 flex flex-wrap gap-2">
                          {Array.isArray(booking?.room) &&
                            booking.room.map((room: Room, index: number) => (
                              <span
                                key={index}
                                className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 capitalize"
                              >
                                <Bed className="h-3 w-3" />
                                {room.roomType}
                              </span>
                            ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-indigo-100 p-2.5">
                        <Users className="h-5 w-5 text-indigo-700" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Guests</p>
                        <p className="font-medium">
                          {booking.totalGuests.adults} Adults,{" "}
                          {booking.totalGuests.children} Children
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-indigo-100 p-2.5">
                        <Wallet className="h-5 w-5 text-indigo-700" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Total Price</p>
                        <p className="text-xl font-medium text-indigo-600">
                          RM {booking.totalPrice}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-indigo-100 p-2.5">
                        <CreditCard className="h-5 w-5 text-indigo-700" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Payment</p>
                        <p className="font-medium">
                          {booking.paymentMethod}
                          <span className="text-emerald-500 capitalize">
                            &nbsp;({booking.paymentStatus})
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dates */}
                <div className="mb-8">
                  <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-800">
                    <Calendar className="text-indigo-600" />
                    Dates
                  </h3>

                  <div className="flex flex-wrap items-center justify-between rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 p-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Check-In</p>
                      <p className="text-lg font-medium">
                        {formatDateInBookingCheckOut(booking?.startDate)}
                      </p>
                    </div>

                    <div className="p-2 text-indigo-500">
                      <ArrowRight className="h-6 w-6" />
                    </div>

                    <div className="text-center">
                      <p className="text-sm text-gray-500">Check-Out</p>
                      <p className="text-lg font-medium">
                        {formatDateInBookingCheckOut(booking?.endDate)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Special Requests */}
                {booking.specialRequests && (
                  <div className="mb-6">
                    <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-800">
                      <MessageCircle className="text-indigo-600" />
                      Special Requests
                    </h3>

                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                      <p className="text-gray-700">{booking.specialRequests}</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ViewBookingDialog;
