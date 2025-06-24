import { motion } from "framer-motion";
import { Coffee, X, XCircle, CheckCircle } from "lucide-react";
import { formatDateInBookingCheckOut } from "@/utils/formatDate";
import { Room, BookingSession } from "@/types/interface.type";
import useBookingSessionStore from "@/stores/useBookingSessionStore";

interface BookingDetailsProps {
  bookingSession: BookingSession;
  rooms: Room[];
  breakfastIncluded: boolean;
  onToggleBreakfast: () => void;
}

const BookingDetails = ({
  bookingSession,
  rooms,
  breakfastIncluded,
  onToggleBreakfast,
}: BookingDetailsProps) => {
  const breakfastPrice = 30;
  const { removeBookingSessionRoom, setAdditionalInfo, additionalInfo } =
    useBookingSessionStore();

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="w-full space-y-8 overflow-y-auto rounded-r-3xl bg-white p-8 shadow-2xl md:w-2/3"
    >
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-blue-700">Booking Summary</h1>
        <p className="text-gray-600">
          Please review your booking details carefully.
        </p>
      </div>

      <div className="flex flex-col justify-start space-y-6 divide-y-2 divide-blue-100">
        <DetailItem label="Session ID" value={bookingSession.sessionId} />
        <DetailItem label="Customer Name" value={bookingSession.customerName} />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <DetailItem
            label="Check-In"
            value={formatDateInBookingCheckOut(bookingSession.checkInDate)}
          />
          <DetailItem
            label="Check-Out"
            value={formatDateInBookingCheckOut(bookingSession.checkOutDate)}
          />
        </div>

        {/* Room Details */}
        {bookingSession.roomId && (
          <div className="space-y-4 pt-4">
            <h2 className="mb-2 text-2xl font-semibold text-gray-700">
              Rooms Booked
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {rooms
                .filter((room: Room) =>
                  (bookingSession.roomId as string[]).includes(room._id),
                )
                .map((room: Room) => (
                  <motion.div
                    key={room._id}
                    whileHover={{ scale: 1.03 }}
                    className="group relative rounded-lg bg-blue-50 p-4 pr-12 shadow-sm transition hover:bg-blue-100"
                  >
                    {/* Remove button */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => removeBookingSessionRoom(room._id)}
                      className="absolute top-1/4 right-3 -translate-y-1/2 rounded-full bg-red-100 p-1.5 opacity-0 transition-all group-hover:opacity-100"
                    >
                      <X className="h-5 w-5 text-red-600 hover:text-red-700" />
                    </motion.button>

                    {/* Room info */}
                    <p className="text-lg font-semibold text-gray-700">
                      {room.roomName}
                    </p>
                    <p className="text-sm text-gray-500">{room.roomType}</p>

                    {/* Per-room breakfast section */}
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center">
                        <Coffee className="mr-2 h-4 w-4 text-blue-600" />
                        <span className="text-sm text-gray-600">
                          {room.breakfastIncluded ? (
                            <span className="flex items-center font-medium text-green-600">
                              <CheckCircle className="mr-1 h-4 w-4" />
                              Breakfast included
                            </span>
                          ) : (
                            `Add breakfast: RM ${breakfastPrice}`
                          )}
                        </span>
                      </div>

                      {/* Add breakfast button (only shown if not included) */}
                      {!room.breakfastIncluded && (
                        <motion.button
                          whileTap={{ scale: 0.96 }}
                          whileHover={{ scale: 1.04 }}
                          animate={{ y: [0, -2, 0] }}
                          transition={{ repeat: Infinity, duration: 1.6 }}
                          onClick={() => onToggleBreakfast()}
                          className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold shadow-md transition ${
                            breakfastIncluded
                              ? "bg-rose-100 text-rose-600 hover:bg-rose-200"
                              : "bg-blue-600 text-white hover:brightness-110"
                          }`}
                        >
                          {breakfastIncluded ? (
                            <>
                              <XCircle className="h-4 w-4" />
                              Remove
                            </>
                          ) : (
                            <>
                              <Coffee className="h-4 w-4" />
                              Add Breakfast · RM {breakfastPrice}
                            </>
                          )}
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        )}

        {/* Additional Details */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Additional Details (Optional)
          </label>
          <textarea
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
            rows={4}
            className="mt-1 w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
            placeholder="Special requests, estimated arrival time, etc."
          ></textarea>
        </div>
      </div>
    </motion.div>
  );
};

const DetailItem = ({ label, value }: { label: string; value: string }) => (
  <div className="space-y-1">
    <p className="text-xs font-semibold tracking-wide text-blue-500 uppercase">
      {label}
    </p>
    <p className="text-lg font-bold text-gray-800">{value}</p>
  </div>
);

export default BookingDetails;
