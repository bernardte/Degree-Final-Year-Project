import React, { useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventInput } from "@fullcalendar/core";
import { Event } from "@/types/interface.type";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Calendar,
  User,
  Users,
  Mail,
  Phone,
  Info,
  Home,
  CheckCircle,
  Clock4,
  MapPin,
  LayoutGrid,
  CalendarDays,
} from "lucide-react";
import { formatDateInBookingCheckOut } from "@/utils/formatDate";

interface EventCalendarViewProps {
  events: Event[];
  isLoading: boolean;
  error: string | null;
}

const EventCalendarView: React.FC<EventCalendarViewProps> = ({
  events,
  isLoading,
  error,
}) => {
  const calendarRef = useRef<FullCalendar>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [viewType, setViewType] = useState<"dayGridMonth" | "dayGridWeek">(
    "dayGridMonth",
  );

  const eventInputs: EventInput[] = events.map((e) => ({
    id: e._id,
    title: `${e.eventType} - ${e.fullname}`,
    start: new Date(e.eventDate),
    extendedProps: e,
    color: getColorByStatus(e.status),
    classNames: ["event-badge", `status-${e.status.toLowerCase()}`],
  }));

  function getColorByStatus(status: string) {
    switch (status.toLowerCase()) {
      case "accept":
        return "#10b981";
      case "rejected":
        return "#ef4444";
      default:
        return "#3b82f6";
    }
  }

  const handleViewChange = (newView: "dayGridMonth" | "dayGridWeek") => {
    setViewType(newView);
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.changeView(newView);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-4 md:p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col items-start justify-between md:flex-row md:items-center">
          <div>
            <h1 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-3xl font-bold text-transparent">
              Event Booking Calendar
            </h1>
          </div>
        </div>

        <div className="mb-8 overflow-hidden rounded-xl bg-white p-4 shadow-lg">
          {isLoading ? (
            <div className="flex h-96 flex-col items-center justify-center space-y-7">
              <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-blue-500" />
              <span className="text-gray-400">Loading Event Calendar...</span>
            </div>
          ) : error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
              <p className="font-medium text-red-700">Error: {error}</p>
              <button className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700">
                Try Again
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => handleViewChange("dayGridMonth")}
                  className={`cursor-pointer rounded-lg px-4 py-2 transition-all ${
                    viewType === "dayGridMonth"
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-white text-slate-700 hover:bg-slate-100 border-2"
                  }`}
                >
                  <span className="flex items-center">
                    <LayoutGrid className="mr-2 h-4 w-4" />
                    Month View
                  </span>
                </button>
                <button
                  onClick={() => handleViewChange("dayGridWeek")}
                  className={`cursor-pointer rounded-lg px-4 py-2 transition-all ${
                    viewType === "dayGridWeek"
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-white text-slate-700 hover:bg-slate-100 border-2"
                  }`}
                >
                  <span className="flex items-center">
                    <CalendarDays className="mr-2 h-4 w-4" />
                    Week View
                  </span>
                </button>
              </div>
              <div className="mt-4 flex gap-2 md:mt-0">
                <FullCalendar
                  ref={calendarRef}
                  plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                  initialView={viewType}
                  views={{
                    dayGridWeek: {
                      type: "dayGrid",
                      duration: { days: 7 },
                      buttonText: "Week View",
                    },
                  }}
                  headerToolbar={{
                    left: "prev,next today",
                    center: "title",
                    right: "",
                  }}
                  events={eventInputs}
                  eventClick={(info) => {
                    const evt = info.event.extendedProps as Event;
                    setSelectedEvent(evt);
                  }}
                  height="auto"
                  dayMaxEventRows={3}
                  eventContent={(arg) => (
                    <div className="flex items-start p-1">
                      <div
                        className="mt-1.5 mr-2 h-2 w-2 flex-shrink-0 rounded-full"
                        style={{ backgroundColor: arg.event.backgroundColor }}
                      ></div>
                      <div className="overflow-hidden">
                        <div className="truncate text-xs font-medium">
                          {arg.event.title}
                        </div>
                      </div>
                    </div>
                  )}
                />
              </div>
              {/* Quick Stats */}
              <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-2">
                {[
                  {
                    count: events.length,
                    label: "Total Events",
                    bg: "bg-indigo-50",
                    border: "border-indigo-100",
                    text: "text-indigo-700 font-semibold",
                  },
                  {
                    count: events.filter((b) => b.status === "Accept").length,
                    label: "Confirmed",
                    bg: "bg-green-50",
                    border: "border-green-100",
                    text: "text-green-700 font-semibold",
                  },
                ].map((stat, idx) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * idx }}
                    className={`rounded-lg ${stat.border} ${stat.bg} p-3 text-center`}
                  >
                    <div className={`text-2xl font-bold ${stat.text}`}>
                      {stat.count}
                    </div>
                    <div
                      className={`text-lg ${stat.text.replace("700", "600")}`}
                    >
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
        {/* Booking Detail Modal */}
        <AnimatePresence>
          {selectedEvent && (
            <motion.div
              className="bg-opacity-70 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEvent(null)}
            >
              <motion.div
                className="mx-4 w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header with status color */}
                <div
                  className="relative p-5 text-white"
                  style={{
                    backgroundColor: getColorByStatus(selectedEvent.status),
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="flex items-center text-xl font-bold">
                        <Home className="mr-2 h-5 w-5" />
                        {selectedEvent.eventType}
                      </h2>
                      <p className="mt-1 flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        {selectedEvent.fullname}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedEvent(null)}
                      className="rounded-full p-1 transition-colors hover:bg-white/20"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>

                  {/* Status badge */}
                  <div className="absolute right-5 -bottom-9">
                    <span
                      className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium shadow-md"
                      style={{
                        backgroundColor:
                          getColorByStatus(selectedEvent.status) + "20",
                        color: getColorByStatus(selectedEvent.status),
                      }}
                    >
                      {selectedEvent.status === "Accept" && "Confirmed"}
                    </span>
                  </div>
                </div>

                {/* Booking Details */}
                <div className="my-5 p-5 pt-7">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="rounded-lg bg-blue-50 p-4">
                      <h3 className="mb-2 flex items-center font-medium text-slate-800">
                        <Calendar className="mr-2 h-4 w-4 text-blue-600" />
                        Event Date
                      </h3>
                      <p className="text-slate-700">
                        {new Date(selectedEvent.eventDate).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            weekday: "short",
                          },
                        )}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-lg bg-green-50 p-4">
                        <h3 className="mb-2 flex items-center font-medium text-slate-800">
                          <Users className="mr-2 h-4 w-4 text-green-600" />
                          Guests
                        </h3>
                        <p className="text-slate-700">
                          {selectedEvent.totalGuests} people
                        </p>
                      </div>

                      <div className="rounded-lg bg-amber-50 p-4">
                        <h3 className="mb-2 flex items-center font-medium text-slate-800">
                          <MapPin className="mr-2 h-4 w-4 text-amber-600" />
                          Event Type
                        </h3>
                        <p className="text-slate-700">
                          {selectedEvent.eventType}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-lg bg-purple-50 p-4">
                        <h3 className="mb-2 flex items-center font-medium text-slate-800">
                          <Mail className="mr-2 h-4 w-4 text-purple-600" />
                          Email
                        </h3>
                        <p className="truncate text-slate-700">
                          {selectedEvent.email}
                        </p>
                      </div>

                      <div className="rounded-lg bg-rose-50 p-4">
                        <h3 className="mb-2 flex items-center font-medium text-slate-800">
                          <Phone className="mr-2 h-4 w-4 text-rose-600" />
                          Phone
                        </h3>
                        <p className="text-slate-700">
                          {selectedEvent.phoneNumber}
                        </p>
                      </div>
                    </div>

                    {/* Additional Information */}
                    {selectedEvent.additionalInfo && (
                      <div className="rounded-lg bg-slate-50 p-4">
                        <h3 className="mb-2 flex items-center font-medium text-slate-800">
                          <Info className="mr-2 h-4 w-4 text-slate-600" />
                          Additional Information
                        </h3>
                        <p className="text-slate-700">
                          {selectedEvent.additionalInfo}
                        </p>
                      </div>
                    )}

                    {/* Booking Timeline */}
                    <div className="mt-2 border-t border-slate-200 pt-4">
                      <div className="flex items-center justify-between text-sm text-slate-600">
                        <div className="flex items-center">
                          <Clock4 className="mr-2 h-4 w-4 text-slate-500" />
                          <span>
                            Created:{" "}
                            {formatDateInBookingCheckOut(
                              selectedEvent.createdAt,
                            )}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="mr-2 h-4 w-4 text-slate-500" />
                          <span>
                            Updated:{" "}
                            {formatDateInBookingCheckOut(
                              selectedEvent.updatedAt,
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default EventCalendarView;
