import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";
import { validateRoomAmenities } from "../validation/amenities.js";
import { v2 as cloudinary } from "cloudinary";
import Booking from "../models/booking.model.js";
import Room from "../models/room.model.js";
import RoomAvailability from "../models/roomAvailability.model.js";
import Event from "../models/event.model.js";
import User from "../models/user.model.js";
import sendEventResponseEmail from "../utils/sendEventResponseEmail.js";
import OTP from "../models/adminOTP.model.js";

const getUser = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    if (!users) {
      return res.status(400).json({ error: "users not found" });
    }
    res.status(200).json(users);
  } catch (error) {
    console.log("Error in getUser: ", error.message);
    res.status(500).json({ error: error.message });
  }
};

const updateUserRole = async (req, res) => {
  const { newRole, userId } = req.body;
  const currentLoginUserId = req.user._id;
  try {
    if (!userId || !newRole) {
      return res
        .status(400)
        .json({ error: "User ID and new role cannot be empty" });
    }

    //prevent update own role
    if (currentLoginUserId.toString() === userId) {
      return res.status(400).json({ error: "Cannot update your own role" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Prevent updating if the new role is the same as current
    if (user.role === newRole) {
      return res
        .status(400)
        .json({ error: "New role is the same as the current role" });
    }

    if (newRole === "superAdmin" || req.user.role === newRole) {
      return res.status(403).json({
        error:
          "Access denied: You do not have sufficient permission to assign the 'Super Admin' role.",
      });
    }

    user.role = newRole;
    await user.save();
    return res.status(200).json({ message: `User role updated to ${newRole}` });
  } catch (error) {
    console.log("Error in updateUserRole: ", error.message);
    res.status(500).json({ error: error.message });
  }
};

//OTP update
const changeOTPVerificationCode = async (req, res) => {
  const { newOTP } = req.body;
  const superAdminId = req.user._id;

  if (!newOTP) {
    return res.status(400).json({ error: "OTP cannot be empty" });
  }

  try {
    const OTP = await OTP.findOneAndUpdate(
      { superAdminId },//filter
      { otpCode: newOTP },//update otp
      { new: true, upsert: true }//if not found then create
    );
    res.status(200).json({
      message: "OTP updated successfully",
      updatedOTP,
    });
  } catch (error) {
    console.log("Error in changeOTPVerificationCode", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// create room by admin panel
const addRoom = async (req, res) => {
  const {
    bedType,
    roomName,
    roomNumber,
    roomType,
    description,
    pricePerNight,
    amenities,
    capacity,
    roomDetails,
  } = req.body;

  const imageFile = req.files.images;
  // parse capacity string into an object
  const { Adults, Children } = JSON.parse(capacity);
  if (
    !bedType ||
    !roomName ||
    !roomNumber ||
    !roomType ||
    !description ||
    !pricePerNight ||
    !amenities ||
    !imageFile ||
    !roomDetails ||
    Adults === undefined ||
    Children === undefined
  ) {
    return res
      .status(400)
      .json({ error: "Please provide all required fields" });
  }

  if (Adults < 1 || Adults > 4) {
    return res
      .status(400)
      .json({ error: "Adults count must be between 1 and 4" });
  }

  const amenitiesArray = amenities.split(","); // ['wifi', 'air conditioning', 'tv']
  console.log(amenitiesArray)
  const isValid = validateRoomAmenities(amenitiesArray);

  if (!isValid) {
    return res.status(400).json({ error: "Invalid amenities" });
  }

  try {
    const existingRoom = await Room.findOne({
      roomNumber,
    });
    if (existingRoom) {
      return res.status(400).json({ message: "Room number already exists." });
    }
    
    const imagesUrls = await uploadToCloudinary(imageFile);
    const newRoom = new Room({
      bedType,
      roomName,
      roomNumber,
      roomType: roomType.toLowerCase(),
      roomDetails,
      description,
      pricePerNight,
      amenities: amenitiesArray,
      images: imagesUrls,
      capacity: {
        children: Children,
        adults: Adults,
      },
    });

    await newRoom.save();
    res.status(201).json(newRoom);
  } catch (error) {
    console.log("Error in addRoom: ", error.message);
    res.status(500).json({ error: error.message });
  }
};
const updateRoom = async (req, res) => {
  const {
    roomNumber,
    roomType,
    description,
    pricePerNight,
    amenities,
    "capacity[adults]": adultsRaw,
    "capacity[children]": childrenRaw,
  } = req.body;

  const adults = parseInt(adultsRaw, 10);
  const children = parseInt(childrenRaw, 10);
  
  console.log(req.body);
  const { roomId } = req.params;
  const { images } = req.files || {};
  let imageUrls = null;
  
  if (!roomId) {
    return res.status(400).json({ error: "Please provide a room ID" });
  }

  if (adults < 1 || adults > 5) {
    return res
      .status(400)
      .json({ error: "Adults count must be between 1 and 5" });
  }

  const isValid = validateRoomAmenities(amenities);
  console.log(isValid);

  if (!isValid) {
    return res.status(400).json({ error: "Invalid amenities" });
  }

  try {
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }
    if (images && room.images) {
      const imgId = room.images[0]?.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgId);
    }

    if (images) {
      //! ensure multiple image uploads in the future 
      const imageArray = Array.isArray(images) ? images : [images];
      imageUrls = await Promise.all(imageArray.map(uploadToCloudinary));
    }
    room.roomNumber = roomNumber || room.roomNumber;
    room.roomType = roomType || room.roomType;
    room.description = description || room.description;
    room.pricePerNight = pricePerNight || room.pricePerNight;
    room.amenities = amenities || room.amenities;
    room.images = imageUrls || room.images;
    room.capacity = {
      adults: adults || room.capacity.adults,
      children: children || room.capacity.children,
    };
    await room.save();
    res.status(200).json(room);
  } catch (error) {
    console.log("Error in updateRoom: ", error.message);
    res.status(500).json({ error: error.message });
  }
};

const deleteRoom = async (req, res) => {
  const { roomId } = req.params;

  if (!roomId) {
    return res.status(400).json({ error: "Please provide a room ID" });
  }

  try {
    // Check if the room exists
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    // Optional: Check if this room is associated with any booking
    const existingBooking = await Booking.findOne({ room: room._id });
    if (existingBooking) {
      return res
        .status(400)
        .json({ error: "Cannot delete room that is already booked" });
    }

    // Extract image ID from image URL
    const imageUrl = Array.isArray(room.images) ? room.images[0] : room.images;
    const imgId = imageUrl.split("/").pop().split(".")[0];

    // Delete image from Cloudinary
    await cloudinary.uploader.destroy(imgId);

    // Delete the room from DB
    await Room.findByIdAndDelete(roomId);

    res.status(200).json({ message: "Room deleted successfully" });
  } catch (error) {
    console.error("Error in deleteRoom: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// after payment is done, automatically update the payment status to paid
const updatePaymentStatus = async (req, res) => {
  const { bookingCreatedByUser, bookingReference } = req.body;

  try {
    const booking = await Booking.findOne({
      bookingCreatedByUser,
      bookingReference,
    });
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    booking.paymentStatus = "paid"; // Update payment status to paid
    await booking.save(); // Save the updated booking status
    res.status(200).json(booking);
  } catch (error) {
    console.error("Error updating payment status: ", error.message);
    res.status(500).json({ error: error.message });
  }
};

//use in admin panel to get all bookings
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("room", "roomType pricePerNight") // Populate the room field with roomType and pricePerNight
      .populate("bookingCreatedByUser", "name email");

    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ error: "No bookings found" });
    }

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching all bookings: ", error.message);
    res.status(500).json({ error: error.message });
  }
};

//user and admin use
const getBookingByUserId = async (req, res) => {
  const { userId } = req.params;
  if (!userId.trim() === "") {
    return res.status(400).json({ error: "Please provide a user ID" });
  }
  try {
    const bookings = await Booking.find({
      bookingCreatedByUser: userId,
    }).populate("room", "roomType pricePerNight"); // Populate the room field with roomType and pricePerNight
    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ error: "No bookings found for this user" });
    }

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching booking by user ID: ", error.message);
    res.status(500).json({ error: error.message });
  }
};

