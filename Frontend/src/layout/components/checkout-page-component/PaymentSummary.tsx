import { motion } from "framer-motion";
import { differenceInCalendarDays } from "date-fns";
import useRoomStore from "@/stores/useRoomStore";
import axiosInstance from "@/lib/axios";
import useToast from "@/hooks/useToast";
import useBookingSessionStore from "@/stores/useBookingSessionStore";

interface PaymentSummaryProps {
  checkInDate: string; // ISO date string
  checkOutDate: string; // ISO date string
  roomId: string[]; // Array of room IDs
  breakfastIncluded: boolean;
}

const PaymentSummary = ({
  checkInDate,
  checkOutDate,
  roomId,
  breakfastIncluded,
}: PaymentSummaryProps) => {
  const breakfastPrice = 30;

  // Calculate the number of nights
  const nights = differenceInCalendarDays(
    new Date(checkOutDate),
    new Date(checkInDate),
  );

  // Access rooms from store
  const { rooms } = useRoomStore();
  const bookedRooms = rooms.filter((room) =>
    (roomId as string[])?.includes(room._id)
  );

  // 3) compute each room’s line-item and the base total
  const lineItems = bookedRooms.map((room) => ({
    roomName: room.roomName,
    pricePerNight: room.pricePerNight,
    lineTotal: room.pricePerNight * nights,
  }));
  const basePrice = lineItems.reduce((sum, li) => sum + li.lineTotal, 0);
  const roomPrices = lineItems.map((li) => li.pricePerNight);
  const roomsWithoutBreakfast = bookedRooms.filter(
    (room) => !room.breakfastIncluded,
  );

  const breakfastTotal = breakfastIncluded
    ? roomsWithoutBreakfast.length * breakfastPrice * nights
    : 0;

  const totalPrice = basePrice + breakfastTotal;
  const { showToast } = useToast();
  const { bookingSession } = useBookingSessionStore();

  const handleContinuePayment = async () => {
    const sessionId = bookingSession.sessionId
    try {
      const response = await axiosInstance.post(
        "/api/checkout/payment-gateway",
        {
          totalPrice,
          checkInDate,
          roomId,
          checkOutDate,
          breakfastIncluded,
          nights,
          sessionId
        },
      );

      if (response.data?.sessionUrl) {
        window.location.href = response.data?.sessionUrl;
        
      }else{
        showToast("error", "Transaction Failed");
      }
    } catch (error: any) {
      console.log("Error in continue payment: ", error?.response?.error);
      showToast("error", error?.response?.error);
    }
  };


  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="flex w-full flex-col justify-between rounded-l-3xl bg-gradient-to-br from-blue-500 to-blue-400 p-8 text-white md:w-1/3"
    >
      <div className="space-y-8">
        <h2 className="text-3xl font-bold">Payment Summary</h2>

        <div className="space-y-2">
          {roomPrices.map((price, index) => (
            <div key={index} className="flex justify-between text-lg">
              <span>
                {nights} night{nights > 1 ? "s" : ""} × RM {price}
              </span>
              <span>RM {price * nights}</span>
            </div>
          ))}

          {breakfastIncluded && (
            <div className="flex justify-between text-sm text-green-200 italic">
              <span>
                Breakfast for {roomsWithoutBreakfast.length} room
                {roomsWithoutBreakfast.length > 1 ? "s" : ""} x {nights} night
                {nights > 1 ? "s" : ""}
              </span>
              <span>RM {breakfastTotal}</span>
            </div>
          )}
          <motion.div
            key={totalPrice}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="flex justify-between pt-4 text-2xl font-extrabold"
          >
            <span>Total</span>
            <span>RM {totalPrice}</span>
          </motion.div>
        </div>
      </div>

      <div className="mt-10">
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={handleContinuePayment}
          className="w-full cursor-pointer rounded-full bg-white px-6 py-4 text-lg font-bold text-blue-600 shadow-lg transition hover:bg-gray-100"
        >
          Continue to Payment
        </motion.button>
      </div>
    </motion.div>
  );
};

export default PaymentSummary;
