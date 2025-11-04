import Booking from "../../models/booking.model.js";

export const generaterRevenueReport = async (startDate, endDate) => {
  const bookings = await Booking.find({
    paymentStatus: "paid",
    startDate: { $gte: startDate, $lte: endDate },
  });

  console.log("booking room: ", bookings);

  const totalRevenue = bookings.reduce(
    (acc, booking) => acc + booking.totalPrice,
    0
  );

  //? according payment method to calculate each method total revenue and used
  const paymentMethodStats = bookings.reduce((acc, booking) => {
    const method = booking.paymentMethod;

    if (!acc[method]) {
      acc[method] = { count: 0, totalRevenue: 0 };
    }

    acc[method].totalRevenue += booking.totalPrice || 0; 
    acc[method].count += 1;

    return acc;
  }, {});

  //Based on above statistic calculate average consumption of each payment method
  const averagePriceByPaymentMethod = {};
  for (const method in paymentMethodStats) {
    const stats = paymentMethodStats[method];
    if (stats.count > 0) {
      averagePriceByPaymentMethod[method] = stats.totalRevenue / stats.count;
    }
  }

  return {
    totalRevenue,
    paymentMethodStats,
    averagePriceByPaymentMethod,
    bookings,
  };
};
