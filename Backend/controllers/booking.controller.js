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
import SystemSetting from "../models/systemSetting.model.js";
import RewardHistory from "../models/rewardHistory.model.js";

const createBooking = async (req, res) => {
  const { bookingSessionId, specialRequests } = req.body;
  console.log("sessionId: ", bookingSessionId, specialRequests);
  console.log("request body: ", req.body);

  let guestUserId = null;

  if (!bookingSessionId) {
    return res.status(400).json({ error: "bookingSessionId is required" });
  }

  try {
    const session = await BookingSession.findOne({
      sessionId: bookingSessionId,
    });

    if (!session) {
      return res.status(404).json({ error: "Booking session not found" });
    }
    console.log("Booking session data: ", session); // Ensure session data is correct

    if (session.guestDetails) {
      guestUserId = session.guestDetails._id;
    }

    const {
      roomId,
      checkInDate,
      checkOutDate,
      userId,
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
    } = session;

    if (new Date(checkOutDate) <= new Date(checkInDate)) {
      return res
        .status(400)
        .json({ error: "Check-out date must be after check-in date" });
    }

    const bookingReference = uuidv4(); // Unique reference

    // Find rooms using the roomId array
    const rooms = await Room.find({ _id: { $in: roomId } });
    if (rooms.length !== roomId.length) {
      return res.status(404).json({ error: "One or more rooms not found" });
    }

    // Check if the rooms are available for the selected dates
    for (let room of rooms) {
      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkOutDate);

      const overlappingBooking = await Booking.findOne({
        room: room._id,
        startDate: { $lt: checkOut },
        endDate: { $gt: checkIn },
      });

      if (overlappingBooking) {
        return res.status(400).json({
          error: `Room ${room.roomNumber} is already booked for the selected dates`,
        });
      }
    }

    // Proceed with booking for each room
    const user = userId ? await User.findById(userId) : null;

    const newBooking = new Booking({
      userEmail: contactEmail || (user ? user.email : null),
      bookingCreatedByUser: userId || guestUserId,
      userType: userId ? "user" : "guest",
      room: rooms.map((room) => room._id), // Store all room IDs
      startDate: checkInDate,
      endDate: checkOutDate,
      totalGuests: totalGuest,
      breakfastIncluded,
      totalPrice,
      bookingReference,
      specialRequests,
      paymentMethod,
      paymentStatus,
      paymentIntentId,
      contactName: contactName || guestDetails?.contactName || null,
      contactEmail: contactEmail || guestDetails?.contactEmail || null,
      contactNumber: contactNumber || guestDetails?.contactNumber || null,
    });

    await newBooking.save();

    // Add booking to rooms' bookings array
    for (let room of rooms) {
      room.bookings.push(newBooking._id);
      await room.save();
    }

    if (userId && !user) {
      return res.status(404).json({ error: "User not found" });
    }

    const roomDetails = rooms.map((room) => ({
      roomType: room.roomType,
      roomNumber: room.roomNumber,
    })); // get each room details
    const { adults, children } = totalGuest;

    const qrCodeData = {
      bookingReference,
      checkInDate,
      checkOutDate,
      rooms: roomDetails.map(({ roomType, roomNumber }) => ({
        roomType,
        roomNumber,
      })),
    };

    const qrCodePublicURLfromCloudinary = await generateAndUploadQRCode(
      qrCodeData
    );

    const bookingData = {
      username: user?.username || contactName,
      bookingReference,
      roomDetail: roomDetails,
      checkInDate,
      checkOutDate,
      breakfastIncluded,
      adults,
      children,
      totalPrice,
      qrCodeImageURL: qrCodePublicURLfromCloudinary,
    };

    newBooking.qrCodeImageURL = qrCodePublicURLfromCloudinary;

    await newBooking.save();

    //? earn point for the login user.
    if(user){
      const setting = await SystemSetting.findOne({
        key: "rewardPointsSetting",
      });
      const pointsPerNight = setting?.value.bookingRewardPoints || 0; //* default 0 reward points
  
      const nights = Math.ceil(
        (new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24)
      );
      const roomsBooked = rooms.length;
      const loyaltyTierRatio = setting?.value.tierMultipliers;
      const userLoyaltyTier = user.loyaltyTier;
      const tierMultipliers = loyaltyTierRatio[userLoyaltyTier.toLowerCase()];

      const basedPoints = nights * roomsBooked * pointsPerNight;
      const rewardPoints = Math.round(basedPoints * tierMultipliers);

      // increase user reward points
      user.rewardPoints = (user.rewardPoints || 0) + rewardPoints;
      await user.save();

      // create history reward points
      await RewardHistory.create({
        user: user._id,
        bookingId: newBooking._id,
        bookingReference: newBooking.bookingReference,
        points: rewardPoints,
        description: `Earned for booking ${rooms.length} room(s) for ${nights} night(s)`,
        type: "earn",
        source: "booking",
      });
    }

    const emailToSend =
      user?.email || contactEmail || session?.guestDetails?.contactEmail;

    if (emailToSend && qrCodePublicURLfromCloudinary) {
      await sendBookingConfirmationEmail(emailToSend, bookingData);
    }

    await BookingSession.deleteOne({ sessionId: bookingSessionId });
    console.log(`Deleted booking session with sessionId: ${bookingSessionId}`);

    res.status(201).json({ newBooking, qrCodePublicURLfromCloudinary });
  } catch (error) {
    console.error("Error in creating booking:", error.message);
    res.status(500).json({ error: error.message });
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

    const msUntilCheckIn = checkInDate - currentDate;

    const totalHours = Math.max(
      0,
      Math.floor(msUntilCheckIn / (1000 * 60 * 60))
    );
    const daysUntilCheckIn = Math.floor(totalHours / 24);
    const hoursLeftAfterDays = totalHours % 24;

    console.log("daysUntilCheckIn: ", daysUntilCheckIn);
    console.log("hoursLeftAfterDays: ", hoursLeftAfterDays);

    if (booking.status === "completed") {
      return res
        .status(400)
        .json({
          error: "Booking already completed, cancellation not possible.",
        });
    }

    const cancellationRequest = await CancellationRequest.findOne({
      bookingId: booking._id,
      email: email,
    });

    if (cancellationRequest) {
      return res
        .status(400)
        .json({
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
  console.log("userId: ", userId);

  try {
    // Fetch all bookings created by the user with userType 'user'
    const userBookingInformation = await Booking.find({
      userType: "user",
      bookingCreatedByUser: new mongoose.Types.ObjectId(userId),
    }).sort({ createdAt: -1 });

    console.log(userBookingInformation);

    if (!userBookingInformation || userBookingInformation.length === 0) {
      return res.status(400).json({ error: "Booking Not Found!" });
    }

    // Extract all roomIds from the bookings
    const roomIds = userBookingInformation.flatMap((booking) => booking.room);
    console.log(roomIds);

    // Fetch room details for all roomIds concurrently
    const rooms = await Room.find({ _id: { $in: roomIds } });

    const roomsTypeMap = rooms.reduce((acc, room) => {
      acc[room._id] = room.roomType;
      return acc;
    }, {});

    console.log(roomsTypeMap);

    const bookingDetails = userBookingInformation.map((booking) => {
      const roomType = booking.room?.map((id) => {
        const key = id.toString();
        return roomsTypeMap[key];
      }); // Optional chaining for safety
      return {
        ...booking.toObject(),
        roomType: roomType || "unknown",
      };
    });

    console.log(bookingDetails);
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

  console.log(userEmail);

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

  try {
    const sessionId = uuidv4();

    const userId = await User.findOne({ email: userEmail })
      .select("_id")
      .lean(); //convert to object instead of mongodb docs

    const rangebetweenCheckInCheckOutDate = differenceInCalendarDays(
      new Date(checkOutDate),
      new Date(checkInDate)
    );
    const actualtotalPrice = rangebetweenCheckInCheckOutDate * totalPrice;

    // 4) Build the document
    const session = new BookingSession({
      sessionId,
      userId: userId ? userId : undefined, // null for one-time guests
      roomId,
      checkInDate,
      checkOutDate,
      totalGuest,
      totalPrice: actualtotalPrice,
      // only include guestDetails when userId is null
      ...(userId
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

    res.status(201).json({ sessionId });
  } catch (error) {
    console.error("Error in createBookingSession:", error);
    res.status(500).json({ error: error.message });
  }
};

const getBookingSession = async (req, res) => {
  const { sessionId } = req.params;

  try {
    const getSession = await BookingSession.findOne({ sessionId });
    console.log(getSession);

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

    console.log("Booking Sessions: ", bookingSessionsWithUserName);

    return res.status(200).json(bookingSessionsWithUserName);
  } catch (error) {
    console.log("Error in getBookingByUser: ", error.message);
    res.status(500).json({ error: error.messgae });
  }
};

const deleteBookingSession = async (req, res) => {
  const { sessionId } = req.params;
  console.log(sessionId);
  try {
    const result = await BookingSession.findOneAndDelete({ sessionId });
    console.log("your result: ", result);

    if (!result) {
      return res.status(404).json({ error: "Session not found or expired" });
    }

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

    bookingSession.roomId = bookingSession.roomId.filter(
      (id) => id.toString() !== roomId
    );
    await bookingSession.save();

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

export default {
  createBooking,
  cancelBooking,
  createBookingSession,
  getBookingSession,
  getBookingByUser,
  getBookingSessionByUser,
  deleteBookingSession,
  removeRoomFromBookingSession,
  handleDeleteAllCancelled,
};
