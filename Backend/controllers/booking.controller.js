import { v4 as uuidv4 } from "uuid";
import Booking from "../models/booking.model.js";
import Room from "../models/room.model.js";
import User from "../models/user.model.js";
import { sendBookingConfirmationEmail } from "../utils/send-email.js";
import BookingSession from "../models/BookingSession.model.js";
import CancellationRequest from "../models/cancellationRequest.model.js";
import generateAndUploadQRCode from "../utils/generateAndUploadQRCode.js";
import { differenceInCalendarDays } from "date-fns";
import mongoose from "mongoose";
import { handleRewardPoints } from "../logic function/handleRewardPoints.js";
import {
  emitBookingSessionUpdate,
  emitBookingTrendsUpdate,
  emitRoomTypeUpdate,
  emitBookingStatusUpdate,
} from "../socket/socketUtils.js";
import notifyUsers from "../utils/notificationSender.js";
import Invoice from "../models/invoice.model.js";
import { generateInvoiceNumber } from "../utils/invoiceNumberGenerator.js";
import { sendInvoiceEmail } from "../utils/invoices/sendInvoiceEmail.js";
import Reward from "../models/reward.model.js";
import ClaimedReward from "../models/claimedReward.model.js";
import SystemSetting from "../models/systemSetting.model.js";
import { bookingSessionAbnormalDetection } from "../utils/httpRequest/bookingSessionAbnormalDetection.js";
import { bookingAbnormalDetection } from "../utils/httpRequest/bookingSessionAbnormalDetection.js";
import SuspiciousEvent from "../models/suspiciousEvent.model.js";
import { bookingSessionUpdate } from "../utils/bookingStats.js";

