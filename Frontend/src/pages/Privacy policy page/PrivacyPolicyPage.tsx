import useSystemSettingStore from "@/stores/useSystemSettingStore";
import { useEffect } from "react";

const PrivacyPolicyPage = () => {
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
            Committed to Protecting Your Privacy
          </p>
        </div>

        {/* Content Card */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-xl">
          {/* Decorative Header */}
          <div className="bg-blue-800 px-6 py-4">
            <h2 className="text-center font-serif text-3xl font-bold text-white">
              Privacy Policy
            </h2>
          </div>

          <div className="p-8">
            <div className="mb-6 flex items-center justify-center">
              <div className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-800">
                Last updated: {new Date().toLocaleDateString()}
              </div>
            </div>

            <p className="mb-8 text-center text-lg leading-relaxed text-blue-900">
             {hotelInformation?.name} ("we," "our," or "us") is committed to
              protecting your privacy. This Privacy Policy explains how we
              collect, use, disclose, and safeguard your information when you
              use our online booking services.
            </p>

            {/* Information We Collect Section */}
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
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-blue-800">
                  Information We Collect
                </h3>
              </div>
              <p className="mb-4 font-medium text-blue-800">
                We may collect the following types of information:
              </p>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-lg bg-white p-4 shadow-sm">
                  <h4 className="mb-2 flex items-center font-semibold text-blue-700">
                    <svg
                      className="mr-2 h-5 w-5 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    Personal Information
                  </h4>
                  <p className="text-sm text-blue-800">
                    Name, email address, phone number, payment information, and
                    other details you provide when making a reservation.
                  </p>
                </div>
                <div className="rounded-lg bg-white p-4 shadow-sm">
                  <h4 className="mb-2 flex items-center font-semibold text-blue-700">
                    <svg
                      className="mr-2 h-5 w-5 text-blue-600"
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
                    Booking Information
                  </h4>
                  <p className="text-sm text-blue-800">
                    Dates of stay, room preferences, special requests, and other
                    reservation details.
                  </p>
                </div>
                <div className="rounded-lg bg-white p-4 shadow-sm md:col-span-2">
                  <h4 className="mb-2 flex items-center font-semibold text-blue-700">
                    <svg
                      className="mr-2 h-5 w-5 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                      />
                    </svg>
                    Technical Information
                  </h4>
                  <p className="text-sm text-blue-800">
                    IP address, browser type, device information, and usage data
                    collected through cookies and similar technologies.
                  </p>
                </div>
              </div>
            </div>

            {/* How We Use Your Information Section */}
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
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-blue-800">
                  How We Use Your Information
                </h3>
              </div>
              <p className="mb-4 text-blue-800">
                We use the information we collect for the following purposes:
              </p>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {[
                  "To process and manage your hotel reservations",
                  "To communicate with you about your booking and provide customer support",
                  "To improve our services, website, and user experience",
                  "To send marketing communications (where you have consented)",
                  "To comply with legal obligations and protect our rights",
                ].map((use, index) => (
                  <div key={index} className="flex items-start">
                    <svg
                      className="mt-0.5 mr-2 h-5 w-5 flex-shrink-0 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-sm text-blue-800">{use}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Data Security Section */}
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
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-blue-800">
                  Data Security
                </h3>
              </div>
              <p className="text-blue-800">
                We implement appropriate technical and organizational measures
                to protect your personal information against unauthorized
                access, alteration, disclosure, or destruction. All payment
                transactions are encrypted using SSL technology.
              </p>
              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-lg bg-white p-4 text-center">
                  <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-800">
                    <svg
                      className="h-6 w-6"
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
                  <h4 className="text-sm font-semibold text-blue-700">
                    Encryption
                  </h4>
                  <p className="mt-1 text-xs text-blue-800">
                    All data is encrypted in transit and at rest
                  </p>
                </div>
                <div className="rounded-lg bg-white p-4 text-center">
                  <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-800">
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016zM12 9v2m0 4h.01"
                      />
                    </svg>
                  </div>
                  <h4 className="text-sm font-semibold text-blue-700">
                    Access Controls
                  </h4>
                  <p className="mt-1 text-xs text-blue-800">
                    Strict access controls limit who can view your data
                  </p>
                </div>
                <div className="rounded-lg bg-white p-4 text-center">
                  <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-800">
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h4 className="text-sm font-semibold text-blue-700">
                    Monitoring
                  </h4>
                  <p className="mt-1 text-xs text-blue-800">
                    24/7 monitoring for suspicious activities
                  </p>
                </div>
              </div>
            </div>

            {/* Your Rights Section */}
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
                  Your Rights
                </h3>
              </div>
              <p className="mb-4 text-blue-800">
                Depending on your location, you may have the following rights
                regarding your personal information:
              </p>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {[
                  {
                    icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
                    text: "Right to access and receive a copy of your personal data",
                  },
                  {
                    icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
                    text: "Right to rectify inaccurate or incomplete information",
                  },
                  {
                    icon: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16",
                    text: "Right to erasure of your personal data under certain circumstances",
                  },
                  {
                    icon: "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z",
                    text: "Right to restrict or object to our processing of your personal data",
                  },
                  {
                    icon: "M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4",
                    text: "Right to data portability",
                  },
                ].map((right, index) => (
                  <div
                    key={index}
                    className="flex items-start rounded-lg bg-white p-3 shadow-sm"
                  >
                    <div className="mr-3 flex-shrink-0 rounded-lg bg-blue-100 p-2 text-blue-800">
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d={right.icon}
                        />
                      </svg>
                    </div>
                    <span className="text-sm text-blue-800">{right.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Us Section */}
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
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-blue-800">
                  Contact Us
                </h3>
              </div>
              <p className="mb-4 text-blue-800">
                If you have any questions about this Privacy Policy or our data
                practices, please contact us at:
              </p>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-lg bg-white p-4">
                  <h4 className="mb-2 flex items-center font-semibold text-blue-700">
                    <svg
                      className="mr-2 h-5 w-5 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    Email
                  </h4>
                  <p className="text-blue-800">{hotelInformation?.email}</p>
                </div>
                <div className="rounded-lg bg-white p-4">
                  <h4 className="mb-2 flex items-center font-semibold text-blue-700">
                    <svg
                      className="mr-2 h-5 w-5 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    Address
                  </h4>
                  <p className="text-blue-800">
                    {hotelInformation?.address}
                  </p>
                </div>
              </div>
              <div className="mt-4 rounded-lg bg-white p-4">
                <h4 className="mb-2 flex items-center font-semibold text-blue-700">
                  <svg
                    className="mr-2 h-5 w-5 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Response Time
                </h4>
                <p className="text-blue-800">
                  We strive to respond to all privacy inquiries within 48
                  business hours.
                </p>
              </div>
            </div>

            {/* Policy Updates */}
            <div className="mt-8 rounded-xl bg-blue-100 p-6">
              <div className="flex">
                <svg
                  className="mr-3 h-6 w-6 flex-shrink-0 text-blue-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-blue-800">
                  <strong>Policy Updates:</strong> We may update this Privacy
                  Policy from time to time. We will notify you of any changes by
                  posting the new Privacy Policy on this page and updating the
                  "Last updated" date.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-10 text-center text-sm text-blue-600">
          <p>
            &copy; {new Date().getFullYear()} {hotelInformation?.name}. All rights
            reserved.
          </p>
          <p className="mt-2">
            For questions about our privacy practices, please contact our Data
            Protection Officer at dpo@seraphinehotel.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
