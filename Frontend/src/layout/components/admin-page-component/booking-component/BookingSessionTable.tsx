import { useEffect, useState } from "react";
import {
  Search,
  Mail,
  Phone,
  Calendar,
  Clock,
  Users,
  Bed,
  CreditCard,
  User,
} from "lucide-react";
import { BookingSession } from "@/types/interface.type";
import { formatDate } from "@/utils/formatDate";
import { useSocket } from "@/context/SocketContext";
import useBookingSessionStore from "@/stores/useBookingSessionStore";

const BookingSessionTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const bookingSessions = useBookingSessionStore(
    (state) => state.bookingSessions,
  );
  const socket = useSocket();

  // filter booking
  const filteredBookings = bookingSessions.filter((booking) => {
    const searchLower = searchTerm.toLowerCase();
    const customerName = booking.userId
      ? booking.userId.username || "registered user"
      : booking.guestDetails?.contactName || "Guest";

    return (
      customerName.toLowerCase().includes(searchLower) ||
      booking.sessionId.toLowerCase().includes(searchLower) ||
      (booking.guestDetails?.contactEmail || booking.userId?.email || "")
        .toLowerCase()
        .includes(searchLower)
    );
  });

  // get user information
  const getCustomerInfo = (booking: BookingSession) => {
    if (booking.userId && booking.userId.username) {
      return {
        type: "registered",
        profilePic: booking.userId.profilePic,
        name: booking.userId.username,
        email: booking.userId.email || "N/A",
      };
    } else if (booking.guestDetails?.contactName) {
      return {
        type: "guest",
        name: booking.guestDetails.contactName,
        email: booking.guestDetails.contactEmail || "N/A",
        phone: booking.guestDetails.contactNumber || "N/A",
      };
    }
  };

  // Calculated stay night
  const calculateNights = (checkIn: Date, checkOut: Date) => {
    const checkInDate = new Date(checkIn).getTime();
    const checkOutDate = new Date(checkOut).getTime();
    return Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
  };

  useEffect(() => {
    if (!socket) {
      return;
    }

    const handleBookingSessionUpdate = (data: BookingSession[]) => {
      console.log("handle booking session: ", data);
      useBookingSessionStore.setState({
        bookingSessions: data,
      });
    };

    socket.on("booking-session-update", handleBookingSessionUpdate);

    return () => {
      socket.off("booking-session-update", handleBookingSessionUpdate);
    };
  }, [socket]);

  return (
    <div className="flex h-[447px] flex-col rounded-lg border-1 border-blue-200 bg-white">
      {/* Table Header - Search and Statistics */}
      <div className="border-b border-blue-100 bg-gradient-to-r from-indigo-100 to-blue-50 p-4">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-lg font-semibold text-blue-900">
              Pending Reservation
            </h3>
            <p className="text-sm text-blue-600">
              Total {filteredBookings.length} Pending Reservation
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <input
              type="text"
              placeholder="Search by customer name, email or booking ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white py-2 pr-4 pl-10 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Table contents */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="bg-blue-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-blue-900 uppercase">
                Customer Information
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-blue-900 uppercase">
                Room Details
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-blue-900 uppercase">
                Price
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-blue-900 uppercase">
                Booking Status
              </th>
            </tr>
          </thead>
          <tbody className="min-h-[400px] divide-y divide-gray-200 bg-white">
            {filteredBookings.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  No Pending Booking Found
                </td>
              </tr>
            ) : (
              filteredBookings.map((booking) => {
                const customerInfo = getCustomerInfo(booking);
                const nights = calculateNights(
                  booking.checkInDate,
                  booking.checkOutDate,
                );

                return (
                  <>
                    <tr
                      key={booking._id}
                      className="transition-colors hover:bg-blue-50/50"
                    >
                      {/* User information */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                            {customerInfo?.profilePic ? (
                              <img
                                src={customerInfo.profilePic}
                                className="full h-[42px] rounded-2xl object-cover"
                              />
                            ) : (
                              <User className="h-5 w-5 text-blue-600" />
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {customerInfo?.name}
                              <span
                                className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
                                  customerInfo?.type === "registered"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {customerInfo?.type === "registered"
                                  ? "Register User"
                                  : "Guest"}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <Mail className="h-3 w-3" />
                              {customerInfo?.email}
                            </div>
                            {customerInfo?.phone && (
                              <div className="flex items-center gap-1 text-xs text-gray-400">
                                <Phone className="h-3 w-3" />
                                {customerInfo?.phone}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Room Information */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="space-y-1 text-sm text-gray-900">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-green-600" />
                            <span>
                              {formatDate(booking.checkInDate)} -{" "}
                              {formatDate(booking.checkOutDate)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-blue-600" />
                            <span>{nights} nights</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-purple-600" />
                            <span>
                              {booking.totalGuest?.adults} adults
                              {booking.totalGuest?.children > 0 &&
                                `, ${booking.totalGuest?.children} children`}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Bed className="h-4 w-4 text-orange-600" />
                            <span className="text-xs">
                              {Array.isArray(booking.roomId)
                                ? booking.roomId
                                    .map((room) =>
                                      typeof room === "string"
                                        ? room
                                        : room.roomName,
                                    )
                                    .join(", ")
                                : typeof booking.roomId === "string"
                                  ? booking.roomId
                                  : "N/A"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Price Column */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div className="flex items-center gap-2 font-medium">
                            <CreditCard className="h-4 w-4 text-green-600" />
                            RM {booking?.totalPrice?.toFixed(2)}
                          </div>
                          {booking?.rewardDiscount > 0 && (
                            <div className="mt-1 text-xs text-green-600">
                              Reward Code: {booking?.rewardCode} (-RM{" "}
                              {booking?.rewardDiscount.toFixed(2)})
                            </div>
                          )}
                          {booking.breakfastIncluded > 0 && (
                            <div className="mt-1 text-xs text-blue-600">
                              Include {booking?.breakfastIncluded} Breakfast
                            </div>
                          )}
                        </div>
                      </td>

                      {/* status column */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                          Pending
                        </span>
                        <div className="mt-1 text-xs font-bold text-black/70">
                          Session ID: {booking?.sessionId}
                        </div>
                        <div className="mt-1 text-xs font-bold text-black/70">
                          Created At:{" "}
                          {new Date(booking.createdAt).toLocaleString("en-GB", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: false, // ✅ 24 hours
                          })}
                        </div>
                      </td>
                    </tr>
                  </>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingSessionTable;