const createBooking = async (req, res) => {
  const { bookingSessionId, specialRequests } = req.body;
  if (!bookingSessionId)
    return res.status(400).json({ error: "bookingSessionId is required" });

  try {
    const session = await BookingSession.findOne({
      sessionId: bookingSessionId,
    });

    console.log("your session: ", session)

    if (!session)
      return res.status(404).json({ error: "Booking session not found" });

    const {
      roomId,
      checkInDate,
      checkOutDate,
      userId,
      guestId,
      totalGuest,
      totalPrice,
      paymentMethod,
      paymentStatus,
      paymentIntentId,
      breakfastIncluded,
      contactName,
      contactEmail,
      contactNumber,
      guestDetails,
      rewardDiscount,
      additionalDetail,
      rewardCode,
    } = session;

    if (new Date(checkOutDate) <= new Date(checkInDate)) {
      return res
        .status(400)
        .json({ error: "Check-out date must be after check-in date" });
    }

    const rooms = await Room.find({ _id: { $in: roomId } });
    if (rooms.length !== roomId.length)
      return res.status(404).json({ error: "One or more rooms not found" });

    const user = userId ? await User.findById(userId) : null;
    const guestUserId = guestId;
    const bookingReference = uuidv4();

    for (let room of rooms) {
      const overlapping = await Booking.findOne({
        room: room._id,
        startDate: { $lt: new Date(checkOutDate) },
        endDate: { $gt: new Date(checkInDate) },
      });
      if (overlapping)
        return res
          .status(400)
          .json({ error: `Room ${room.roomNumber} is already booked` });
    }

    const newBooking = new Booking({
      userEmail: contactEmail || user?.email || null,
      bookingCreatedByUser: userId || null,
      guestId: guestUserId || null,
      userType: userId ? "user" : "guest",
      room: rooms.map((r) => r._id),
      startDate: checkInDate,
      endDate: checkOutDate,
      totalGuests: totalGuest,
      breakfastIncluded: breakfastIncluded,
      totalPrice,
      bookingReference,
      specialRequests,
      paymentMethod,
      paymentStatus,
      paymentIntentId,
      specialRequests: additionalDetail,
      contactName: contactName || guestDetails?.contactName,
      contactEmail: contactEmail || guestDetails?.contactEmail,
      contactNumber: contactNumber || guestDetails?.contactNumber,
      rewardDiscount,
      rewardCode,
    });
    await newBooking.save();
    for (let room of rooms) {
      room.bookings.push(newBooking._id);
      await room.save();
    }
    // handle QR code
    const roomDetails = rooms.map((r) => ({
      roomType: r.roomType,
      roomNumber: r.roomNumber,
      pricePerNight: r.pricePerNight,
    }));
    const qrCodeData = {
      bookingReference,
      checkInDate,
      checkOutDate,
      rooms: roomDetails,
    };
    const qrCodePublicURLfromCloudinary = await generateAndUploadQRCode(
      qrCodeData
    );

    console.log("generated QR code: " ,qrCodePublicURLfromCloudinary)
    newBooking.qrCodeImageURL = qrCodePublicURLfromCloudinary;
    await newBooking.save();

    // handle reward points
    if (user)
      await handleRewardPoints(
        user,
        newBooking,
        checkInDate,
        checkOutDate,
        rooms
      );

     const hotelInfoDoc = await SystemSetting.findOne({
       key: "Hotel Information",
     }).select("value");

    const hotelInfo = hotelInfoDoc?.value;
    const emailTo = user?.email || contactEmail || guestDetails?.contactEmail;
    if (emailTo && qrCodePublicURLfromCloudinary) {
      await sendBookingConfirmationEmail(emailTo, {
        username: user?.name || newBooking.contactName,
        bookingReference,
        roomDetail: roomDetails,
        checkInDate,
        checkOutDate,
        breakfastIncluded: newBooking.breakfastIncluded,
        adults: totalGuest.adults,
        children: totalGuest.children,
        totalPrice,
        hotelDetail: hotelInfo,
        qrCodeImageURL: qrCodePublicURLfromCloudinary,
      });
    }

    const allAdmins = await User.find({
      role: { $in: ["admin", "superAdmin"] },
    });
    const adminIds = allAdmins.map((admin) => admin._id);

    //* notify all admins
    await notifyUsers(
      adminIds,
      `New booking# ${bookingReference} from ${
        newBooking.contactEmail || user?.email
      }`,
      "booking"
    );

    //* emit booking trends chart update on admin interface
    // *emit Most booking room type chart update on admin interface
    //* await update Booking status for default
    Promise.all([
      emitBookingTrendsUpdate(),
      emitRoomTypeUpdate(),
      emitBookingStatusUpdate(),
    ]).then(result => console.log("Socket updates emitted successfully: ", result));

    const invoiceNumber = generateInvoiceNumber();
    const loyaltyTier = user ? user.loyaltyTier : null
    
    const newInvoice = new Invoice({
      bookingReference,
      invoiceNumber,
      invoiceDate: new Date(),
      bookingId: newBooking._id,
      loyaltyTier: loyaltyTier,
      invoiceAmount: totalPrice,
      status: "issued",
      paymentMethod: paymentMethod,
      paymentStatus: paymentStatus,
      paymentDate: newBooking.createdAt,
      paymentIntentId: paymentIntentId,
      billingName: user?.username || newBooking.contactName,
      billingEmail: user?.email || newBooking.contactEmail,
      billingPhoneNumber: contactNumber,
      rewardDiscount: rewardDiscount,
    });
      await newInvoice.save();

      const rewardClaimed = await ClaimedReward.findOne({ rewardCode: newBooking.rewardCode }).select("_id");
      let reward = null;
      if (rewardClaimed) {
        reward = await Reward.findOne({ _id: rewardClaimed._id }).select(
          "description discountPercentage"
        );
      }

      if(newInvoice){
        await sendInvoiceEmail(
          emailTo,
          {
            username: user?.username || newBooking.contactName,
            bookingReference,
            roomDetail: roomDetails,
            checkInDate,
            checkOutDate,
            breakfastIncluded: newBooking.breakfastIncluded,
            adults: totalGuest.adults,
            children: totalGuest.children,
            totalPrice: totalPrice,
            paymentStatus,
            paymentIntentId,
            paymentMethod,
          },
          reward,
          loyaltyTier,
          invoiceNumber,
          hotelInfo,
        );
      }
    
    // delete current booking session 
    await BookingSession.deleteOne({ sessionId: bookingSessionId });

    return res.status(201).json({ newBooking, qrCodePublicURLfromCloudinary });
  } catch (error) {
    console.error("Error in creating booking:", error);
    return res.status(500).json({ error: error.message });
  }
};

