// controllers/reports/generateFinancialReport.js
import Booking from "../../models/booking.model.js";
import { generaterRevenueReport } from "./generateRevenueReport.js";

export const generateFinancialReport = async (startDate, endDate) => {
  try {
    // Total Revenue
    const revenueReport = await generaterRevenueReport(startDate, endDate);

    // get refund with cancelled booking
    const cancelledBookings = await Booking.find({
      status: "cancelled",
      paymentStatus: "refund", // 假设 refund 表示已退款
      startDate: { $gte: startDate, $lte: endDate },
    });

    // calculate total cancelled revenue
    const totalCancelledRevenue = cancelledBookings.reduce(
      (acc, booking) => acc + (booking.totalPrice || 0),
      0
    );

    const netRevenue = revenueReport.totalRevenue - totalCancelledRevenue;

    return {
      totalRevenue: revenueReport.totalRevenue, 
      totalCancelledRevenue,
      netRevenue,
      paymentMethodStats: revenueReport.paymentMethodStats, 
    };
  } catch (error) {
    console.error("Error generating financial report:", error);
    throw error;
  }
};
