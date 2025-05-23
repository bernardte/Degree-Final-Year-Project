import { Clock, HelpCircle, ShieldAlert, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const CancelBookingHeader = () => {
  return (
    <motion.div
      className="mb-12 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <div className="mb-6 inline-flex items-center justify-center rounded-full bg-blue-100 p-4 text-blue-700 shadow-sm">
        <ShieldAlert className="h-8 w-8" />
      </div>

      <h1 className="mb-3 text-4xl font-bold text-blue-900">
        Cancellation Policy
      </h1>
      <p className="mx-auto max-w-xl text-lg text-blue-700">
        Life happens. We're here to make cancellation easy, clear, and
        stress-free. Review our terms below.
      </p>

      {/* Policy Card */}
      <div className="relative mt-10 rounded-xl border border-blue-200 bg-gradient-to-br from-white via-blue-50 to-white p-8 shadow-lg">
        <h2 className="mb-6 text-2xl font-semibold text-blue-900">
          Our Cancellation Terms
        </h2>
        <ul className="list-disc space-y-4 pl-6 text-left text-blue-700">
          <li>
            <span className="font-medium text-blue-800">
              48+ hours before check-in:
            </span>{" "}
            Full refund.
          </li>
          <li>
            <span className="font-medium text-blue-800">
              Within 48 hours of check-in:
            </span>{" "}
            50% charge applies.
          </li>
          <li>
            <span className="font-medium text-blue-800">No-shows:</span> Full
            amount charged.
          </li>
          <li>
            <span className="font-medium text-blue-800">Refund process:</span>{" "}
            5–7 business days.
          </li>
        </ul>


        {/* Decorative line */}
        <div className="mt-8 border-t border-blue-100 pt-4 text-sm text-blue-600 italic" />
        <section className="mt-16 rounded-lg border border-blue-200 bg-white p-8 shadow-lg">
          <h2 className="mb-6 text-center text-2xl font-semibold text-blue-900">
            Things to Know Before Cancelling
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            <InfoCard
              icon={<Clock className="h-6 w-6 text-blue-600" />}
              title="Timing Matters"
              description="Full refunds are available if you cancel at least 48 hours before check-in. Read more in our policy above."
            />
            <InfoCard
              icon={<ShieldCheck className="h-6 w-6 text-green-600" />}
              title="Secure Process"
              description="All cancellation requests are processed securely, and refunds are issued within 5–7 business days."
            />
            <InfoCard
              icon={<HelpCircle className="h-6 w-6 text-yellow-600" />}
              title="Need Help?"
              description="If you're unsure about your cancellation eligibility, reach out to our support team for guidance."
            />
          </div>
        </section>
      </div>
    </motion.div>
  );
};

export default CancelBookingHeader;


// Reusable Card for Info Section
const InfoCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => {
  return (
    <div className="flex flex-col items-start rounded-xl border border-blue-100 bg-blue-50 p-6 transition-shadow duration-300 hover:shadow-md">
      <div className="mb-4">{icon}</div>
      <h3 className="mb-2 text-lg font-semibold text-blue-900">{title}</h3>
      <p className="text-sm text-blue-700">{description}</p>
    </div>
  );
};
