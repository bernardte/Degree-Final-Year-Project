import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventInput } from "@fullcalendar/core";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState, useMemo } from "react";
import {
  User,
  Phone,
  Mail,
  Bed,
  ClipboardList,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";


// Enhanced color scheme for hotel booking statuses
const BOOKING_STATUS_COLORS = {
  pending: "#F59E0B", // Amber - Payment pending
  confirmed: "#3B82F6", // Emerald green - Booking confirmed
  cancelled: "#EF4444", // Red - Booking cancelled
  completed: "#10B981", // Violet - Stay completed
} as const;

type BookingStatus = keyof typeof BOOKING_STATUS_COLORS;

// Reusable function to get booking status color
export const getBookingStatusColor = (status: BookingStatus) => {
  return BOOKING_STATUS_COLORS[status] || "#3B82F6"; // Default to blue
};

interface CalendarViewProps {
  events: EventInput[];
}

interface BookingTooltipProps {
  booking: {
    contactName: string;
    contactEmail: string;
    contactNumber: string;
    roomType: string;
    nights: number;
    guests: number;
    specialRequests?: string;
    status: BookingStatus;
    totalPrice: string;
    reference: string;
  };
  children: React.ReactNode;
}

/**
 * BookingTooltip Component - Enhanced tooltip with color-coded information
 * @param booking - Detailed booking information
 * @param children - Tooltip trigger element
 */
const BookingTooltip = ({ booking, children }: BookingTooltipProps) => {
  // Status-specific icons and text colors
  const statusConfig = {
    pending: { icon: <Clock size={16} />, color: "text-amber-600" },
    confirmed: { icon: <CheckCircle size={16} />, color: "text-blue-600" },
    cancelled: { icon: <XCircle size={16} />, color: "text-red-600" },
    completed: { icon: <CheckCircle size={16} />, color: "text-emerald-600" },
  };

  const status = statusConfig[booking.status] || statusConfig.pending;

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent className="min-w-[300px] rounded-xl border-0 bg-white p-0 shadow-xl z-10000">
          <div
            className="rounded-t-xl px-4 py-3 font-bold text-white"
            style={{ backgroundColor: getBookingStatusColor(booking.status) }}
          >
            <div className="flex items-center justify-between">
              <span>Booking #{booking.reference}</span>
              <span className="flex items-center ml-5 gap-1">
                {status.icon}
                <span>
                  {booking.status.charAt(0).toUpperCase() +
                    booking.status.slice(1)}
                </span>
              </span>
            </div>
          </div>

          <div className="p-4">
            <div className="mb-4">
              <h3 className="flex items-center gap-2 text-lg font-bold">
                <User className="text-blue-500" size={18} />
                <span className="text-sky-700">{booking.contactName}</span>
              </h3>
              <div className="mt-2 grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <Mail className="text-rose-500" size={16} />
                  <span className="text-rose-600">{booking.contactEmail}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="text-teal-500" size={16} />
                  <span className="text-teal-600">{booking.contactNumber}</span>
                </div>
              </div>
            </div>

            <div className="mb-4 grid grid-cols-3 gap-2 rounded-lg bg-slate-50 p-3">
              <div className="text-center">
                <div className="text-sm text-gray-500">Room Type</div>
                <div className="font-bold text-indigo-700">
                  {booking.roomType}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-500">Nights</div>
                <div className="font-bold text-amber-600">{booking.nights}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-500">Guests</div>
                <div className="font-bold text-emerald-600">
                  {booking.guests}
                </div>
              </div>
            </div>

            <div className="mb-3 flex justify-between border-t pt-3">
              <span className="font-medium text-emerald-700">Total Amount:</span>
              <span className="font-bold text-green-600">RM {Number(booking.totalPrice).toFixed(2)}</span>
            </div>

            {booking.specialRequests && (
              <div className="rounded-lg bg-amber-50 p-3">
                <div className="flex items-center gap-2 font-medium text-amber-700">
                  <ClipboardList size={16} />
                  <span>Special Requests</span>
                </div>
                <p className="mt-1 text-sm text-amber-800">
                  {booking.specialRequests}
                </p>
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

/**
 * CalendarView Component - Premium hotel booking calendar
 * @param events - Array of booking events
 */
const CalendarView = ({ events }: CalendarViewProps) => {
  const [activeEvent, setActiveEvent] = useState<string | null>(null);

  // Apply status colors to events
  const styledEvents = useMemo(() => {
    return events.map((event) => {
      const status = (event.status as BookingStatus) || "pending";
      console.log(event);
      return {
        ...event,
        backgroundColor: `${getBookingStatusColor(status)}20`, // 20% opacity
        borderColor: getBookingStatusColor(status),
        textColor: "#1f2937", // Dark gray text
        extendedProps: {
          ...event.extendedProps,
          status: status,
        },
      };
    });
  }, [events]);

  // Custom event content renderer
  const renderEventContent = (eventInfo: any) => {
    const bookingData = eventInfo.event.extendedProps;
    console.log(bookingData);
    return (
      <BookingTooltip
        booking={{
          contactName: bookingData.contactName || "No Name",
          contactEmail: bookingData.contactEmail || "No Email",
          contactNumber: bookingData.contactNumber || "No Phone",
          roomType: bookingData.roomType || "Standard Room",
          nights: bookingData.nights || 1,
          guests: bookingData.totalGuests || 1,
          specialRequests: bookingData.specialRequests,
          status: bookingData.status || "pending",
          totalPrice: bookingData.totalPrice || "RM 0.00",
          reference: bookingData.booking || "N/A",
        }}
      >
        <div
          className="fc-event-inner p-2 hover:shadow-md"
          style={{
            borderLeft: `4px solid ${getBookingStatusColor(bookingData.status)}`,
          }}
        >
          <div className="flex items-start">
            <div className="fc-event-time font-semibold text-gray-700">
              {eventInfo.timeText}
            </div>
          </div>
          <div className="fc-event-title mt-1 font-bold text-gray-900">
            {eventInfo.event.title}
          </div>
          <div className="mt-1 flex items-center gap-2">
            <span className="flex items-center gap-1 text-sm font-medium">
              <Bed size={14} className="text-indigo-500" />
              <span className="text-indigo-700">{bookingData.roomType}</span>
            </span>
          </div>
        </div>
      </BookingTooltip>
    );
  };

  return (
    <div className="rounded-2xl bg-white p-4 shadow-xl">
      <div className="fullcalendar-container">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={styledEvents}
          height="auto"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,dayGridWeek,dayGridDay",
          }}
          eventContent={renderEventContent}
          eventMouseEnter={(info) => setActiveEvent(info.event.id)}
          eventMouseLeave={() => setActiveEvent(null)}
          dayMaxEvents={3}
          eventClassNames={(event) =>
            activeEvent === event.event.id ? "fc-event-active" : ""
          }
          dayHeaderClassNames="text-gray-700 font-medium"
          dayCellClassNames="hover:bg-gray-50"
          buttonText={{
            today: "Today",
            month: "Month",
            week: "Week",
            day: "Day",
          }}
        />
      </div>

      {/* Status Legend */}
      <div className="mt-6 flex flex-wrap justify-center gap-4">
        {Object.entries(BOOKING_STATUS_COLORS).map(([status, color]) => (
          <div key={status} className="flex items-center gap-2">
            <div
              className="h-4 w-4 rounded-full"
              style={{ backgroundColor: color }}
            ></div>
            <span className="text-gray-700 capitalize">{status}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarView;