const cancelBooking = async (req, res) => {
  const { bookingReference, email } = req.body;
  console.log("cancel booking: ", bookingReference, email);
  try {
    const booking = await Booking.findOne({
      bookingReference,
      $or: [{ userEmail: email }, { contactEmail: email }],
    });
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    const currentDate = new Date();
    const checkInDate = new Date(booking.startDate);
    const checkOutDate = new Date(booking.endDate);
    const msUntilCheckIn = checkInDate - currentDate;

    const totalHours = Math.max(
      0,
      Math.floor(msUntilCheckIn / (1000 * 60 * 60))
    );
    const daysUntilCheckIn = Math.floor(totalHours / 24);
    const hoursLeftAfterDays = totalHours % 24;

    console.log("daysUntilCheckIn: ", daysUntilCheckIn);
    console.log("hoursLeftAfterDays: ", hoursLeftAfterDays);

    // prevent cancellation if current date is on or after check in date but before check-out date
    if(totalHours <= 0 && currentDate <= checkOutDate){
      return res.status(400).json({
        error: "Cannot cancel booking during or after your stay period."
      })
    }

    // prevent cancellation if current date is after check-out date
    if(currentDate > checkOutDate){
      return res.status(400).json({
        error: "Booking already completed, cancellation not possible."
      })
    }

    if (booking.status === "completed") {
      return res.status(400).json({
        error: "Booking already completed, cancellation not possible.",
      });
    }

    const cancellationRequest = await CancellationRequest.findOne({
      bookingId: booking._id,
      email: email,
    });

    if (cancellationRequest) {
      return res.status(400).json({
        error:
          "Your request is already pending, please wait for our admin to process it.",
      });
    }

    const newCancellationRequest = new CancellationRequest({
      bookingId: booking._id,
      bookingReference,
      email,
      checkInDate: booking.startDate,
    });
    await newCancellationRequest.save();

    const allAdmins = await User.find({
      role: { $in: ["admin", "superAdmin"] },
    });
    const adminIds = allAdmins.map((admin) => admin._id);

    //* notify all admins
    await notifyUsers(
      adminIds,
      `Booking #${bookingReference} with ${email} request for booking cancelled`,
      "booking"
    );

    res
      .status(200)
      .json({ message: "Your Cancel Booking Request has send to our staff. " });
  } catch (error) {
    console.log("Error in cancelBooking: ", error.message);
    res.status(500).json({ error: error.message });
  }
};

const getBookingByUser = async (req, res) => {
  const userId = req.user._id;
  console.log("userid testing:  ", userId)

  try {
    // Fetch all bookings created by the user with userType 'user'
    const userBookingInformation = await Booking.find({
      userType: "user",
      bookingCreatedByUser: new mongoose.Types.ObjectId(userId),
    }).sort({ createdAt: -1 });

    if (!userBookingInformation || userBookingInformation.length === 0) {
      return res.status(400).json({ error: "Booking Not Found!" });
    }

    // Extract all roomIds from the bookings
    const roomIds = userBookingInformation.flatMap((booking) => booking.room);

    // Fetch room details for all roomIds concurrently
    const rooms = await Room.find({ _id: { $in: roomIds } });

    const roomsTypeMap = rooms.reduce((acc, room) => {
      acc[room._id] = room.roomType;
      return acc;
    }, {});

    console.log(roomsTypeMap);

    const bookingDetails = await Promise.all(userBookingInformation.map(async (booking) => {
      const roomType = booking.room?.map((id) => {
        const key = id.toString();
        return roomsTypeMap[key];
      }); // Optional chaining for safety
      // get invoice Id
      const invoice = await Invoice.findOne({ bookingId: booking._id }).select("_id")
      
      return {
        ...booking.toObject(),
        invoiceId: invoice?._id,
        roomType: roomType || "unknown",
      };
    })
  );

    console.log("userBooking: ", userBookingInformation);
    res.status(200).json(bookingDetails);
  } catch (error) {
    console.log("Error in getBookingByUser: ", error.message);
    res.status(500).json({ error: error.message });
  }
};

