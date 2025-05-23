import CancelBookingForm from "@/layout/components/cancel-booking-page-component/CancelBookingForm";
import CancelBookingHeader from "@/layout/components/cancel-booking-page-component/CancelBookingHeader";
import { motion } from "framer-motion";
import { CalendarX2 } from "lucide-react";

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
        {/* Intro Section */}
        <section className="mb-12 text-center">
          <div className="inline-flex items-center justify-center rounded-full bg-blue-100 p-4 text-blue-700 shadow">
            <CalendarX2 className="h-8 w-8" />
          </div>
          <h1 className="mt-4 mb-2 text-4xl font-bold text-blue-900">
            Cancel Your Booking
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-blue-700">
            We understand plans change. Use this page to review our cancellation
            policy and submit a request for cancellation. Our team is here to
            assist you every step of the way.
          </p>
        </section>

        {/* Visual Divider */}
        <div className="my-10 border-t border-blue-200"></div>

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
