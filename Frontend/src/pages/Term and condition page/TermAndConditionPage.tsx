import useSystemSettingStore from "@/stores/useSystemSettingStore";
import { formatTimeWithAMAndPM } from "@/utils/formatTime";
import { useEffect } from "react";

const TermAndConditionPage = () => {
  const { fetchAllHotelInformationInCustomerSide, hotelInformation } =
    useSystemSettingStore();

  useEffect(() => {
    fetchAllHotelInformationInCustomerSide();
  }, [fetchAllHotelInformationInCustomerSide]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 font-serif text-4xl font-bold text-blue-800">
            {hotelInformation?.name}
          </h1>
          <div className="mx-auto mb-4 h-1 w-24 bg-blue-600"></div>
          <p className="text-lg text-blue-600">
            Luxury Stays & Unforgettable Experiences
          </p>
        </div>

        {/* Content Card */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-xl">
          {/* Decorative Header */}
          <div className="bg-blue-800 px-6 py-4">
            <h2 className="text-center font-serif text-3xl font-bold text-white">
              Terms and Conditions
            </h2>
          </div>

          <div className="p-8">
            <div className="mb-6 flex items-center justify-center">
              <div className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-800">
                Last updated: {new Date().toLocaleDateString()}
              </div>
            </div>

            <p className="mb-8 text-center text-lg leading-relaxed text-blue-900">
              Welcome to {hotelInformation?.name} online booking service. These
              Terms and Conditions govern your use of our website and booking
              services. By making a reservation, you agree to be bound by these
              terms.
            </p>

            {/* Reservations Section */}
            <div className="mb-10 rounded-xl border-l-4 border-blue-600 bg-blue-50 p-6">
              <div className="mb-4 flex items-start">
                <div className="mr-4 flex-shrink-0 rounded-lg bg-blue-600 p-2">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-blue-800">
                  Reservations
                </h3>
              </div>
              <p className="mb-4 font-medium text-blue-800">
                When making a reservation:
              </p>
              <ul className="list-none space-y-3">
                <li className="flex items-start">
                  <span className="mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-200 text-blue-800">
                    1
                  </span>
                  <span>
                    You must be at least 18 years old and have the legal
                    authority to enter into binding contracts
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-200 text-blue-800">
                    2
                  </span>
                  <span>
                    You must provide accurate and complete information
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-200 text-blue-800">
                    3
                  </span>
                  <span>
                    You acknowledge that any special requests are subject to
                    availability and not guaranteed
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-200 text-blue-800">
                    4
                  </span>
                  <span>
                    A confirmation email will be sent upon successful booking
                  </span>
                </li>
              </ul>
            </div>

            {/* Rates and Payment Section */}
            <div className="mb-10 rounded-xl border-l-4 border-blue-600 bg-blue-50 p-6">
              <div className="mb-4 flex items-start">
                <div className="mr-4 flex-shrink-0 rounded-lg bg-blue-600 p-2">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-blue-800">
                  Rates and Payment
                </h3>
              </div>
              <p className="mb-4 text-blue-800">
                All rates are displayed in RM and include applicable taxes
                unless otherwise stated.
              </p>
              <ul className="list-none space-y-3">
                <li className="flex items-start">
                  <span className="mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-200 text-blue-800">
                    1
                  </span>
                  <span>
                    Payment is required at the time of booking unless otherwise
                    specified
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-200 text-blue-800">
                    2
                  </span>
                  <span>
                    We accept major credit cards and other payment methods as
                    indicated on our website
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-200 text-blue-800">
                    3
                  </span>
                  <span>
                    Rates are subject to change without notice but confirmed
                    bookings will be honored
                  </span>
                </li>
              </ul>
            </div>

            {/* Cancellation Policy Section */}
            <div className="mb-10 rounded-xl border-l-4 border-blue-600 bg-blue-50 p-6">
              <div className="mb-4 flex items-start">
                <div className="mr-4 flex-shrink-0 rounded-lg bg-blue-600 p-2">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-blue-800">
                  Cancellation Policy
                </h3>
              </div>
              <p className="text-blue-800">
                Cancellations must be made at least 48 hours prior to your
                scheduled arrival date to receive a full refund. Cancellations
                made within 48 hours of arrival will incur a charge equivalent
                to half of the total payment. No-shows will be charged the full
                amount of the reservation.
              </p>
            </div>

            {/* Check-in/Check-out Section */}
            <div className="mb-10 rounded-xl border-l-4 border-blue-600 bg-blue-50 p-6">
              <div className="mb-4 flex items-start">
                <div className="mr-4 flex-shrink-0 rounded-lg bg-blue-600 p-2">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-blue-800">
                  Check-in/Check-out
                </h3>
              </div>
              <p className="mb-4 text-blue-800">
                Standard check-in time is{" "}
                {formatTimeWithAMAndPM(
                  hotelInformation?.checkInTime ?? "3.00 PM",
                )}{" "}
                and check-out time is{" "}
                {formatTimeWithAMAndPM(
                  hotelInformation?.checkOutTime ?? "12.00 AM",
                )}
                .
              </p>
              <ul className="list-none space-y-3">
                <li className="flex items-start">
                  <span className="mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-200 text-blue-800">
                    1
                  </span>
                  <span>
                    Early check-in and late check-out are subject to
                    availability and may incur additional charges
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-200 text-blue-800">
                    2
                  </span>
                  <span>
                    Valid government-issued photo identification and a credit
                    card for incidentals are required at check-in
                  </span>
                </li>
              </ul>
            </div>

            {/* Other Sections */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Limitation of Liability */}
              <div className="rounded-xl border-l-4 border-blue-600 bg-blue-50 p-6">
                <div className="mb-4 flex items-start">
                  <div className="mr-4 flex-shrink-0 rounded-lg bg-blue-600 p-2">
                    <svg
                      className="h-6 w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-blue-800">
                    Limitation of Liability
                  </h3>
                </div>
                <p className="text-sm text-blue-800">
                  {hotelInformation?.name} shall not be liable for any indirect,
                  incidental, special, or consequential damages resulting from
                  the use or inability to use our booking services, even if we
                  have been advised of the possibility of such damages.
                </p>
              </div>

              {/* Governing Law */}
              <div className="rounded-xl border-l-4 border-blue-600 bg-blue-50 p-6">
                <div className="mb-4 flex items-start">
                  <div className="mr-4 flex-shrink-0 rounded-lg bg-blue-600 p-2">
                    <svg
                      className="h-6 w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-blue-800">
                    Governing Law
                  </h3>
                </div>
                <p className="text-sm text-blue-800">
                  These Terms and Conditions are governed by and construed in
                  accordance with the laws of the state where{" "}
                  {hotelInformation?.name} is located. Any disputes shall be
                  subject to the exclusive jurisdiction of the courts in that
                  state.
                </p>
              </div>

              {/* Changes to Terms */}
              <div className="rounded-xl border-l-4 border-blue-600 bg-blue-50 p-6 md:col-span-2">
                <div className="mb-4 flex items-start">
                  <div className="mr-4 flex-shrink-0 rounded-lg bg-blue-600 p-2">
                    <svg
                      className="h-6 w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-blue-800">
                    Changes to Terms
                  </h3>
                </div>
                <p className="text-blue-800">
                  We reserve the right to modify these Terms and Conditions at
                  any time. Changes will be effective immediately upon posting
                  to our website. Your continued use of our booking services
                  constitutes acceptance of the modified terms.
                </p>
              </div>
            </div>

            {/* Acceptance */}
            <div className="mt-10 rounded-xl bg-blue-100 p-6 text-center">
              <p className="font-medium text-blue-800">
                By using our booking services, you acknowledge that you have
                read, understood, and agree to be bound by these Terms and
                Conditions.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-10 text-center text-sm text-blue-600">
          <p>
            © {new Date().getFullYear()} {hotelInformation?.name}. All rights
            reserved.
          </p>
          <p className="mt-2">
            For questions about these Terms and Conditions, please contact us at
            {hotelInformation?.email}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermAndConditionPage;