//update by admin select by and drop down list
const updateBookingStatus = async (req, res) => {
  const { bookingId } = req.params;
  const { status } = req.body; // Assuming status is the field to be updated
  if (!status.trim() === "" || !bookingId.trim() === "") {
    return res
      .status(400)
      .json({ error: "Please provide a booking ID and status" });
  }

  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    if(booking.status === status){
      return res.status(400).json({ error: "Booking status is already " + status });
    }

    booking.status = status; // Update the booking status
    await booking.save(); // Save the updated booking status
    return res
      .status(200)
      .json({ message: `successfully update to ${status}` });
  } catch (error) {
    console.error("Error updating booking: ", error.message);
    return res.status(500).json({ error: error.message });
  }
};

//cancel booking by admin or user
const deleteBooking = async (req, res) => {
  const { bookingId } = req.params;
  if (!bookingId.trim() === "") {
    return res.status(400).json({ error: "Please provide a booking ID" });
  }
  try {
    await Booking.findByIdAndDelete(bookingId);
    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.error("Error deleting booking: ", error.message);
    res.status(500).json({ error: error.message });
  }
};

// filter bookings by payment status and booking status in admin panel

const filterBookingsByPaymentStatusAndBookingStatus = async (req, res) => {
  const { paymentStatus, status } = req.query;

  const filter = {};
  if (paymentStatus) {
    filter.paymentStatus = paymentStatus;
  }
  if (status) {
    filter.status = status;
  }

  try {
    // Fetch all unavailable room IDs from the UnavailableRoom collection
    const unavailableRooms = await RoomAvailability.find().select(
      "unavailableRooms"
    );

    if (!unavailableRooms || unavailableRooms.length === 0) {
      return res.status(404).json({ error: "No Unavailable Room Found" });
    }

    // Extract only the roomIds
    const unavailableRoomIds = unavailableRooms.map((room) => room.roomId);

    // Query bookings and populate room details
    let bookings = await Booking.find(filter).populate(
      "room",
      "roomNumber roomType pricePerNight"
    );

    // Filter out bookings with rooms that are in the unavailableRooms list
    bookings = bookings.filter(
      (booking) => !unavailableRoomIds.includes(booking.room._id.toString())
    );

    // If no bookings found after filtering
    if (bookings.length === 0) {
      return res
        .status(404)
        .json({ error: "No bookings found with specified filters" });
    }

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error filtering bookings: ", error.message);
    res.status(500).json({ error: error.message });
  }
};

