import useToast from "@/hooks/useToast";
import useBookingSessionStore from "@/stores/useBookingSessionStore";
import { motion } from "framer-motion";
import { XCircle } from "lucide-react"; // Cancel icon
import { useSearchParams } from "react-router-dom";

const PaymentCancelled = () => {
   const [searchParams] = useSearchParams();
   const sessionId = searchParams.get("session_id");
   const { error } = useBookingSessionStore();
   const { showToast } = useToast();
   console.log(sessionId);

  if (error) {
    showToast("error", error);
    return;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-red-50 px-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center rounded-3xl bg-white p-10 shadow-2xl"
      >
        <XCircle className="text-red-500 animate-pulse" size={72} />
        <h1 className="mt-6 text-3xl font-bold text-gray-800">
          Payment Cancelled
        </h1>
        <p className="mt-2 text-center text-gray-600">
          It looks like your payment didn’t go through. <br />
          You can try booking again at any time.
        </p>

        <motion.a
          href="/"
          whileHover={{ scale: 1.05 }}
          className="mt-8 rounded-full bg-red-500 px-8 py-4 font-bold text-white shadow-md transition hover:bg-red-600"
        >
          Back to Home
        </motion.a>
      </motion.div>
    </div>
  );
};

export default PaymentCancelled;