const createBookingSession = async (req, res) => {
  // 1) Pull body
  const {
    userEmail,
    userType,
    roomId,
    checkInDate,
    checkOutDate,
    totalGuest,
    totalPrice,
    // new guest fields:
    contactName,
    contactEmail,
    contactNumber,
    additionalDetails,
  } = req.body;

  console.log({
    roomId,
    checkInDate,
    checkOutDate,
    totalGuest,
    totalPrice,
  });

  // 2) Core validation
  if (
    !roomId ||
    !checkInDate ||
    !checkOutDate ||
    totalGuest?.adults == null ||
    totalGuest?.children == null ||
    !totalPrice
  ) {
    return res
      .status(400)
      .json({ error: "Please provide all required fields" });
  }

  // 3) If this is a guest (no userId), require the contact info
  if (userType === "Guest Booking") {
    if (!contactName || !contactEmail || !contactNumber) {
      return res.status(400).json({
        error:
          "Guest bookings require contactName, contactEmail and contactNumber",
      });
    }
  }

  const dbSession = await mongoose.startSession();
  dbSession.startTransaction();

  try {
    const sessionId = uuidv4();

    const user = await User.findOne({ email: userEmail })
      .select("_id username")
      .lean(); //convert to object instead of mongodb docs
    
    // prevent overbooking by checking existing bookings for the room
    const overlappingBooking = await Booking.findOne({
      roomId: roomId,
      $or: [
        {
          startDate: { $lt: new Date(checkOutDate) },
          endDate: { $gt: new Date(checkInDate) },
        },
      ],
    }).session(dbSession);

    const overlappingSession = await BookingSession.findOne({
      roomId,
      $or: [
        {
          checkInDate: { $lt: new Date(checkOutDate) },
          checkOutDate: { $gt: new Date(checkInDate) },
        },
      ],
    }).session(dbSession);

    if (overlappingBooking || overlappingSession) {
      await dbSession.abortTransaction();
      dbSession.endSession();
      return res.status(409).json({
        error:
          "This room is already booked or occupied during the selected dates.",
      });
    }

    const rangebetweenCheckInCheckOutDate = differenceInCalendarDays(
      new Date(checkOutDate),
      new Date(checkInDate)
    );

    if (rangebetweenCheckInCheckOutDate <= 0) {
      await dbSession.abortTransaction();
      dbSession.endSession();
      return res
        .status(400)
        .json({ error: "Check-out date must be after check-in date." });
    }

    const actualtotalPrice = rangebetweenCheckInCheckOutDate * totalPrice;

    const passingAbnormallyDatection = {
      sessionId: sessionId,
      totalPrice: Number(actualtotalPrice),
      adults: Number(totalGuest?.adults) || 0,
      children: Number(totalGuest?.children) || 0,
      nights: rangebetweenCheckInCheckOutDate,
      roomId: roomId
    };

    const abnormalDetected = await bookingSessionAbnormalDetection(
      passingAbnormallyDatection
    );

    console.log("result: ", abnormalDetected);

    // 4) Build the document
    const session = new BookingSession({
      sessionId,
      userId: user ? user._id : undefined, // null for one-time guests
      guestId: !user ? req.cookies?.guestId : null, 
      roomId,
      checkInDate,
      checkOutDate,
      totalGuest,
      totalPrice: actualtotalPrice,
      // only include guestDetails when userId is null
      ...(user
        ? {}
        : {
            guestDetails: {
              contactName,
              contactEmail,
              contactNumber,
              additionalDetails: additionalDetails || undefined,
            },
          }),
    });

    await session.save();

    if (
      abnormalDetected.result === "abnormal" ||
      abnormalDetected.anomaly === true
    ) {
      const suspiciousEvent = new SuspiciousEvent({
        userId: user ? user._id : null,
        guestId: !user ? req.cookies.guestId : null,
        type: "abnormal",
        reason: `Abnormal Detected on Booking Session with ${sessionId} on ${
          user ? user.username : contactName
        }`,
        details: session,
        severity: "medium",
        handled: false,
      });

      await suspiciousEvent.save();
    }
    
    await dbSession.commitTransaction();
    dbSession.endSession();
    
    await emitBookingSessionUpdate();
    res.status(201).json({ sessionId });
  } catch (error) {
    console.error("Error in createBookingSession:", error);
    res.status(500).json({ error: error.message });
  }
};

const getBookingSession = async (req, res) => {
  const { sessionId } = req.params;

  try {
    const getSession = await BookingSession.findOne({ sessionId }).sort({ createdAt: -1 });

    if (!getSession) {
      return res.status(404).json({ error: "Session not found or expired" });
    }

    // Convert Mongoose doc to plain object
    const sessionObject = getSession.toObject();

    let customerName = null;

    if (sessionObject.userId) {
      // Session belongs to a logged-in user
      const user = await User.findById(sessionObject.userId).select("name");
      customerName = user?.name || null;
    } else if (sessionObject.guestDetails?.contactName) {
      // Session belongs to a guest
      customerName = sessionObject.guestDetails.contactName;
    }

    const session = {
      ...sessionObject,
      customerName,
    };

    res.status(200).json({ session });
  } catch (error) {
    console.error("Error in getBookingSession: ", error.message);
    res.status(500).json({ error: error.message });
  }
};

