import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { motion, AnimatePresence } from "framer-motion";
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
  Filter,
  Calendar as CalendarIcon,
  ChevronDown,
  ChevronUp,
  X,
  Search,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import "react-day-picker/dist/style.css";
import useIsSmallScreen from "@/hooks/useIsSmallScreen";
import { Bookings } from "@/types/interface.type";
import { DayPicker } from "react-day-picker";

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
  bookings: Bookings[];
  isLoading: boolean;
  error: null | string;
  onRefresh: () => Promise<void>
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
    status: "pending" | "confirmed" | "cancelled" | "completed";
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
        <TooltipContent className="z-[10000] min-w-[300px] rounded-xl border-0 bg-white p-0 shadow-xl">
          <div
            className="rounded-t-xl px-4 py-3 font-bold text-white"
            style={{ backgroundColor: getBookingStatusColor(booking.status) }}
          >
            <div className="flex items-center justify-between">
              <span>Booking #{booking.reference}</span>
              <span className="ml-5 flex items-center gap-1">
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
              <span className="font-medium text-emerald-700">
                Total Amount:
              </span>
              <span className="font-bold text-green-600">
                RM {Number(booking.totalPrice).toFixed(2)}
              </span>
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
 * CalendarView Component - Premium hotel booking calendar with filters
 * @param events - Array of booking events
 */
