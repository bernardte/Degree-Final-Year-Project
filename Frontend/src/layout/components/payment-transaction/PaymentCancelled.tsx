import useToast from "@/hooks/useToast";
import axiosInstance from "@/lib/axios";
import useBookingSessionStore from "@/stores/useBookingSessionStore";
import { motion } from "framer-motion";
import { XCircle, Home, RotateCcw, HelpCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";

const PaymentCancelled = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [bookingSessionId, setBookingSessionId] = useState<string | null>(null)
  const { error } = useBookingSessionStore();
  const { showToast } = useToast();
  const toastShownRef = useRef<boolean>(false);
  useEffect(() => {
    if (!sessionId) return;
    const handlePaymentCancelled = () => {
      axiosInstance
        .get(`/api/checkout/payment-gateway?sessionId=${sessionId}`)
        .then((response) => {
          if (response?.data) {
            if (toastShownRef.current === false){
              showToast("info", response?.data?.message); 
              console.log("booking sessionId: ", response?.data?.bookingSessionId);
              setBookingSessionId(response?.data?.bookingSessionId || null);
            } 
          }
          toastShownRef.current = true;
        })
        .catch((error) => showToast("error", error?.response?.data?.error));
    };

    handlePaymentCancelled();
  }, [sessionId, showToast]);

  if (error) {
    showToast("error", error);
    return;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 via-white to-orange-50 p-4">
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
          {/* top decorative strip  */}
          <div className="h-2 bg-gradient-to-r from-red-400 to-orange-500"></div>

          <div className="p-8">
            {/* cancellation icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                delay: 0.2,
                type: "spring",
                stiffness: 200,
              }}
              className="mb-6 flex justify-center"
            >
              <div className="relative">
                <div className="absolute inset-0 animate-pulse rounded-full bg-red-100 opacity-75"></div>
                <XCircle
                  className="relative text-red-500"
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
              <h1 className="mb-3 bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-3xl font-bold text-gray-800">
                Payment Cancelled
              </h1>
              <p className="mb-4 leading-relaxed text-gray-600">
                Your payment process was interrupted or cancelled. Don't worry -
                you can try again whenever you're ready.
              </p>
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <p className="text-sm font-medium text-amber-800">
                  💡 Your booking details have been saved for 30 minutes
                </p>
              </div>
            </motion.div>

            {/* Common Reason for cancellation */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mb-8 rounded-2xl border border-gray-200 bg-gray-50 p-6"
            >
              <h3 className="mb-3 flex items-center font-semibold text-gray-800">
                <HelpCircle className="mr-2 h-5 w-5 text-red-500" />
                Common reasons for cancellation:
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="mr-2 text-red-400">•</span>
                  Changed your mind
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-red-400">•</span>
                  Payment method issues
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-red-400">•</span>
                  Need to review details
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-red-400">•</span>
                  Technical difficulties
                </li>
              </ul>
            </motion.div>

            {/* Action Button */}
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
                {bookingSessionId ? (
                  <Link
                    to={`/booking/confirm/${bookingSessionId}`}
                    className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-red-500 to-orange-600 px-6 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl"
                  >
                    <RotateCcw className="h-5 w-5" />
                    Try Payment Again
                  </Link>
                ) : (
                  <button
                    disabled
                    className="flex w-full cursor-not-allowed items-center justify-center gap-3 rounded-2xl bg-gray-300 px-6 py-4 font-semibold text-white"
                  >
                    <RotateCcw className="h-5 w-5" />
                    Try Payment Again
                  </button>
                )}
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full"
              >
                <Link
                  to="/home"
                  className="flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-gray-300 px-6 py-4 font-semibold text-gray-700 transition-all duration-300 hover:border-red-400 hover:text-red-600"
                >
                  <Home className="h-5 w-5" />
                  Back to Home
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
            Need assistance?{" "}
            <a
              href="mailto:theseraphinehotel@gmail.com"
              className="font-medium text-red-600 underline hover:text-red-700"
            >
              Contact Our Support Team
            </a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PaymentCancelled;
