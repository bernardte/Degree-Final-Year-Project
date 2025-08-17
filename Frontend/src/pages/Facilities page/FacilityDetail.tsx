import { FormEvent, useEffect, useState } from "react";
import {
  Clock,
  Calendar,
  BookOpen,
  CreditCard,
  Loader2,
  AlertCircleIcon,
} from "lucide-react";
import useFacilityStore from "@/stores/useFacilityStore";
import { useParams } from "react-router-dom";
import * as LucideIcons from "lucide-react";
import { ComponentType } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import axiosInstance from "@/lib/axios";
import useToast from "@/hooks/useToast";
import { motion, Variants } from "framer-motion"; // 导入 Framer Motion

// Animation Variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8 } },
};

const slideIn = {
  hidden: { x: -50, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.6 } },
};

const scaleUp = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { duration: 0.5 } },
};

const FacilityDetailPage = () => {
  const [reservationDate, setReservationDate] = useState<string>("");
  const [reservationTime, setReservationTime] = useState<string>("");
  const [partySize, setPartySize] = useState(2);
  const [reservationName, setReservationName] = useState<string>("");
  const [reservationEmail, setReservationEmail] = useState<string>("");
  const [reservationPhone, setReservationPhone] = useState<string>("");
  const [isReservationSubmitted, setIsReservationSubmitted] =
    useState<boolean>(false);
  const { showToast } = useToast();
  const { fetchCertainFacility, facility, isLoading, error } = useFacilityStore(
    (state) => state,
  );
  const { facilityId } = useParams();

  useEffect(() => {
    if (facilityId) {
      fetchCertainFacility(facilityId);
    }
  }, [fetchCertainFacility]);

  // Handle reservation submission
  const handleReservationSubmit = (
    e: React.FormEvent<HTMLFormElement>,
    category: string,
  ) => {
    e.preventDefault();

    axiosInstance
      .post("/api/reservations/new-reservation", {
        name: reservationName,
        email: reservationEmail,
        phone: reservationPhone,
        date: reservationDate,
        time: reservationTime,
        totalGuest: partySize,
        category,
      })
      .then((response) => setIsReservationSubmitted(response.data.success))
      .catch((error) => {
        let message = "Something went wrong. Please try again.";

        if (error.response) {
          // backend have response error
          message = error.response.data?.error || "Server error.";
        } else if (error.request) {
          // request has been send but no response from backend
          message = "No response from server. Please try again later.";
        } else {
          // others errors such as axios configuration error
          message = error.message;
        }

        showToast("error", message);
      })
      .finally(() => {
        setReservationDate("");
        setReservationTime("");
        setPartySize(2);
        setReservationName("");
        setReservationEmail("");
        setReservationPhone("");
      });
  };

  // Get today's date for min reservation date
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  // Render icon component
  const iconName = facility?.icon as unknown as keyof typeof LucideIcons;
  const Icon = LucideIcons[iconName] as unknown as ComponentType<{
    className?: string;
    style?: React.CSSProperties;
  }>;

  if (isLoading) {
    return (
      <motion.div
        className="flex h-screen items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Loader2 className="h-16 w-16 animate-spin text-blue-600" />
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mx-auto max-w-2xl p-6"
      >
        <Alert variant="destructive">
          <AlertCircleIcon />
          <AlertTitle>Some error occur.</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 px-4 py-6 sm:px-6 lg:px-8 dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-800"
    >
      <div className="mx-auto max-w-7xl">
        {/* Main content */}
        <motion.div
          variants={scaleUp}
          className="mb-8 rounded-2xl bg-white p-8 shadow-xl dark:bg-gray-800"
        >
          <div className="mb-8 flex flex-col justify-between gap-6 lg:flex-row">
            <div>
              <motion.div
                variants={itemVariants}
                className="mb-2 flex items-center"
              >
                <span className="mr-3 inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {facility?.category}
                </span>
              </motion.div>

              <motion.h1
                variants={itemVariants}
                className="text-4xl font-bold text-gray-900 dark:text-white"
              >
                {facility?.facilitiesName}
              </motion.h1>

              <motion.p
                variants={itemVariants}
                className="mt-4 text-lg text-gray-700 dark:text-gray-300"
              >
                {facility?.description}
              </motion.p>
            </div>

            <motion.div
              variants={fadeIn}
              className="flex items-center justify-center"
            >
              <div className="relative">
                <motion.img
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.7 }}
                  src={`${facility?.image}`}
                  className="relative z-0 h-64 w-64 rounded-2xl object-cover"
                />

                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
                  className={`absolute -right-5 -bottom-3 z-50 rounded-full bg-blue-50 p-4 shadow-xl`}
                >
                  {Icon && (
                    <Icon
                      className={`h-7 w-7`}
                      style={{ color: facility?.iconColor }}
                    />
                  )}
                </motion.div>
              </div>
            </motion.div>
          </div>

          <motion.div
            variants={containerVariants}
            className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4"
          >
            <motion.div variants={itemVariants} className="flex items-start">
              <Clock className="mt-1 mr-3 h-8 w-8 text-blue-600 dark:text-blue-400" />
              <div>
                <h3 className="mb-1 text-sm font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                  Hours
                </h3>
                <p className="text-lg font-medium text-gray-800 dark:text-white">
                  {facility?.openTime} - {facility?.closeTime}
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Restaurant reservation section */}
          {facility?.category === "Dining" && (
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-12 rounded-2xl border border-gray-200 bg-gradient-to-br from-blue-50 to-sky-50 p-8 dark:border-gray-700 dark:from-blue-900/10 dark:to-sky-800/10"
            >
              <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                <motion.h2
                  variants={slideIn}
                  className="flex items-center text-3xl font-bold text-gray-900 dark:text-white"
                >
                  <Calendar className="mr-3 h-8 w-8 text-blue-600" />
                  Make a Reservation
                </motion.h2>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center rounded-full bg-blue-100 px-4 py-2 text-blue-800 dark:bg-amber-900/30 dark:text-blue-200"
                >
                  <BookOpen className="mr-2 h-5 w-5" />
                  <span className="font-medium">Reservation</span>
                </motion.div>
              </div>

              {isReservationSubmitted ? (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="rounded-2xl bg-green-50 p-8 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                >
                  <div className="flex flex-col items-center text-center">
                    <motion.div
                      animate={{
                        rotate: [0, 10, -10, 10, 0],
                        scale: [1, 1.1, 1.1, 1.1, 1],
                      }}
                      transition={{ duration: 0.8 }}
                      className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30"
                    >
                      <svg
                        className="h-10 w-10 text-green-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </motion.div>
                    <h3 className="mb-2 text-2xl font-bold">
                      Reservation Confirmed!
                    </h3>
                    <p className="mb-6 max-w-md text-lg">
                      Your reservation table is reserved for {reservationDate}{" "}
                      at {reservationTime}.
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() =>
                        setIsReservationSubmitted(!isReservationSubmitted)
                      }
                      className="transofrm flex cursor-pointer items-center rounded-lg bg-emerald-600 px-6 py-3 font-medium text-white hover:scale-105 hover:bg-emerald-700"
                    >
                      Make a new reservation
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  onSubmit={(event: FormEvent<HTMLFormElement>) =>
                    handleReservationSubmit(event, facility?.category)
                  }
                  className="grid grid-cols-1 gap-8 lg:grid-cols-2"
                >
                  <div className="space-y-6">
                    <motion.div variants={itemVariants}>
                      <h3 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white">
                        Reservation Details
                      </h3>

                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <motion.div variants={itemVariants}>
                          <label
                            className="mb-2 block text-lg font-medium text-gray-700 dark:text-gray-300"
                            htmlFor="date"
                          >
                            Date
                          </label>
                          <div className="relative">
                            <input
                              type="date"
                              id="date"
                              className="w-full rounded-xl border border-gray-300 bg-white py-4 pr-4 pl-12 text-lg focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                              min={getTodayDate()}
                              value={reservationDate}
                              onChange={(e) =>
                                setReservationDate(e.target.value)
                              }
                              required
                            />
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                              <Calendar className="h-6 w-6 text-gray-400" />
                            </div>
                          </div>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                          <label
                            className="mb-2 block text-lg font-medium text-gray-700 dark:text-gray-300"
                            htmlFor="time"
                          >
                            Time
                          </label>
                          <div className="relative">
                            <input
                              type="time"
                              id="time"
                              className="w-full rounded-xl border border-gray-300 bg-white py-4 pr-4 pl-12 text-lg focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                              min={facility.openTime}
                              max={facility.closeTime}
                              value={reservationTime}
                              onChange={(e) =>
                                setReservationTime(e.target.value)
                              }
                              required
                            />
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                              <Clock className="h-6 w-6 text-gray-400" />
                            </div>
                          </div>
                        </motion.div>

                        <motion.div
                          variants={itemVariants}
                          className="md:col-span-2"
                        >
                          <label
                            className="mb-2 block text-lg font-medium text-gray-700 dark:text-gray-300"
                            htmlFor="party"
                          >
                            Number of Guests
                          </label>
                          <div className="flex items-center">
                            <motion.button
                              whileTap={{ scale: 0.95 }}
                              type="button"
                              className="rounded-l-xl bg-gray-200 px-6 py-4 text-2xl text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                              onClick={() =>
                                setPartySize(Math.max(1, partySize - 1))
                              }
                            >
                              -
                            </motion.button>
                            <input
                              type="number"
                              id="party"
                              className="w-full border-t border-b border-gray-300 bg-white px-4 py-4 text-center text-2xl font-bold dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                              min="1"
                              max="20"
                              value={partySize}
                              onChange={(e) =>
                                setPartySize(parseInt(e.target.value) || 1)
                              }
                              required
                            />
                            <motion.button
                              whileTap={{ scale: 0.95 }}
                              type="button"
                              className="rounded-r-xl bg-gray-200 px-6 py-4 text-2xl text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                              onClick={() =>
                                setPartySize(Math.min(20, partySize + 1))
                              }
                            >
                              +
                            </motion.button>
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>
                  </div>

                  <div>
                    <motion.h3
                      variants={itemVariants}
                      className="mb-4 text-xl font-semibold text-gray-800 dark:text-white"
                    >
                      Guest Information
                    </motion.h3>

                    <motion.div
                      variants={scaleUp}
                      className="space-y-6 rounded-2xl bg-white p-6 shadow dark:bg-gray-800"
                    >
                      <motion.div variants={itemVariants}>
                        <label
                          className="mb-2 block text-lg font-medium text-gray-700 dark:text-gray-300"
                          htmlFor="name"
                        >
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-lg focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                          placeholder="Name..."
                          value={reservationName}
                          onChange={(e) => setReservationName(e.target.value)}
                          required
                        />
                      </motion.div>

                      <motion.div variants={itemVariants}>
                        <label
                          className="mb-2 block text-lg font-medium text-gray-700 dark:text-gray-300"
                          htmlFor="email"
                        >
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-lg focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                          placeholder="Email..."
                          value={reservationEmail}
                          onChange={(e) => setReservationEmail(e.target.value)}
                          required
                        />
                      </motion.div>

                      <motion.div variants={itemVariants}>
                        <label
                          className="mb-2 block text-lg font-medium text-gray-700 dark:text-gray-300"
                          htmlFor="phone"
                        >
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-lg focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                          placeholder="Phone..."
                          value={reservationPhone}
                          onChange={(e) => setReservationPhone(e.target.value)}
                          required
                        />
                      </motion.div>

                      <div className="pt-4">
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          type="submit"
                          className="flex w-full transform cursor-pointer items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-xl font-bold text-white shadow-lg transition duration-300 hover:scale-105 hover:from-blue-700 hover:to-blue-800"
                        >
                          <CreditCard className="mr-3 h-6 w-6" />
                          Confirm Reservation
                        </motion.button>
                      </div>
                    </motion.div>
                  </div>
                </motion.form>
              )}
            </motion.div>
          )}

          {/* Additional information for other facilities */}
          {facility?.category !== "Dining" && (
            <motion.div
              variants={fadeIn}
              className="mt-12 rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-700 dark:bg-gray-800"
            >
              <h2 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">
                Facility Information
              </h2>

              <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    <h3>Facility Features</h3>
                    <ul>
                      <li>State-of-the-art equipment and technology</li>
                      <li>Professional staff available for assistance</li>
                      <li>Complimentary towels and amenities</li>
                      <li>Accessible for guests with disabilities</li>
                      <li>Free Wi-Fi throughout the facility</li>
                    </ul>

                    <h3 className="mt-8">Guidelines & Policies</h3>
                    <ul>
                      <li>Please present your room key card for access</li>
                      <li>Reservations are recommended during peak hours</li>
                      <li>Proper attire is required at all times</li>
                      <li>Children under 16 must be accompanied by an adult</li>
                      <li>Operating hours may vary during holidays</li>
                    </ul>

                    <h3 className="mt-8">Accessibility</h3>
                    <p>
                      Our facility is fully accessible with wheelchair ramps,
                      elevators, and accessible restrooms. Please contact our
                      concierge for any special assistance requirements.
                    </p>
                  </div>
                </div>

                <motion.div
                  whileHover={{ y: -5 }}
                  className="rounded-2xl bg-blue-50 p-6 dark:bg-blue-900/20"
                >
                  <h3 className="mb-4 flex items-center text-xl font-semibold text-blue-800 dark:text-blue-300">
                    <Clock className="mr-2 h-6 w-6" />
                    Operating Hours
                  </h3>

                  <div className="space-y-4">
                    <div className="flex justify-between border-b border-blue-200 pb-3 dark:border-blue-800">
                      <span className="text-lg text-blue-700 dark:text-blue-300">
                        Monday - Friday
                      </span>
                      <span className="text-lg font-medium text-blue-900 dark:text-white">
                        {facility?.openTime} - {facility?.closeTime}
                      </span>
                    </div>

                    <div className="flex justify-between border-b border-blue-200 pb-3 dark:border-blue-800">
                      <span className="text-lg text-blue-700 dark:text-blue-300">
                        Saturday
                      </span>
                      <span className="text-lg font-medium text-blue-900 dark:text-white">
                        9:00 - 22:00
                      </span>
                    </div>

                    <div className="flex justify-between border-b border-blue-200 pb-3 dark:border-blue-800">
                      <span className="text-lg text-blue-700 dark:text-blue-300">
                        Sunday
                      </span>
                      <span className="text-lg font-medium text-blue-900 dark:text-white">
                        9:00 - 20:00
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-lg text-blue-700 dark:text-blue-300">
                        Holidays
                      </span>
                      <span className="text-lg font-medium text-blue-900 dark:text-white">
                        10:00 - 18:00
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 rounded-lg bg-blue-100 p-4 dark:bg-blue-900/30">
                    <h4 className="mb-2 font-semibold text-blue-800 dark:text-blue-300">
                      Special Notes
                    </h4>
                    <p className="text-blue-700 dark:text-blue-300">
                      Last admission is 30 minutes before closing time. Facility
                      may close early on special event days.
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default FacilityDetailPage;
