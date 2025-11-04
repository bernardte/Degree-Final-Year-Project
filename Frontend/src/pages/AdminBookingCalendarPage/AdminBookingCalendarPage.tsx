import BookingCalendarView from "@/layout/components/calendar/BookingCalendarView";
import useBookingStore from "@/stores/useBookingStore";
import { useEffect } from "react";
import { differenceInDays } from "date-fns";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

const AdminBookingCalendarPage = () => {
  const { fetchAllBookingViewInCalendar, bookings, isLoading, error, statisticCount } = useBookingStore();

  useEffect(() => {
    const fetchData = async () => {
      await fetchAllBookingViewInCalendar();
    };
    fetchData();
  }, [fetchAllBookingViewInCalendar]);

  // Transform bookings into calendar events with enhanced details
  const mappedBooking = bookings.map((booking) => {
    const start = new Date(booking.startDate);
    const end = new Date(booking.endDate);
    end.setDate(end.getDate() + 1); // Make end inclusive for FullCalendar

    const totalNightStay = differenceInDays(end, start);
    return {
      id: booking._id,
      title: booking.title || "Unnamed Booking",
      start: start,
      end: end,
      status: booking.status || "pending",
      allDay: true,
      extendedProps: {
        contactName: booking.contactName || "No Name",
        contactEmail: booking.contactEmail || "No Email",
        contactNumber: booking.contactNumber || "N/A",
        roomType: booking.roomType || "Standard Room",
        nights: totalNightStay,
        guests: booking.totalGuests || 1,
        specialRequests: booking.specialRequests || "",
        status: booking.status || "pending",
        totalPrice: booking.totalPrice,
        booking: booking.bookingReference || "N/A",
      },
    };
  });

  // Handle refresh button click
  const handleRefresh = async () => {
    await fetchAllBookingViewInCalendar();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-sky-50 p-4"
    >
      <div className="my-2 flex flex-col items-center justify-between gap-4 md:flex-row">
        <div>
          <h1 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-3xl font-bold text-transparent">
            Reservation Calendar
          </h1>
          <p className="text-gray-600">
            {statisticCount?.total && (
              <>
                {statisticCount?.total ?? 0}{" "}
                {bookings.length === 1 ? "booking" : "bookings"} scheduled
              </>
            )}
          </p>
        </div>

        <Button variant="outline" onClick={handleRefresh} className="gap-2">
          <RefreshCw size={16} />
          Refresh Calendar
        </Button>
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl p-6"
      >
        <BookingCalendarView
          events={mappedBooking}
          bookings={bookings}
          isLoading={isLoading}
          error={error}
          onRefresh={handleRefresh}
          statisticCount={statisticCount}
        />
      </motion.div>
    </motion.div>
  );
};

export default AdminBookingCalendarPage;
