import useToast from "@/hooks/useToast";
import axiosInstance from "@/lib/axios";
import useBookingSessionStore from "@/stores/useBookingSessionStore";
import { motion } from "framer-motion";
import { CheckCircle2, Home, Mail, Calendar } from "lucide-react"; // 添加更多图标
import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { fetchBookingSessionPaymentDetail, error, bookingSession } =
    useBookingSessionStore((state) => state);
  const { showToast } = useToast();
  const { sessionId: bookingSessionId } = bookingSession;
  const { additionalInfo } = useBookingSessionStore.getState();

  useEffect(() => {
    if (sessionId) {
      fetchBookingSessionPaymentDetail(sessionId);
    }
  }, [sessionId]);

  if (error) {
    showToast("error", error);
    return;
  }

  useEffect(() => {
    const createBooking = async () => {
      if (!bookingSessionId) return;

      try {
        const response = await axiosInstance.post(
          "/api/bookings/create-booking",
          { bookingSessionId, specialRequests: additionalInfo },
        );
        if (response.data) {
          showToast("success", "Booking created successfully!");
        } else {
          showToast("error", response?.data?.error);
        }
      } catch (error: any) {
        console.log("Error create booking: ", error?.response?.data?.error);
        showToast("error", error?.response?.data?.error);
      }
    };

    createBooking();
  }, [bookingSessionId]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{
          duration: 0.6,
          type: "spring",
          stiffness: 100,
        }}
        className="w-full max-w-md"
      >
        {/* main content */}
        <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xl">
          {/* top decorative strip */}
          <div className="h-2 bg-gradient-to-r from-green-400 to-emerald-500"></div>

          <div className="p-8">
            {/* success icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: 0.2,
                type: "spring",
                stiffness: 200,
              }}
              className="mb-6 flex justify-center"
            >
              <div className="relative">
                <div className="absolute inset-0 animate-ping rounded-full bg-green-100 opacity-75"></div>
                <CheckCircle2
                  className="relative text-green-500"
                  size={80}
                  strokeWidth={1.5}
                />
              </div>
            </motion.div>

            {/* Title and description */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-8 text-center"
            >
              <h1 className="mb-3 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-3xl font-bold text-gray-800">
                Payment Successful!
              </h1>
              <p className="leading-relaxed text-gray-600">
                Thank you for your booking! Your payment has been processed
                successfully.
              </p>
            </motion.div>

            {/* Extra information card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mb-8 rounded-2xl border border-gray-200 bg-gray-50 p-6"
            >
              <div className="space-y-4">
                <div className="flex items-center text-gray-700">
                  <Mail className="mr-3 h-5 w-5 text-green-500" />
                  <span className="text-sm">Confirmation email sent</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Calendar className="mr-3 h-5 w-5 text-green-500" />
                  <span className="text-sm">
                    Booking details in your account
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Action button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="space-y-4"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full"
              >
                <Link
                  to="/home"
                  className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl"
                >
                  <Home className="h-5 w-5" />
                  Back to Home
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full"
              >
                <Link
                  to="/display-booking"
                  className="flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-gray-300 px-6 py-4 font-semibold text-gray-700 transition-all duration-300 hover:border-green-400 hover:text-green-600"
                >
                  <Calendar className="h-5 w-5" />
                  View My Bookings
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Bottom prompt text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-6 text-center"
        >
          <p className="text-sm text-gray-500">
            Need help?{" "}
            <a
              href="mailto:theseraphinehotel@gmail.com"
              className="font-medium text-green-600 underline hover:text-green-700"
            >
              Contact Support
            </a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;