const BookingCalendarView = ({ events, bookings, isLoading, error, onRefresh }: CalendarViewProps) => {
  const [activeEvent, setActiveEvent] = useState<string | null>(null);
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [statusFilters, setStatusFilters] = useState<BookingStatus[]>([]);
  const [roomTypeFilters, setRoomTypeFilters] = useState<string[]>([]);
  const isSmallScreen = useIsSmallScreen();
  const [dateRange, setDateRange] = useState<{
    start: Date | null;
    end: Date | null;
  }>({
    start: null,
    end: null,
  });
  const [filterByName, setFilterByName]= useState("");

  // Extract unique room types from events
  const roomTypes = useMemo(() => {
    const types = new Set<string>();
    events.forEach((event) => {
      if (event.extendedProps?.roomType) {
        types.add(event.extendedProps.roomType);
      }
    });
    return Array.from(types);
  }, [events]);

  // Apply status colors to events
  const styledEvents = useMemo(() => {
    return events.map((event) => {
      const status = (event.status as BookingStatus) || "pending";
      return {
        ...event,
        backgroundColor: `${getBookingStatusColor(status)}20`, // 20% opacity
        borderColor: getBookingStatusColor(status),
        textColor: "#1f2937", // Dark gray text
        extendedProps: {
          ...event.extendedProps,
          status: status,
          roomType: event.extendedProps?.roomType,
          contactName: event.extendedProps?.contactName,
        },
      };
    });
  }, [events]);



  // Filter events based on selected filters
  const filteredEvents = useMemo(() => {
    return styledEvents.filter((event) => {
      // Apply status filter
      if (
        statusFilters.length > 0 &&
        !statusFilters.includes(event.extendedProps.status)
      ) {
        return false;
      }

      // Apply room type filter
      if (
        roomTypeFilters.length > 0 &&
        !roomTypeFilters.includes(event.extendedProps.roomType)
      ) {
        return false;
      }

      // Apply date range filter
      if (dateRange.start && dateRange.end) {
        const eventStart = event.start ? new Date(event.start as string) : null;
        if (
          !eventStart ||
          eventStart < dateRange.start ||
          eventStart > dateRange.end
        ) {
          return false;
        }
      }

      // Apply filter by name
      if(filterByName.length > 0 && !filterByName.toLowerCase().includes(event.extendedProps.contactName.toLowerCase())){
        return false;
      }

      return true;
    });
  }, [styledEvents, statusFilters, roomTypeFilters, dateRange, filterByName]);

  // Custom event content renderer
  const renderEventContent = (eventInfo: any) => {
    const bookingData = eventInfo.event.extendedProps;
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

  // Toggle status filter
  const toggleStatusFilter = (status: BookingStatus) => {
    if (statusFilters.includes(status)) {
      setStatusFilters(statusFilters.filter((s) => s !== status));
    } else {
      setStatusFilters([...statusFilters, status]);
    }
  };

  // Toggle room type filter
  const toggleRoomTypeFilter = (roomType: string) => {
    if (roomTypeFilters.includes(roomType)) {
      setRoomTypeFilters(roomTypeFilters.filter((r) => r !== roomType));
    } else {
      setRoomTypeFilters([...roomTypeFilters, roomType]);
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setStatusFilters([]);
    setRoomTypeFilters([]);
    setDateRange({ start: null, end: null });
  };

  // Check if any filters are active
  const isFilterActive =
    statusFilters.length > 0 ||
    roomTypeFilters.length > 0 ||
    dateRange.start ||
    dateRange.end;


  return (
    <div className="rounded-2xl bg-white p-4 shadow-xl">
      {/* Filter Header */}
      <div className="mb-6 flex items-center justify-end gap-4">
        <div className="flex items-center gap-3">
          {isFilterActive && (
            <Button
              variant="outline"
              className="flex items-center gap-2 border-red-100 bg-red-50 text-red-600 hover:bg-red-100"
              onClick={clearFilters}
            >
              <X size={16} />
              <span>Clear Filters</span>
            </Button>
          )}

          <Button
            className="flex items-center gap-2"
            onClick={() => setFilterPanelOpen(!filterPanelOpen)}
          >
            <Filter size={16} />
            <span>Filters</span>
            {filterPanelOpen ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </Button>
        </div>
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {filterPanelOpen && (
          <motion.div
            initial={{ clipPath: "inset(0 0 100% 0)", opacity: 0 }}
            animate={{ clipPath: "inset(0 0 0% 0)", opacity: 1 }}
            exit={{ clipPath: "inset(0 0 100% 0)", opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="mb-6 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 p-5"
          >
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {/* Status Filter */}
              <div>
                <h3 className="mb-3 font-semibold text-gray-700">
                  Booking Status
                </h3>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(BOOKING_STATUS_COLORS).map(
                    ([status, color]) => (
                      <button
                        key={status}
                        className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-all ${
                          statusFilters.includes(status as BookingStatus)
                            ? "text-white"
                            : "text-gray-700 hover:bg-gray-200"
                        }`}
                        style={{
                          backgroundColor: statusFilters.includes(
                            status as BookingStatus,
                          )
                            ? color
                            : "transparent",
                          border: `1px solid ${color}`,
                        }}
                        onClick={() =>
                          toggleStatusFilter(status as BookingStatus)
                        }
                      >
                        <div className="h-2 w-2 rounded-full bg-white opacity-80"></div>
                        <span>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                      </button>
                    ),
                  )}
                </div>
              </div>

              {/* Room Type Filter */}
              <div>
                <h3 className="mb-3 font-semibold text-gray-700">Room Type</h3>
                <div className="flex flex-wrap gap-2">
                  {roomTypes.map((roomType) => (
                    <button
                      key={roomType}
                      className={`rounded-full px-3 py-1.5 text-sm font-medium transition-all ${
                        roomTypeFilters.includes(roomType)
                          ? "border border-indigo-300 bg-indigo-100 text-indigo-700"
                          : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
                      }`}
                      onClick={() => toggleRoomTypeFilter(roomType)}
                    >
                      {roomType}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                {/*username filter*/}
                <div className="mb-5 w-full max-w-sm">
                  <label className="mb-3 font-semibold text-gray-700">
                    Filter by Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full rounded-xl border border-gray-300 py-2 pr-4 pl-10 text-sm shadow-sm focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="Enter name..."
                      onChange={(e) => setFilterByName(e.target.value)}
                      value={filterByName}
                    />
                    <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                {/* Date Range Filter */}
                <h3 className="mb-3 font-semibold text-gray-700">Date Range</h3>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.start ? (
                        dateRange.end ? (
                          <>
                            {format(dateRange.start, "MMM dd, yyyy")} -{" "}
                            {format(dateRange.end, "MMM dd, yyyy")}
                          </>
                        ) : (
                          format(dateRange.start, "MMM dd, yyyy")
                        )
                      ) : (
                        <span>Pick a date range</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <DayPicker
                      mode="range"
                      selected={{
                        from: dateRange.start || undefined,
                        to: dateRange.end || undefined,
                      }}
                      onSelect={(range) => {
                        if (range?.from && range?.to) {
                          setDateRange({ start: range.from, end: range.to });
                        }
                      }}
                      numberOfMonths={isSmallScreen ? 1 : 2}
                      initialFocus
                      defaultMonth={new Date()}
                      classNames={{
                        months: "sm:flex gap-6 ",
                        month: "w-full",
                        caption: "text-center font-semibold mb-2",
                        table: "w-full border-collapse",
                        head_row: "text-gray-500",
                        head_cell: "text-xs font-medium text-center py-1",
                        row: "text-center",
                        cell: "p-1",
                        day: "w-10 h-10 rounded-full hover:bg-blue-100 transition",
                        day_selected: "bg-blue-600 text-white",
                        day_today: "border border-blue-500",
                        day_range_middle: "bg-blue-100",
                        day_range_start: "bg-blue-600 text-white",
                        day_range_end: "bg-blue-600 text-white",
                      }}
                    />
                  </PopoverContent>
                </Popover>

                {dateRange.start && (
                  <button
                    className="mt-2 flex items-center gap-1 text-sm text-red-500 hover:text-red-700"
                    onClick={() => setDateRange({ start: null, end: null })}
                  >
                    <X size={14} />
                    <span>Clear date filter</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Filters Badges */}
      <AnimatePresence>
        {isFilterActive && (
          <motion.div
            key="filter-badges"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="mb-4 flex flex-wrap gap-2"
          >
            {statusFilters.map((status) => (
              <div
                key={status}
                className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-sm"
              >
                <div
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: BOOKING_STATUS_COLORS[status] }}
                ></div>
                <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => toggleStatusFilter(status)}
                >
                  <X size={14} />
                </button>
              </div>
            ))}

            {roomTypeFilters.map((roomType) => (
              <div
                key={roomType}
                className="flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 text-sm text-indigo-700"
              >
                <Bed size={14} />
                <span>{roomType}</span>
                <button
                  className="text-indigo-500 hover:text-indigo-800"
                  onClick={() => toggleRoomTypeFilter(roomType)}
                >
                  <X size={14} />
                </button>
              </div>
            ))}

            {dateRange.start && dateRange.end && (
              <div className="flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
                <CalendarIcon size={14} />
                <span>
                  {format(dateRange.start, "MMM dd")} -{" "}
                  {format(dateRange.end, "MMM dd")}
                </span>
                <button
                  className="text-blue-500 hover:text-blue-800"
                  onClick={() => setDateRange({ start: null, end: null })}
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Calendar Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="fullcalendar-container"
      >
        {/* error */}
        {error && !isLoading && (
          <div className="flex h-64 flex-col items-center justify-center rounded-lg bg-red-50 p-6">
            <AlertCircle size={48} className="text-red-500" />
            <h3 className="mt-4 text-lg font-bold text-red-800">
              Failed to load data
            </h3>
            <p className="mt-2 text-center text-red-600">{error}</p>
            {onRefresh && (
              <button
                onClick={onRefresh}
                className="mt-4 flex items-center gap-2 rounded-lg bg-red-100 px-4 py-2 text-red-700 hover:bg-red-200"
              >
                <RefreshCw size={16} />
                <span className="text-rose-200">Retry</span>
              </button>
            )}
          </div>
        )}
        {isLoading ? (
          <div className="flex h-96 flex-col items-center justify-center space-y-5">
            <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-blue-500"></div>
            <span className="text-gray-400">
              Loading Reservation Calendar...
            </span>
          </div>
        ) : (
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={filteredEvents}
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
        )}
      </motion.div>

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
      {/* Quick Stats */}
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-5">
        {[
          {
            count: bookings.length,
            label: "Total Bookings",
            bg: "bg-indigo-50",
            border: "border-indigo-100",
            text: "text-indigo-700",
          },
          {
            count: bookings.filter((b) => b.status === "pending").length,
            label: "Pending",
            bg: "bg-amber-50",
            border: "border-amber-100",
            text: "text-amber-700",
          },
          {
            count: bookings.filter((b) => b.status === "confirmed").length,
            label: "Confirmed",
            bg: "bg-blue-50",
            border: "border-blue-100",
            text: "text-blue-700",
          },
          {
            count: bookings.filter((b) => b.status === "cancelled").length,
            label: "Cancelled",
            bg: "bg-rose-50",
            border: "border-rose-100",
            text: "text-rose-700",
          },
          {
            count: bookings.filter((b) => b.status === "completed").length,
            label: "Completed",
            bg: "bg-emerald-50",
            border: "border-emerald-100",
            text: "text-emerald-700",
          },
        ].map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * idx }}
            className={`rounded-lg ${stat.border} ${stat.bg} p-3 text-center`}
          >
            <div className={`text-lg font-bold ${stat.text}`}>{stat.count}</div>
            <div className={`text-xs ${stat.text.replace("700", "600")}`}>
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default BookingCalendarView;
