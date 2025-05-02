import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import useBookingStore from "@/stores/useBookingStore";
import { formatDateInBookingCheckOut } from "@/utils/formatDate";
import { capitalize } from "lodash";
import { Loader } from "lucide-react";
import useToast from "@/hooks/useToast";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useNavigate } from "react-router-dom";

const BookingDisplayPage = () => {
  const { error, fetchBooking, isLoading, bookingInformation } =
    useBookingStore((state) => state);
    const { showToast } = useToast();
    const [loadingTarget, setLoadingTarget] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchBooking();
    }, [fetchBooking]);

    if (isLoading) return <div>
        <Loader className="text-blue-500 text-center animate-spin"/>
        </div>;
    if (error) {
        showToast("error", error);
        return <div>An error occurred. Please try again later.</div>;
    }

    
    const handleBreadcrumbClick = (path: string) => {
        setLoadingTarget(path);
        setTimeout(() => {
        navigate(path);
        }, 800);
    };


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
            className="mb-12 text-center text-2xl font-bold text-blue-900 drop-shadow-sm"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            Your Booking Details
          </motion.h1>

          {bookingInformation && bookingInformation.length > 0 ? (
            bookingInformation.map((booking) => (
              <motion.div
                key={booking._id}
                className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-xl hover:shadow-2xl md:flex-row mb-5"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                whileHover={{ y: -3 }}
              >
                <div className="relative flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-50 p-4 md:w-1/3">
                  <motion.img
                    src={booking.qrCodeImageURL}
                    alt="QR Code"
                    className="max-h-100 w-auto object-contain"
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />
                  <div className="absolute right-0 bottom-0 left-0 h-1 bg-gradient-to-r from-blue-400 to-sky-400" />
                </div>
                {/* detail content*/}
                <div className="flex-1 space-y-6 p-4 md:p-6">
                  {/*title*/}
                  <div className="border-b border-blue-100 pb-6">
                    <h2 className="flex items-center gap-3 text-2xl font-bold text-blue-800">
                      Booking # {booking.bookingReference}
                    </h2>
                    <div className="mt-4 flex items-center gap-2">
                      <span
                        className={`status-pill ${
                          booking.status === "pending"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {capitalize(booking.status)}
                      </span>
                      <span
                        className={`status-pill ${
                          booking.paymentStatus === "unpaid"
                            ? "bg-rose-100 text-rose-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {capitalize(booking.paymentStatus)}
                      </span>
                    </div>
                  </div>

                  {/* detail item */}
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                      <DetailItem
                        icon="⏳"
                        label="Check-In"
                        value={formatDateInBookingCheckOut(booking.startDate)}
                        iconColor="text-blue-500"
                      />
                      <DetailItem
                        icon="⌛"
                        label="Check-Out"
                        value={formatDateInBookingCheckOut(booking.endDate)}
                        iconColor="text-blue-500"
                      />
                    </div>
                    <div className="space-y-4">
                      <DetailItem
                        icon="👥"
                        label="Guests"
                        value={`${booking.totalGuests.adults} Adults, ${booking.totalGuests.children} Children`}
                        iconColor="text-blue-500"
                      />
                      <DetailItem
                        icon="🛏️"
                        label="Rooms"
                        value={
                          <div className="flex flex-wrap gap-2">
                            {(Array.isArray(booking.roomType)
                              ? booking.roomType
                              : [booking.roomType]
                            ).map((type, index) => (
                              <span
                                key={index}
                                className="rounded-md bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800"
                              >
                                {type}
                              </span>
                            ))}
                          </div>
                        }
                        iconColor="text-blue-500"
                      />
                    </div>
                  </div>

                  {/* price*/}
                  <div className="flex flex-col items-center justify-between gap-4 pt-6 md:flex-row">
                    <div className="flex items-baseline gap-3">
                      <span className="text-3xl font-bold text-blue-700">
                        RM {booking.totalPrice.toFixed(2)}
                      </span>
                      <span className="text-sm text-blue-400">Total</span>
                    </div>
                    <motion.button
                      className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-sky-500 px-6 py-3 font-semibold text-white transition-all hover:from-blue-700 hover:to-sky-600"
                      whileTap={{ scale: 0.95 }}
                    >
                      📃 View Invoice
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center">
              <div className="mx-auto max-w-md rounded-xl bg-white p-8 shadow-lg">
                <div className="text-6xl text-blue-300">🌊</div>
                <h3 className="mt-4 text-xl font-semibold text-blue-800">
                  No Active Bookings
                </h3>
                <p className="mt-2 text-blue-400">
                  Ready to plan your next room?
                </p>
              </div>
            </div>
          )}
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
  icon: string;
  label: string;
  value: any;
  iconColor?: string;
}) => (
  <div className="flex items-start gap-3">
    <span className={`text-2xl ${iconColor}`}>{icon}</span>
    <div>
      <p className="text-sm font-medium text-blue-400">{label}</p>
      <p className="text-md font-semibold text-blue-800">{value}</p>
    </div>
  </div>
);
