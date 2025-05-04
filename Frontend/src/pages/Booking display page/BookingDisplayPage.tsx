import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import useBookingStore from "@/stores/useBookingStore";
import { formatDateInBookingCheckOut } from "@/utils/formatDate";
import { capitalize } from "lodash";
import { Loader, Calendar, Users, BedDouble, Star, ArrowRight } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useNavigate } from "react-router-dom";
import RateReviewDialog from "@/layout/components/review-component/RateReviewDialog";

const BookingDisplayPage = () => {
  const { fetchBooking, isLoading, bookingInformation } =
    useBookingStore((state) => state);
  const [loadingTarget, setLoadingTarget] = useState<string | null>(null);
  const navigate = useNavigate();

  // Track currently selected booking's roomTypes and roomIds for review dialog
  const [selectedBooking, setSelectedBooking] = useState<{
    id: string;
    roomTypes: string[];
    roomIds: string[];
    bookingReference: string;
  } | null>(null);

  useEffect(() => {
    fetchBooking();
  }, [fetchBooking]);

  const getBookingProgress = (status: string) => {
    switch (status) {
      case "pending":
        return 30;
      case "confirmed":
        return 60;
      case "completed":
        return 100;
      default:
        return 0;
    }
  };

  const handleBreadcrumbClick = (path: string) => {
    setLoadingTarget(path);
    setTimeout(() => navigate(path), 800);
  };

  if (isLoading)
    return (
      <div className="pt-20 text-center">
        <Loader className="mx-auto animate-spin text-blue-500" />
      </div>
    );

  return (
    <div className="min-h-screen bg-white bg-gradient-to-b from-sky-100 via-blue-200 to-white font-['Inter']">
      <Breadcrumb className="px-8 pt-2">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleBreadcrumbClick("/");
              }}
              className={
                loadingTarget === "/"
                  ? "font-bold text-gray-700"
                  : "text-blue-600 hover:underline"
              }
            >
              {loadingTarget === "/" ? (
                <span className="animate-caret-blink">Loading...</span>
              ) : (
                "Home"
              )}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbLink href="" className="font-bold text-gray-700">
            View Bookings
          </BreadcrumbLink>
        </BreadcrumbList>
      </Breadcrumb>
      <main className="mx-auto mt-10 max-w-4xl px-4">
        <motion.h1
          className="font-bold bg-gradient-to-r mb-12 from-blue-600 to-sky-500 bg-clip-text text-center text-3xl text-transparent drop-shadow-sm"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          Booking Details
        </motion.h1>

        {bookingInformation && bookingInformation.length > 0 ? (
          bookingInformation.map((booking) => {
            // derive arrays for this booking
            const types = Array.isArray(booking.roomType)
              ? booking.roomType
              : [booking.roomType];
            const ids = Array.isArray(booking.room)
              ? booking.room.map((r) => r)
              : [booking.room];
            console.log(booking.room);
            console.log(types);
            console.log(ids);

            return (
              <div key={booking._id} className="mb-8">
                <motion.div
                  className="group overflow-hidden rounded-2xl bg-white shadow-md transition-shadow duration-300 hover:shadow-xl"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  whileHover={{ y: -3 }}
                >
                  <div className="md:flex">
                    <div className="relative border-r border-blue-100 bg-gradient-to-br from-blue-50 to-white md:w-1/3">
                      <motion.div
                        className="flex h-full items-center justify-center p-8"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <div className="rounded-xl border-4 border-white bg-white p-4 shadow-[0_8px_32px_-4px_rgba(96,165,250,0.3)]">
                          <img
                            src={booking.qrCodeImageURL}
                            alt="QR Code"
                            className="h-auto w-full object-contain"
                          />
                        </div>
                      </motion.div>
                    </div>
                    <div className="flex-1 space-y-6 p-6">
                      <div className="border-b border-blue-100 pb-6">
                        <h2 className="text-2xl font-bold text-blue-800">
                          Booking # {booking.bookingReference}
                        </h2>
                        <div className="mt-3 flex flex-wrap gap-3">
                          <span
                            className={`status-pill ${
                              booking.status === "pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : booking.status === "confirmed"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-green-100 text-green-800"
                            }`}
                          >
                            {capitalize(booking.status)}
                          </span>
                          <span
                            className={`status-pill ${
                              booking.paymentStatus === "unpaid"
                                ? "bg-red-100 text-red-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {capitalize(booking.paymentStatus)}
                          </span>
                        </div>
                        <div className="mt-6">
                          <div className="relative h-3 rounded-full bg-blue-100/80">
                            <motion.div
                              className="h-full rounded-full bg-gradient-to-r from-sky-400 to-blue-600 shadow-inner shadow-blue-200/30"
                              initial={{ width: 0 }}
                              animate={{
                                width: `${getBookingProgress(booking.status)}%`,
                              }}
                              transition={{ duration: 1.5, ease: "circOut" }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <DetailItem
                          icon={<Calendar />}
                          label="Check-In"
                          value={formatDateInBookingCheckOut(booking.startDate)}
                        />
                        <DetailItem
                          icon={<Calendar />}
                          label="Check-Out"
                          value={formatDateInBookingCheckOut(booking.endDate)}
                        />
                        <DetailItem
                          icon={<Users />}
                          label="Guests"
                          value={`${booking.totalGuests.adults} Adults, ${
                            booking.totalGuests.children
                          } Children`}
                        />
                        <DetailItem
                          icon={<BedDouble />}
                          label="Room Type"
                          value={
                            <div className="flex flex-wrap gap-2">
                              {types.map((t, i) => (
                                <span
                                  key={i}
                                  className="rounded bg-blue-100 px-3 py-1 text-sm text-blue-800 capitalize"
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                          }
                        />
                      </div>

                      <div className="flex flex-col items-center justify-between gap-4 pt-6 md:flex-row">
                        <div className="text-3xl font-bold text-blue-700">
                          <span className="text-2xl">Total: </span>
                          RM {booking.totalPrice.toFixed(2)}
                        </div>
                        <motion.button className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-sky-500 px-6 py-3 font-semibold text-white">
                          📃 View Invoice
                        </motion.button>
                      </div>

                      {/* Review Button */}
                      {new Date(formatDateInBookingCheckOut(booking.endDate)) <
                        new Date() && (
                        <motion.div
                          className="border-t border-emerald-50 pt-6"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4, type: "spring" }}
                        >
                          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-50/80 to-white p-1 shadow-inner backdrop-blur-sm">
                            {/* 动态渐变边框 */}
                            <motion.div
                              className="absolute inset-0 bg-[conic-gradient(from_90deg_at_50%_50%,#059669_0%,#10b981_50%,transparent_100%)] opacity-20"
                              animate={{ rotate: [0, 360] }}
                              transition={{
                                duration: 8,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                            />

                            {/* rate and review button*/}
                            <motion.button
                              onClick={() =>
                                setSelectedBooking({
                                  id: booking._id,
                                  roomTypes: types,
                                  roomIds: ids,
                                  bookingReference: booking.bookingReference,
                                })
                              }
                              className="group relative flex w-full items-center justify-between gap-4 rounded-xl bg-gradient-to-r from-green-600 to-emerald-500 px-6 py-4 shadow-lg backdrop-blur-md transition-all hover:shadow-xl"
                              whileHover={{
                                scale: 1.02,
                                boxShadow:
                                  "0 10px 30px -5px rgba(5, 150, 105, 0.3)",
                              }}
                              whileTap={{ scale: 0.98 }}
                            >
                              {/* 左侧内容 */}
                              <div className="flex items-center gap-4">
                                <div className="relative pl-2">
                                  <Star
                                    className="h-7 w-7 text-amber-300 transition-all group-hover:scale-110 group-hover:rotate-12"
                                    fill="currentColor"
                                  />
                                  <div className="absolute -inset-4 bg-[radial-gradient(circle,rgba(255,255,255,0.4)_0%,transparent_70%)] opacity-0 transition-opacity group-hover:opacity-30" />
                                </div>
                                <div className="text-left">
                                  <h3 className="text-lg font-semibold text-white">
                                    Share Your Stay Experience
                                  </h3>
                                  <p className="mt-1 text-sm font-medium text-emerald-100">
                                    Help others choose their perfect room
                                  </p>
                                </div>
                              </div>

                              {/* 右侧装饰 */}
                              <div className="flex items-center gap-3 pr-2">
                                <span className="rounded-full bg-white/20 px-3 py-1.5 text-sm font-medium text-white">
                                  {types.length} Rooms to Review
                                </span>
                                <div className="relative h-8 w-8">
                                  <div className="animate-pulse-scale absolute inset-0 rounded-full bg-white/20" />
                                  <ArrowRight className="absolute top-1 left-1 h-6 w-6 text-white" />
                                </div>
                              </div>

                              {/* 动态光效 */}
                              <div
                                className="absolute inset-0 bg-[radial-gradient(circle_at_var(--x)_var(--y),rgba(255,255,255,0.3)_0%,transparent_70%)] opacity-0 transition-opacity group-hover:opacity-30"
                                // 动态鼠标坐标跟踪（需配合JS事件处理）
                                style={
                                  {
                                    "--x": "calc(100% - 40px)",
                                    "--y": "50%",
                                  } as React.CSSProperties &
                                    Record<string, string>
                                }
                              />
                            </motion.button>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </div>
            );
          })
        ) : (
          <div className="text-center">
            <div className="mx-auto max-w-md rounded-xl bg-white p-8 shadow-lg">
              <div className="text-6xl text-blue-300 animate-pulse">🌊</div>
              <h3 className="mt-4 text-xl font-semibold text-blue-800">
                No Active Bookings
              </h3>
              <p className="mt-2 text-blue-400">
                Ready to plan your next room?
              </p>
            </div>
          </div>
        )}

        <RateReviewDialog
          open={selectedBooking !== null}
          onClose={() => setSelectedBooking(null)}
          roomTypes={selectedBooking?.roomTypes || []}
          roomIds={selectedBooking?.roomIds || []}
          bookingReference={selectedBooking?.bookingReference || ""}
        />
      </main>
    </div>
  );
};

export default BookingDisplayPage;

const DetailItem = ({
  icon,
  label,
  value,
  iconColor = "text-blue-500",
}: {
  icon: React.ReactNode;
  label: string;
  value: any;
  iconColor?: string;
}) => (
  <div className="flex items-start gap-3">
    <span className={`text-2xl ${iconColor}`}>{icon}</span>
    <div>
      <p className="text-sm font-medium text-blue-400">{label}</p>
      {typeof value === "string" || typeof value === "number" ? (
        <p className="text-md font-semibold text-blue-800">{value}</p>
      ) : (
        <div className="text-md font-semibold text-blue-800">{value}</div>
      )}
    </div>
  </div>
);
