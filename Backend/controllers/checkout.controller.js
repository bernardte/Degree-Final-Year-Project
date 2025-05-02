// controllers/checkout.controller.js
import stripe from "../config/stripe.js";
import Room from "../models/room.model.js";
import BookingSession from "../models/BookingSession.model.js";
import { differenceInCalendarDays } from "date-fns";

const createCheckoutSession = async (req, res) => {
  const {
    totalPrice,
    roomId,
    checkInDate,
    checkOutDate,
    breakfastIncluded,
    sessionId,
  } = req.body;

  try {
    // Find multiple rooms if roomId is an array of ObjectId
    const roomSelected = await Room.find({ _id: { $in: roomId } });

    console.log(roomSelected);

    let breakfastCount = 0;

    const lineItems = roomSelected
      .map((room) => {
        const roomPrice = room.pricePerNight;
        const rangeBetweenCheckInDateAndCheckOutDate = differenceInCalendarDays(
          new Date(checkOutDate),
          new Date(checkInDate)
      )

        const roomItem = {
          price_data: {
            currency: "myr",
            product_data: {
              name: room?.roomName,
              description: `Booking from ${checkInDate} to ${checkOutDate}`,
            },
            unit_amount: (roomPrice * 100) * parseInt(rangeBetweenCheckInDateAndCheckOutDate),
          },
          quantity: 1,
        };

        if (breakfastIncluded) {
          breakfastCount += 1;
        }

        return [roomItem];
      })
      .flat();

    if (breakfastCount > 0) {
      const breakfastItem = {
        price_data: {
          currency: "myr",
          product_data: {
            name: "Breakfast Voucher",
            description: `Breakfast voucher for ${breakfastCount} room(s)`,
          },
          unit_amount: 30 * 100, //RM 30 
        },
        quantity: breakfastCount,
      };

      lineItems.push(breakfastItem);
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "fpx", "grabpay"],
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-cancelled?session_id={CHECKOUT_SESSION_ID}`,
      line_items: lineItems,
      metadata: {
        roomId: roomId.join(","),
        checkInDate,
        checkOutDate,
        breakfastCount,
        sessionId, // This is UUIDv4 session id
        totalPrice
      },
    });

    res.json({ sessionUrl: session.url });
  } catch (err) {
    console.error("Error creating checkout session", err);
    res.status(500).json({ error: err.message });
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
    const breakfastCount = session.metadata.breakfastCount;
    const totalPrice = session.metadata.totalPrice;
    
    console.log("Metadata sessionId:", userSessionId);

    const bookingSession = await BookingSession.findOne({
      sessionId: userSessionId,
    });

    if (!bookingSession) {
      return res
        .status(404)
        .json({ error: "BookingSession not found in database" });
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
    bookingSession.breakfastIncluded = breakfastCount;
    bookingSession.totalPrice = totalPrice;

    await bookingSession.save();

    res.json({
      message: "Payment details updated successfully",
      bookingSession
    });
  } catch (error) {
    console.error("Error in updatePaymentDetails:", error.message);
    res.status(500).json({ error: error.message });
  }
};

export default {
  createCheckoutSession,
  updatePaymentDetails,
};
