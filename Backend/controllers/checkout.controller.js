import stripe from "../config/stripe.js";
import BookingSession from "../models/BookingSession.model.js";
import { differenceInCalendarDays } from "date-fns";
import ClaimedReward from "../models/claimedReward.model.js";
const createCheckoutSession = async (req, res) => {
  const {
    totalPrice,
    checkInDate,
    checkOutDate,
    sessionId,
    discount: rewardDiscount,
    rewardCode,
    additionalInfo,
  } = req.body;

  console.log("request: ", req.body);

  try {
    const nights = differenceInCalendarDays(
      new Date(checkOutDate),
      new Date(checkInDate)
    );

    const lineItems = [
      {
        price_data: {
          currency: "myr",
          product_data: {
            name: "Hotel Booking",
            description: `Total for stay from ${checkInDate} to ${checkOutDate}`,
          },
          unit_amount: totalPrice * 100, // Convert to cents
        },
        quantity: 1,
      },
    ];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "fpx", "grabpay"],
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-cancelled?session_id={CHECKOUT_SESSION_ID}`,
      line_items: lineItems,
      metadata: {
        checkInDate,
        checkOutDate,
        nights,
        sessionId,
        totalPrice,
        rewardCode: rewardCode || "",
        rewardDiscount: rewardDiscount || 0,
        additionalInfo
      },
    });

    res.json({ sessionUrl: session.url });
  } catch (err) {
    console.error("Error creating checkout session", err);
    res.status(500).json({ error: err.message });
  }
};

const handlePaymentCancelled = async (req, res) => {
  const { sessionId } = req.query;

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const rewardCode = session.metadata.rewardCode;
    console.log("your reward code", rewardCode);

    if (rewardCode) {
      await ClaimedReward.findOneAndUpdate(
        { rewardCode, status: "used" },
        { $set: { status: "active" } }
      );
      return res.status(200).json({
        message: "Booking cancelled and your reward will restored",
      });
    }

    return res.status(200).json({ message: "Booking cancelled" });
  } catch (error) {
    console.error("Error handling payment cancelled", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updatePaymentDetails = async (req, res) => {
  const { sessionId } = req.params;

  try {
    // Retrieve the Stripe session
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["payment_intent.payment_method"],
    });

    if (!session.metadata || !session.metadata.sessionId) {
      return res
        .status(400)
        .json({ error: "Metadata sessionId not found in Stripe session" });
    }

    const userSessionId = session.metadata.sessionId;
    const totalPrice = session.metadata.totalPrice;
    const rewardDiscount = session.metadata.rewardDiscount;
    const rewardCode = session.metadata.rewardCode;
    const additionalInfo = session.metadata.additionalInfo;
    console.log("updatePaymentDetails: ", additionalInfo);

    console.log("Metadata sessionId:", userSessionId);

    const bookingSession = await BookingSession.findOne({
      sessionId: userSessionId,
    });

    if (!bookingSession) {
      return res
        .status(404)
        .json({ error: "BookingSession not found" });
    }

    // Get payment method type
    const paymentMethodType =
      session.payment_intent?.payment_method?.type || "unknown";

    // Get payment status
    const paymentStatus = session?.payment_status || "pending"; // paid / unpaid

    // Get paymentIntentId from Stripe session
    const paymentIntentId = session?.payment_intent?.id || "unknown";
    
    console.log("Payment method:", paymentMethodType);
    console.log("Payment status:", paymentStatus);
    console.log("PaymentIntent ID:", paymentIntentId);

    // Update booking session
    bookingSession.paymentStatus = paymentStatus;
    bookingSession.paymentMethod = paymentMethodType;
    bookingSession.paymentIntentId = paymentIntentId;
    bookingSession.totalPrice = totalPrice;
    bookingSession.rewardDiscount = rewardDiscount;
    bookingSession.rewardCode = rewardCode;
    bookingSession.additionalDetail = additionalInfo;

    await bookingSession.save();

    res.status(200).json({
      message: "Payment details updated successfully",
      bookingSession,
    });
  } catch (error) {
    console.error("Error in updatePaymentDetails:", error.message);
    res.status(500).json({ error: error.message });
  }
};

export default {
  createCheckoutSession,
  updatePaymentDetails,
  handlePaymentCancelled
};
