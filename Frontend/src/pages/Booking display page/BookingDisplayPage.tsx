import "react-day-picker/dist/style.css";
import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useBookingStore from "@/stores/useBookingStore";
import { formatDateInBookingCheckOut } from "@/utils/formatDate";
import { capitalize } from "lodash";
import {
  Loader,
  Calendar,
  Users,
  BedDouble,
  Star,
  CalendarDays,
  X,
  Wallet,
  Search,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useNavigate } from "react-router-dom";
import RateReviewDialog from "@/layout/components/review-component/RateReviewDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";

// Filter and sorting constants
const STATUS_OPTIONS = [
  "all",
  "pending",
  "confirmed",
  "completed",
  "cancelled",
];
const SORT_OPTIONS = [
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "date-asc", label: "Date: Oldest First" },
  { value: "date-desc", label: "Date: Newest First" },
];

// Animation configurations
const filterVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
};

const BookingDisplayPage = () => {
  // State management
  const { fetchBooking, isLoading, bookingInformation } = useBookingStore(
    (state) => state,
  );
  const [loadingTarget, setLoadingTarget] = useState<string | null>(null);
  const navigate = useNavigate();
  const [selectedBooking, setSelectedBooking] = useState<{
    id: string;
    roomTypes: string[];
    roomIds: string[];
    bookingReference: string;
  } | null>(null);

  // Filter states
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [sortBy, setSortBy] = useState("date-desc");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch bookings on mount
  useEffect(() => {
    fetchBooking();
  }, [fetchBooking]);

  // Memoized filtered bookings
  const filteredBookings = useMemo(() => {
    return (bookingInformation || [])
      .filter((booking) => {
        const statusMatch =
          selectedStatus === "all" || booking.status === selectedStatus;
        const searchMatch = booking.bookingReference
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        const dateStart = dateRange.start ? new Date(dateRange.start) : null;
        const dateEnd = dateRange.end ? new Date(dateRange.end) : null;
        const bookingStart = new Date(booking.startDate);
        const bookingEnd = new Date(booking.endDate);

        const dateMatch =
          (!dateStart || bookingStart >= dateStart) &&
          (!dateEnd || bookingEnd <= dateEnd);

        return statusMatch && searchMatch && dateMatch;
      })
      .sort((a, b) => {
        const aDate = new Date(a.createdAt).getTime();
        const bDate = new Date(b.createdAt).getTime();

        switch (sortBy) {
          case "price-asc":
            return a.totalPrice - b.totalPrice;
          case "price-desc":
            return b.totalPrice - a.totalPrice;
          case "date-asc":
            return aDate - bDate;
          default:
            return bDate - aDate;
        }
      });
  }, [bookingInformation, selectedStatus, searchQuery, dateRange, sortBy]);

  console.log(filteredBookings);
  console.log(bookingInformation);

  // Progress bar calculation
  const getBookingProgress = (status: string) => {
    switch (status) {
      case "pending":
        return 30;
      case "confirmed":
        return 60;
      case "completed":
        return 100;
      default:
        return 0;
    }
  };

  // Navigation handler
  const handleBreadcrumbClick = (path: string) => {
    setLoadingTarget(path);
    setTimeout(() => navigate(path), 800);
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedStatus("all");
    setDateRange({ start: "", end: "" });
    setSearchQuery("");
    setSortBy("date-desc");
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader className="animate-spin text-blue-500" size={48} />
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Breadcrumb Navigation */}
      <Breadcrumb className="px-8 pt-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleBreadcrumbClick("/");
              }}
              className="text-blue-600 hover:text-blue-800"
            >
              {loadingTarget === "/" ? "Loading..." : "Home"}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink className="font-semibold text-blue-800">
              My Bookings
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      {/* Filter Section */}
      <motion.section
        className="mx-auto mt-8 max-w-6xl px-4"
        variants={filterVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="rounded-xl bg-white p-6 shadow-lg">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            {/* Search Input */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-blue-600">
                <Search size={16} />
                Search
              </label>
              <Input
                placeholder="Booking reference..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-blue-100 bg-blue-50"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-blue-600">
                <Wallet size={16} />
                Status
              </label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="border-blue-100 bg-blue-50">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((status) => (
                    <SelectItem key={status} value={status}>
                      {capitalize(status)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date Range */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-blue-600">
                <CalendarDays size={16} />
                Check-in After
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start border-blue-100 bg-blue-50 text-left font-normal",
                      !dateRange.start && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.start ? (
                      format(new Date(dateRange.start), "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <DayPicker
                    mode="single"
                    selected={
                      dateRange.start ? new Date(dateRange.start) : undefined
                    }
                    onSelect={(date) =>
                      setDateRange({
                        ...dateRange,
                        start: date ? format(date, "yyyy-MM-dd") : "",
                      })
                    }
                    numberOfMonths={1}
                    defaultMonth={
                      dateRange.start ? new Date(dateRange.start) : new Date()
                    }
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
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-blue-600">
                <CalendarDays size={16} />
                Check-out Before
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start border-blue-100 bg-blue-50 text-left font-normal",
                      !dateRange.end && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.end ? (
                      format(new Date(dateRange.end), "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <DayPicker
                    mode="single"
                    selected={
                      dateRange.end ? new Date(dateRange.end) : undefined
                    }
                    onSelect={(date) =>
                      setDateRange({
                        ...dateRange,
                        end: date ? format(date, "yyyy-MM-dd") : "",
                      })
                    }
                    numberOfMonths={1}
                    defaultMonth={
                      dateRange.end ? new Date(dateRange.end) : new Date()
                    }
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
            </div>
          </div>

          {/* Sorting and Actions */}
          <div className="mt-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-blue-600">
                Sort by:
              </span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[220px] border-blue-100 bg-blue-50">
                  <SelectValue placeholder="Sort options" />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={resetFilters}
              variant="ghost"
              className="text-red-500 hover:bg-red-50"
            >
              <X size={16} className="mr-2" />
              Reset Filters
            </Button>
          </div>
        </div>
      </motion.section>

      {/* Main Content */}
      <main className="mx-auto mt-8 max-w-6xl px-4 pb-12">
        <motion.h1
          className="mb-8 text-center text-3xl font-bold text-blue-900"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Your Booking History
        </motion.h1>

        {/* Bookings List */}
        <AnimatePresence mode="wait">
          {filteredBookings.length > 0 ? (
            <motion.div
              className="grid gap-6"
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {filteredBookings.map((booking) => (
                <motion.article
                  key={booking._id}
                  variants={cardVariants}
                  className="rounded-xl bg-white shadow-lg transition-shadow hover:shadow-xl"
                  whileHover={{ y: -5 }}
                >
                  <div className="flex flex-col md:flex-row">
                    {/* QR Code Section */}
                    <div className="border-b border-blue-100 bg-blue-50 p-8 md:w-1/3 md:border-r md:border-b-0">
                      <motion.div
                        className="overflow-hidden rounded-lg"
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                      >
                        <img
                          src={booking.qrCodeImageURL}
                          alt="QR Code"
                          className="h-auto w-full object-contain"
                        />
                      </motion.div>
                    </div>

                    {/* Booking Details */}
                    <div className="flex-1 p-8">
                      {/* Status and Progress */}
                      <div className="mb-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span
                              className={`rounded-full px-4 py-1 text-sm font-medium ${
                                booking.status === "pending"
                                  ? "bg-amber-100 text-amber-800"
                                  : booking.status === "confirmed"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-green-100 text-green-800"
                              }`}
                            >
                              {capitalize(booking.status)}
                            </span>
                            <span className="text-sm text-blue-600">
                              {booking.bookingReference}
                            </span>
                          </div>
                          <span className="text-xl font-bold text-blue-900">
                            RM {booking.totalPrice.toFixed(2)}
                          </span>
                        </div>
                        <div className="mt-4 h-2 rounded-full bg-blue-100">
                          <motion.div
                            className="h-full rounded-full bg-gradient-to-r from-blue-400 to-sky-400"
                            initial={{ width: 0 }}
                            animate={{
                              width: `${getBookingProgress(booking.status)}%`,
                            }}
                            transition={{ duration: 1 }}
                          />
                        </div>
                      </div>

                      {/* Booking Details Grid */}
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <DetailItem
                          icon={
                            <Calendar size={20} className="text-blue-500" />
                          }
                          label="Check-In"
                          value={formatDateInBookingCheckOut(booking.startDate)}
                        />
                        <DetailItem
                          icon={
                            <Calendar size={20} className="text-blue-500" />
                          }
                          label="Check-Out"
                          value={formatDateInBookingCheckOut(booking.endDate)}
                        />
                        <DetailItem
                          icon={<Users size={20} className="text-blue-500" />}
                          label="Guests"
                          value={`${booking.totalGuests.adults} Adults, ${booking.totalGuests.children} Children`}
                        />
                        <DetailItem
                          icon={
                            <BedDouble size={20} className="text-blue-500" />
                          }
                          label="Rooms"
                          value={
                            Array.isArray(booking.roomType) ? (
                              booking.roomType.map(
                                (type: string, index: number) => (
                                  <span
                                    key={index}
                                    className="mr-2 rounded bg-blue-100 px-2 py-1 text-sm text-blue-800"
                                  >
                                    {type}
                                  </span>
                                ),
                              )
                            ) : (
                              <span className="mr-2 rounded bg-blue-100 px-2 py-1 text-sm text-blue-800">
                                {booking.roomType}
                              </span>
                            )
                          }
                        />
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <Button
                          variant="outline"
                          className="border-blue-200 text-blue-600 hover:bg-blue-50"
                        >
                          View Invoice
                        </Button>

                        {(new Date(booking.endDate) < new Date() && booking.status !== "cancelled" ) && (
                          <Button
                            onClick={() =>
                              setSelectedBooking({
                                id: booking._id,
                                roomTypes: Array.isArray(booking.roomType)
                                  ? booking.roomType
                                  : [booking.roomType],
                                roomIds: Array.isArray(booking.room)
                                  ? booking.room.map((room: any) =>
                                      typeof room === "string"
                                        ? room
                                        : room._id,
                                    )
                                  : [
                                      typeof booking.room === "string"
                                        ? booking.room
                                        : booking.room._id,
                                    ],
                                bookingReference: booking.bookingReference,
                              })
                            }
                            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:opacity-90"
                          >
                            <Star size={18} className="mr-2" />
                            Leave Review
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          ) : (
            <motion.div
              className="mt-12 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="inline-block rounded-xl bg-white p-8 shadow-lg">
                <div className="animate-bounce text-6xl">📭</div>
                <h3 className="mt-4 text-xl font-semibold text-blue-800">
                  No Bookings Found
                </h3>
                <p className="mt-2 text-blue-500">
                  Try adjusting your search filters
                </p>
                <Button
                  onClick={resetFilters}
                  className="mt-4 gap-2 bg-blue-600 hover:bg-blue-700"
                >
                  <X size={16} className="mr-2" />
                  Reset Filters
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <RateReviewDialog
          open={selectedBooking !== null}
          onClose={() => setSelectedBooking(null)}
          roomTypes={selectedBooking?.roomTypes || []}
          roomIds={selectedBooking?.roomIds || []}
          bookingReference={selectedBooking?.bookingReference || ""}
        />
      </main>
    </div>
  );
};

// DetailItem Component
const DetailItem = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) => (
  <div className="flex items-start gap-4">
    <div className="rounded-lg bg-blue-100 p-2 text-blue-500">{icon}</div>
    <div>
      <p className="text-sm font-medium text-blue-600">{label}</p>
      <p className="mt-1 text-base font-semibold text-blue-900">{value}</p>
    </div>
  </div>
);

export default BookingDisplayPage;
