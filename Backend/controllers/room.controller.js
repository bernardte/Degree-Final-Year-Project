import Room from "../models/room.model.js";
import Booking from "../models/booking.model.js";
import RoomAvailability from "../models/roomAvailability.model.js";

const paginatedAllRooms = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const skip = (page - 1) * limit;
  try {
    const [rooms, totalCount] = await Promise.all([
      Room.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
      Room.countDocuments(),
    ]);
    res.status(200).json({ rooms, totalPages: Math.ceil(totalCount / limit), currentPage: page });
  } catch (error) {
    console.log("Error in getAllRooms: ", error.message);
    res.status(500).json({ error: error.message });
  }
};

const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ isActivate: true });
    if(!rooms){
      return res.status(404).json({ message: "No rooms found" });
    }
    res.status(200).json(rooms);
  } catch (error) {
    console.log("Error in getAllRooms", error.message);
    res.status(500).json({ error: error.message });
  }
}

const getRoomById = async (req, res) => {
  const { roomId } = req?.params;

  try {
    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    res.status(200).json(room);
  } catch (error) {
    console.log("Error in getRoomById: ", error.message);
    res.status(500).json({ error: error.message });
  }
};
const getMostBookingRoom = async (req, res) => {
  try {
    const mostBookingRoom = await Room.aggregate([
      {
        $match: { isActivate: true }
      },
      // Lookup bookings (optional, since you already store booking references)
      {
        $lookup: {
          from: "bookings",
          localField: "_id",
          foreignField: "room",
          as: "bookings",
        },
      },

      // Add bookings count and average rating
      {
        $addFields: {
          bookingsCount: { $size: "$bookings" },
          averageRating: {
            $cond: [
              { $gt: [{ $size: "$reviews" }, 0] },
              { $avg: "$reviews.rating" },
              null,
            ],
          },
        },
      },

      // Project the fields you want to return
      {
        $project: {
          roomNumber: 1,
          roomType: 1,
          pricePerNight: 1,
          description: 1,
          capacity: 1,
          amenities: 1,
          images: 1,
          bookingsCount: 1,
          rating: 1,
          reviews: 1,
          averageRating: 1,
        },
      },

      // Sort by bookings count
      {
        $sort: { bookingsCount: -1 },
      },

      // Limit to top 4 rooms
      {
        $limit: 4,
      },
    ]);

    res.status(200).json(mostBookingRoom);
    console.log(mostBookingRoom);
  } catch (error) {
    console.log("Error in getMostBookingRoom:", error.message);
    res.status(500).json({ error: error.message });
  }
};

const getOneRoomPerType = async (req, res) => {
  try {
    const rooms = await Room.aggregate([
      {
        $match: { isActivate: true }
      },
      {
        $sort: { createdAt: -1 }, //sort by most recent or any other criteria
      },
      {
        $group: {
          _id: "$roomType",
          room: { $first: "$$ROOT" }, //Get the first room from each group
        },
      },
      {
        $replaceRoot: { newRoot: "$room" }, //Flatten the result (remove the 'room' wrapper)
      },
      {
        $sort: { roomType: 1 }, //sort by room type name
      },
    ]);

    res.status(200).json(rooms);
  } catch (error) {
    console.log("Error in getOneRoomPerType: ", error.message);
    res.status(500).json({ error: error.message });
  }
};

