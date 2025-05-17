import { motion, AnimatePresence } from "framer-motion";
import { Coffee, X, XCircle } from "lucide-react";
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
  const { removeBookingSessionRoom, setAdditionalInfo, additionalInfo } = useBookingSessionStore();

  console.log(rooms);
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

        {/* Breakfast Section */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="space-y-4 rounded-lg bg-gradient-to-br from-blue-100 to-white p-6 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-xl font-bold text-blue-700">
              <Coffee className="text-blue-500" /> Breakfast
            </h2>
            <AnimatePresence mode="wait">
              {breakfastIncluded ? (
                <motion.span
                  key="included"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="rounded-full bg-green-300 px-3 py-1 text-sm font-semibold text-green-900 shadow-sm"
                >
                  Included
                </motion.span>
              ) : (
                <motion.span
                  key="not-included"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="rounded-full bg-red-200 px-3 py-1 text-sm font-semibold text-red-700"
                >
                  Not Included
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <p className="text-gray-700">
              {breakfastIncluded
                ? "Don't want breakfast anymore?"
                : `Would you like to add breakfast for only RM ${breakfastPrice}?`}
            </p>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onToggleBreakfast}
              className={`flex cursor-pointer items-center gap-2 rounded-full px-6 py-2 font-semibold shadow-lg transition ${
                breakfastIncluded
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {breakfastIncluded ? (
                <XCircle className="h-5 w-5" />
              ) : (
                <Coffee className="h-5 w-5" />
              )}
              {breakfastIncluded ? "Remove Breakfast" : "Add Breakfast"}
            </motion.button>
          </div>
        </motion.div>

        {/* Room Details */}
        {bookingSession.roomId && (
          <div className="space-y-4 pt-4">
            <h2 className="mb-2 text-2xl font-semibold text-gray-700">
              Rooms Booked
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {
              rooms
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
                      className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full bg-red-100 p-1.5 opacity-0 transition-all group-hover:opacity-100"
                    >
                      <X className="h-5 w-5 text-red-600 hover:text-red-700" />
                    </motion.button>

                    {/* Room info */}
                    <p className="text-lg font-semibold text-gray-700">
                      {room.roomName}
                    </p>
                    <p className="text-sm text-gray-500">{room.roomType}</p>
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