const getBookingSessionInAdmin = async(req, res) => {
  try {
    const bookingSession = await bookingSessionUpdate();

    if(!bookingSession){
      return res.status(404).json({ error: "No Booking Session found!" });
    }

    res.status(200).json(bookingSession);
  } catch (error) {
    console.error("Error in getBookingSessionInAdmin: ", error.message);
    res.status(500).json({ error: error.message });
  }
}

const getBookingSessionByUser = async (req, res) => {
  const userId = req.user._id;
  try {
    const bookingSessions = await BookingSession.find({ userId });
    if (!bookingSessions) {
      return res.status(404).json({ error: "No booking sessions found! " });
    }

    const rooms = await Room.find({
      _id: { $in: bookingSessions.flatMap((session) => session.roomId) },
    });
    const roomNameMap = rooms.reduce((acc, room) => {
      acc[room._id.toString()] = room.roomName;
      return acc;
    }, {});
    const user = await User.findById(userId).select("name");

    const bookingSessionsWithUserName = bookingSessions.map((session) => {
      const sessionObject = session.toObject();
      const roomIds = Array.isArray(sessionObject.roomId)
        ? sessionObject.roomId
        : [sessionObject.roomId];
      return {
        ...sessionObject,
        customerName:
          user?.name || sessionObject.guestDetails?.contactName || null,
        roomName: roomIds.map(
          (id) => roomNameMap[id.toString()] || "Unknown Room"
        ),
      };
    });

    return res.status(200).json(bookingSessionsWithUserName);
  } catch (error) {
    console.log("Error in getBookingByUser: ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteBookingSession = async (req, res) => {
  const { sessionId } = req.params;
  try {
    const result = await BookingSession.findOneAndDelete({ sessionId });

    if (!result) {
      return res.status(404).json({ error: "Session not found or expired" });
    }

    await emitBookingSessionUpdate();
    res.status(200).json({ message: "Booking session deleted successfully" });
  } catch (error) {
    console.log("Error in deleteBookingSession: ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const removeRoomFromBookingSession = async (req, res) => {
  const { sessionId, roomId } = req.params;

  console.log(sessionId, roomId);

  if (!sessionId || !roomId) {
    return res.status(400).json({ error: "Invalid request" });
  }

  try {
    const bookingSession = await BookingSession.findOne({
      sessionId: sessionId,
    });

    if (!bookingSession) {
      return res.status(404).json({ error: "Booking Session Not Found " });
    }

    const roomDefaultExcludeBreakfast = await Room.findById(roomId).select("breakfastIncluded")

    if(roomDefaultExcludeBreakfast?.breakfastIncluded){
      bookingSession.breakfastIncluded = Math.max(0, bookingSession.breakfastIncluded - 1);
    }

    bookingSession.roomId = bookingSession.roomId.filter(
      (id) => id.toString() !== roomId
    );
    await bookingSession.save();

    await emitBookingSessionUpdate();
    res
      .status(200)
      .json({ message: "Room removed successfully", bookingSession });
  } catch (error) {
    console.log("Error in remove Room From Booking Session: ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const handleDeleteAllCancelled = async (req, res) => {
  try {
    await BookingSession.deleteMany({ status: "cancelled" });
    await CancellationRequest.deleteMany();
    res
      .status(200)
      .json({ message: "All cancelled booking sessions deleted successfully" });
  } catch (error) {
    console.log("Error in remove Room From Booking Session: ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// update breakfast total
const handleUpdateBreakfastCount = async (req, res) => {
  const { sessionId } = req.params;
  const { breakfastCount } = req.body; 
  console.log("breakfast from frotend: ", breakfastCount);
  console.log("sessionId: ", sessionId);

  if (typeof breakfastCount !== "number" || breakfastCount < 0) {
    return res.status(400).json({ error: "Invalid breakfast count" });
  }

  try {
    const session = await BookingSession.findById(sessionId);
    
    if (!session) {
      return res.status(404).json({ error: "Booking session not found!" });
    }

    await BookingSession.updateOne(
      { _id: sessionId },
      {
        $set: {
          breakfastIncluded: breakfastCount,
        },
      }
    );

    return res.status(200).json(breakfastCount);
  } catch (error) {
    console.error("Error in handleUpdateBreakfastCount:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default {
  createBooking,
  cancelBooking,
  createBookingSession,
  getBookingSession,
  getBookingByUser,
  getBookingSessionInAdmin,
  getBookingSessionByUser,
  deleteBookingSession,
  removeRoomFromBookingSession,
  handleDeleteAllCancelled,
  handleUpdateBreakfastCount,
};
