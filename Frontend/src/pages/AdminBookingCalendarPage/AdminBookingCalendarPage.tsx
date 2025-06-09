import CalendarView from "@/layout/components/calendar/CalendarView";
import useBookingStore from "@/stores/useBookingStore";
import { useEffect, useState } from "react";
import { differenceInDays } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

const AdminBookingCalendarPage = () => {
  const { fetchAllBookingViewInCalendar, bookings } = useBookingStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchAllBookingViewInCalendar();
      setLoading(false);
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
    setLoading(true);
    await fetchAllBookingViewInCalendar();
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-4"
    >
      <div className="my-2 flex flex-col items-center justify-between gap-4 md:flex-row">
        <div>
          <h1 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-3xl font-bold text-transparent">
            Reservation Calendar
          </h1>
          <p className="text-gray-600">
            {bookings.length} {bookings.length === 1 ? "booking" : "bookings"}{" "}
            scheduled
          </p>
        </div>

        <Button variant="outline" onClick={handleRefresh} className="gap-2">
          <RefreshCw size={16} />
          Refresh Calendar
        </Button>
      </div>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-[600px] w-full rounded-xl" />
        </div>
      ) : (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl bg-gradient-to-br from-white to-blue-50 p-6 shadow-xl"
        >
          <CalendarView events={mappedBooking} />

          {/* Quick Stats */}
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-5">
            <div className="rounded-lg border border-amber-100 bg-amber-50 p-3 text-center">
              <div className="text-lg font-bold text-amber-700">
                {bookings.filter((b) => b.status === "pending").length}
              </div>
              <div className="text-xs text-amber-600">Pending</div>
            </div>
            <div className="rounded-lg border border-blue-100 bg-blue-50 p-3 text-center">
              <div className="text-lg font-bold text-blue-700">
                {bookings.filter((b) => b.status === "confirmed").length}
              </div>
              <div className="text-xs text-blue-600">Confirmed</div>
            </div>
            <div className="rounded-lg border border-rose-100 bg-rose-50 p-3 text-center">
              <div className="text-lg font-bold text-rose-700">
                {bookings.filter((b) => b.status === "cancelled").length}
              </div>
              <div className="text-xs text-rose-600">Cancelled</div>
            </div>
            <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-3 text-center">
              <div className="text-lg font-bold text-emerald-700">
                {bookings.filter((b) => b.status === "completed").length}
              </div>
              <div className="text-xs text-emerald-600">Completed</div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AdminBookingCalendarPage;
