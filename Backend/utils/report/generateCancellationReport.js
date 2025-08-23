import Booking from "../../models/booking.model.js";

export const generateCancellationReport = async (start, end) => {
  const cancellationBookings = await Booking.find({
    paymentStatus: "refund",
    status: "cancelled",
    startDate: { $gte: start, $lte: end },
  });

  console.log("cancelled bookings: ", cancellationBookings)

  const totalCancellationBooking = cancellationBookings.length;
  const totalRefundAmount = cancellationBookings.reduce((acc, booking) => acc + (booking.refundAmount || 0), 0);
  
  return {
    cancellationBookings,
    totalCancellationBooking,
    totalRefundAmount,
  }
};
