import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Calendar, X, User, Users } from "lucide-react";
import useReservationStore from "@/stores/useReservationStore";
import { Reservation } from "@/types/interface.type";

const ReservationCalendarView = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Reservation | null>(null);
  const { fetchAllRestaurantReservation, reservations, error, isLoading } =
    useReservationStore((state) => state);

  console.log(reservations.map((times) => times.time));
  console.log(reservations.map((times) => times.date));
  // Fetch reservations from database
  useEffect(() => {
    fetchAllRestaurantReservation();
  }, [fetchAllRestaurantReservation]);

  const handleEventClick = (clickInfo: any) => {
    const res: Reservation = clickInfo.event.extendedProps as Reservation;

    setSelectedEvent(res);
    setShowModal(true);
  };

  // Custom event rendering with animations
  const eventContent = (eventInfo: any) => {
    const res: Reservation = eventInfo.event.extendedProps as Reservation;
    return (
      <motion.div
        className="h-full rounded-lg border-l-4 p-2 shadow-sm overflow-hidden"
        style={{ borderLeftColor: "#3b82f6" }}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="truncate text-sm font-medium">{res.name}</div>
        <div className="mt-1 flex items-center text-xs">
          <Users size={12} className="mr-1" />
          <span>{res.numberOfGuest} guests</span>
        </div>
        <div className="text-xs">{res.time}</div>
      </motion.div>
    );
  };

  const conbinationOfDateAndTime = (date: Date, timeString: string): Date => {
    // Make a copy of date to avoid modifying the original object
    const newDate = new Date(date);

    // destructure timeString
    const [hours, minutes] = timeString.split(":").map(Number);

    // Set hours and minutes
    newDate.setHours(hours, minutes, 0, 0);

    return newDate;
  };

  if (error) {
    <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
      <p className="font-medium text-red-700">Error: {error}</p>
      <button className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700">
        Try Again
      </button>
    </div>;
  }

  if (isLoading) {
    <div className="flex h-96 flex-col items-center justify-center space-y-7">
      <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-blue-500" />
      <span className="text-gray-400">Loading Event Calendar...</span>
    </div>;
  }

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 to-cyan-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          className="mb-8 flex flex-col items-start justify-between md:flex-row md:items-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-4 md:mb-0">
            <h1 className="mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-3xl font-bold text-transparent">
              Restaurant Reservations Calendar
            </h1>
            <p className="text-gray-600">
              Manage and view all restaurant reservations
            </p>
          </div>
        </motion.div>

        {/* Calendar Component */}
        {!isLoading && (
          <motion.div
            className="rounded-2xl bg-white shadow-lg overflow-hidden"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
              }}
              views={{
                dayGridWeek: {
                  type: "dayGrid",
                  duration: { days: 7 },
                  buttonText: "Week View",
                },
              }}
              initialView={"dayGridMonth"}
              editable={false}
              selectable={false}
              events={reservations.map((res) => ({
                title: res.name,
                start: conbinationOfDateAndTime(res.date, res.time),
                extendedProps: res,
              }))}
              eventClick={handleEventClick}
              eventContent={eventContent}
              dayMaxEventRows={3}
              height="100vh"
              eventDisplay="block"
              eventTimeFormat={{
                hour: "2-digit",
                minute: "2-digit",
                meridiem: "short",
              }}
            />
          </motion.div>
        )}

        {/* Reservation Detail Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white shadow-2xl"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 20 }}
              >
                <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-blue-400 p-6">
                  <h3 className="text-xl font-semibold text-white">
                    Reservation Details
                  </h3>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setSelectedEvent(null);
                    }}
                    className="rounded-full p-1 transition-colors hover:bg-white/20"
                  >
                    <X size={24} color="#fff" />
                  </button>
                </div>

                <div className="p-6">
                  {selectedEvent ? (
                    <div className="space-y-6">
                      {/* Reservation Header */}
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-lg font-medium text-gray-800">
                            {selectedEvent.name}
                          </h4>
                          <p className="mt-1 text-gray-600">
                            {new Date(
                              conbinationOfDateAndTime(
                                selectedEvent.date,
                                selectedEvent.time,
                              ),
                            ).toLocaleDateString("en-US", {
                              month: "long",
                              day: "numeric",
                              weekday: "short",
                            })}{" "}
                            •{" "}
                            {selectedEvent.time &&
                              new Date(
                                conbinationOfDateAndTime(
                                  selectedEvent.date,
                                  selectedEvent.time,
                                ),
                              ).toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              })}
                          </p>
                        </div>
                      </div>

                      {/* Reservation Details */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-lg bg-blue-50 p-4">
                          <div className="mb-2 flex items-center text-blue-700">
                            <Users size={18} className="mr-2" />
                            <p className="text-lg font-semibold">
                              {selectedEvent.numberOfGuest} guests
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Customer Information */}
                      <div className="border-t pt-4">
                        <h5 className="mb-4 flex items-center font-medium text-gray-700">
                          <User size={18} className="mr-2" />
                          Customer Information
                        </h5>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Name:</span>
                            <span className="font-medium">
                              {selectedEvent.name}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Phone:</span>
                            <span className="font-medium">
                              {selectedEvent.phone}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Email:</span>
                            <span className="font-medium">
                              {selectedEvent.email}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Calendar
                              size={18}
                              className="mr-2 text-purple-500"
                            />
                            <span>Category: {selectedEvent.category}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="py-8 text-center">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                        <Plus size={32} className="text-blue-500" />
                      </div>
                      <h4 className="mb-2 text-lg font-medium text-gray-800">
                        Create New Reservation
                      </h4>
                      <p className="text-gray-600">
                        This feature requires database connection
                      </p>
                      <button
                        onClick={() => setShowModal(false)}
                        className="mt-6 rounded-lg bg-blue-500 px-6 py-2 text-white transition-colors duration-200 hover:bg-blue-600"
                      >
                        OK
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ReservationCalendarView;
