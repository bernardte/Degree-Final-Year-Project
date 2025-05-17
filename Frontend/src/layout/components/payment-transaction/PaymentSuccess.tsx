import useToast from "@/hooks/useToast";
import axiosInstance from "@/lib/axios";
import useBookingSessionStore from "@/stores/useBookingSessionStore";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react"; // A nice checkmark icon
import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { fetchBookingSessionPaymentDetail, error, bookingSession } = useBookingSessionStore(state => state);
  const { showToast } = useToast();
  const { sessionId: bookingSessionId } = bookingSession;
  const { additionalInfo } = useBookingSessionStore.getState();
  console.log("additional Info: ", additionalInfo);

  useEffect(() => {
    if(sessionId){
      fetchBookingSessionPaymentDetail(sessionId);
    }
  }, [sessionId])

  if(error){
    showToast("error", error);
    return;
  }

 console.log(bookingSessionId);

  useEffect(() => {
    const createBooking = async () => {
      if (!bookingSessionId) return; // Wait until it's available

      console.log(bookingSession);

      try {
        const response = await axiosInstance.post(
          "/api/bookings/create-booking",
          { bookingSessionId, specialRequests: additionalInfo },
        );
        if (response.data) {
          showToast("success", "booking created");
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
    <div className="flex min-h-screen items-center justify-center bg-blue-50 px-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center rounded-3xl bg-white p-10 shadow-2xl"
      >
        <CheckCircle2 className="text-green-500 animate-pulse" size={72} />
        <h1 className="mt-6 text-3xl font-bold text-gray-800">
          Payment Successful!
        </h1>
        <p className="mt-2 text-center text-gray-600">
          Thank you for booking with us. <br />A confirmation email has been
          sent to you.
        </p>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="mt-8 rounded-full bg-blue-600 px-8 py-4 font-bold text-white shadow-md transition hover:bg-blue-700"
        >
          <Link to="/home" className="text-white">
            Back to Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;