const filterAvailableRoomsForAdmin = async (req, res) => {
  try {
    const {
      checkInDate,
      checkOutDate,
      roomType,
      minPrice,
      maxPrice,
      adults,
      children,
    } = req.query;

    if (!checkInDate || !checkOutDate) {
      return res
        .status(400)
        .json({ error: "Check-in and Check-out dates are required" });
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    // 1. Find overlapping bookings
    const overlappingBookings = await Booking.find({
      startDate: { $lt: checkOut },
      endDate: { $gt: checkIn },
    }).select("room");

    const bookedRoomIds = overlappingBookings.map((b) => b.room.toString());

    // 2. Find available rooms
    const filter = {
      _id: { $nin: bookedRoomIds },
    };

    if (roomType) filter.roomType = roomType;

    if (minPrice || maxPrice) {
      filter.pricePerNight = {};
      if (minPrice) filter.pricePerNight.$gte = Number(minPrice);
      if (maxPrice) filter.pricePerNight.$lte = Number(maxPrice);
    }

    if (adults) filter["capacity.adults"] = { $gte: Number(adults) };
    if (children) filter["capacity.children"] = { $gte: Number(children) };

    const availableRooms = await Room.find(filter);

    res.status(200).json(availableRooms);
  } catch (error) {
    console.error("Error filtering available rooms for admin:", error.message);
    res.status(500).json({ error: error.message });
  }
};

const getAllEventsQuery = async (req, res) => {
  try {
    const events = await Event.find();

    if (!events) {
      return res.status(404).json({ error: "No events found" });
    }

    res.status(200).json(events);
  } catch (error) {
    console.log("Error in getAllEventsQuery: ", error.message);
    res.ststus(500).json({ error: error.message });
  }
};

const acceptEvents = async (req, res) => {
  const { status } = req.body;
  const { eventId } = req.params;
  let user = null;

  if (!["pending", "Accept", "Decline"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const enquiry = await Event.findById({ _id: eventId });
    if (!enquiry) {
      return res.status(404).json({ error: "Enquiry not found" });
    }

    user = enquiry.fullname;
    enquiry.status = status;
    await enquiry.save();

    if (status === "Accept") {
      await sendEventResponseEmail(enquiry, true);
    }

    res.status(200).json({ message: `${user} update ${status}` });
    user = null;
  } catch (error) {
    console.log("Error in acceptEvents: ", error.message);
    return res.ststus(500).json({ error: error.message });
  }
};

const rejectEvents = async (req, res) => {
  const { eventId } = req.params;
  let user = null;

  try {
    const enquiry = await Event.findById(eventId);

    if (!enquiry) {
      return res.status(404).json({ error: "Enquiry not found" });
    }
    user = enquiry.fullname;

    await Event.deleteOne({ _id: eventId });

    if (!enquiry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }

    await sendEventResponseEmail(enquiry, false);

    res
      .status(200)
      .json({ message: `Event Request of ${user} has been Rejected` });
  } catch (error) {
    console.log("Error in rejectEvents: ", error.message);
    return res.ststus(500).json({ error: error.message });
  }
};

export default {
  getUser,
  updateUserRole,
  changeOTPVerificationCode,
  addRoom,
  updateRoom,
  deleteRoom,
  updatePaymentStatus,
  getAllBookings,
  updateBookingStatus,
  deleteBooking,
  getBookingByUserId,
  filterBookingsByPaymentStatusAndBookingStatus,
  filterAvailableRoomsForAdmin,
  getAllEventsQuery,
  acceptEvents,
  rejectEvents,
};
