import CancelBookingForm from "@/layout/components/cancel-booking-page-component/CancelBookingForm";
import CancelBookingHeader from "@/layout/components/cancel-booking-page-component/CancelBookingHeader";
import { motion } from "framer-motion";

const CancelBookingPage = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-blue-200 via-sky-100 to-white px-4 py-16 sm:px-6 lg:px-8">
      {/* Decorative Background (Optional SVG pattern) */}
      <div className="pointer-events-none absolute inset-0 bg-[url('/pattern.svg')] bg-repeat opacity-10"></div>

      <motion.div
        className="relative z-10 mx-auto max-w-4xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >

        {/* Visual Divider */}
        <div className="my-1 border-t border-blue-200"></div>

        {/* Policy + Form Components */}
        <div className="space-y-10">
          <CancelBookingHeader />
          <CancelBookingForm />
        </div>
       
      </motion.div>
    </div>
  );
};


export default CancelBookingPage;