const filterRooms = async (req, res) => {
  try {
    const {
      roomType,
      minPrice,
      maxPrice,
      amenities,
      checkInDate,
      checkOutDate,
      adults = 1,
      children = 0,
    } = req.query;

    const filter = {
      isActivate: true,
    };

    if (roomType) {
      filter.roomType = roomType;
    }

    if (minPrice || maxPrice) {
      filter.pricePerNight = {};
      if (minPrice) filter.pricePerNight.$gte = Number(minPrice);
      if (maxPrice) filter.pricePerNight.$lte = Number(maxPrice);
    }

    if (amenities) {
      const amenityArray = Array.isArray(amenities)
        ? amenities
        : amenities.split(",");
      filter.amenities = { $in: amenityArray };
    }

    // First, find all rooms matching the basic filter
    let rooms = await Room.find(filter);

    if (checkInDate && checkOutDate) {
      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkOutDate);

      // Find bookings that overlap with requested dates
      const overlappingBookings = await Booking.find({
        startDate: { $lte: checkOut }, // booking starts before requested checkout
        endDate: { $gte: checkIn }, // booking ends after requested checkin
      }).select("room");

      console.log("Overlapping Bookings:", overlappingBookings);

      const bookedRoomIds = new Set(
        overlappingBookings.flatMap((b) => b.room.map((id) => id.toString())) //ensure to get each individual room ID
      );

      // Filter out rooms that are booked or don't meet guest capacity
      rooms = rooms.filter((room) => {
        const isAvailable = !bookedRoomIds.has(room._id.toString());
        const meetsCapacity =
          room.capacity.adults >= Number(adults) &&
          room.capacity.children >= Number(children);
        return isAvailable && meetsCapacity;
      });
    }

    res.status(200).json(rooms);
  } catch (error) {
    console.error("Error in filterRooms:", error.message);
    res.status(500).json({ error: "Failed to filter rooms." });
  }
};

const searchAvailableRooms = async (req, res) => {
  const { checkInDate, checkOutDate, adults, children } = req.body;

  if (!checkInDate || !checkOutDate) {
    return res
      .status(400)
      .json({ error: "Check-in and check-out dates are required." });
  }

  try {
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    const overlappingBookings = await Booking.find({
      $or: [
        {
          startDate: { $lt: checkOut },
          endDate: { $gt: checkIn },
        },
      ],
    }).select("room");

    const bookedRoomIds = overlappingBookings.map((b) => b.room.toString());

    const availability = await RoomAvailability.find({
      date: { $gte: checkIn, $lt: checkOut },
    });

    const unavailableRoomIds = new Set();
    availability.forEach((entry) => {
      entry.unavailableRooms.forEach((roomId) =>
        unavailableRoomIds.add(roomId.toString())
      );
    });

    const allUnavailable = new Set([...bookedRoomIds, ...unavailableRoomIds]);

    const availableRooms = await Room.find({
      _id: { $nin: [...allUnavailable] },
      "capacity.adults": { $gte: Number(adults || 1) },
      "capacity.children": { $gte: Number(children || 0) },
    });

    res.status(200).json(availableRooms);
  } catch (error) {
    console.error("Error in searchAvailableRooms:", error.message);
    res.status(500).json({ error: error.message });
  }
};

const roomReview = async (req, res) => {
  const roomId = req.params.roomId;
  const { rating, comment, bookingReference } = req.body;
  const userId = req.user._id;
  const username = req.user.username;

  console.log("User:", username);
  console.log("User ID:", userId);
  console.log("Room ID:", roomId);

  if (!comment || !rating) {
    return res.status(400).json({ error: "Comment and rating are required" });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ error: "Rating must be between 1 and 5" });
  }

  try {
    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    // Check if user already reviewed this room
    const alreadyReviewed = room.reviews.some(
      (review) =>
        String(review.user) === String(userId) &&
        review.bookingReference === bookingReference
    );

    console.log(alreadyReviewed);

    if (alreadyReviewed) {
      return res
        .status(400)
        .json({ error: "You have already reviewed this room." });
    }

    // Create and add review
    const review = {
      user: userId,
      rating,
      comment,
      username,
      bookingReference,
      createdAt: new Date(),
    };

    room.reviews.push(review);

    //Recalculate average rating
    room.rating =
      room.reviews.length > 0
        ? room.reviews.reduce((acc, review) => acc + review.rating, 0) /
          room.reviews.length
        : 0;

    await room.save();

    return res.status(200).json(review);
  } catch (error) {
    console.log("Error in roomReview:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

export default {
  paginatedAllRooms,
  getAllRooms,
  getRoomById,
  getMostBookingRoom,
  getOneRoomPerType,
  filterRooms,
  searchAvailableRooms,
  roomReview,
};
