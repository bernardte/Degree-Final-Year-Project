import mongoose from "mongoose";
import Room  from "../models/room.model.js";
import dotenv from "dotenv";

dotenv.config();

const rooms = [
  {
    roomNumber: "101",
    roomName: "Deluxe Room",
    roomType: "deluxe",
    description: "1 King Bed | 2 Adults | 30 m²",
    roomDetails:
      "Elegantly furnished with modern décor, the Deluxe Room offers a plush king-sized bed, cozy lighting, and a stylish ensuite bathroom. Ideal for couples or business travelers looking for comfort and convenience.",
    pricePerNight: 220,
    amenities: ["wifi", "tv", "ac", "balcony", "breakfast"],
    images: ["/deluxe room.png"],
    capacity: {
      adults: 2,
      children: 1,
    },
  },
  {
    roomNumber: "102",
    roomName: "Sea View Suite",
    roomType: "sea view",
    description: "1 King Bed | 2 Adults | 32 m²",
    roomDetails: `Wake up to breathtaking ocean views in the Sea View Room. Featuring floor-to-ceiling windows, a private balcony, and serene interiors inspired by the sea breeze.`,
    pricePerNight: 350,
    amenities: ["wifi", "tv", "ac", "bathtub", "pool", "gym", "breakfast"],
    images: ["/sea view room.png"],
    capacity: {
      adults: 4,
      children: 2,
    },
  },
  {
    roomNumber: "103",
    roomName: "Single Standard Room",
    roomType: "single",
    description: "1 Single Beds | 1 Adults | 28 m²",
    roomDetails: `Modern and cozy, the Deluxe Twin Room is designed for friends or solo travelers. Includes two comfortable beds, minimalist décor, and convenient access to all facilities.`,
    pricePerNight: 100,
    amenities: ["wifi", "tv", "ac", "fridge"],
    images: ["/standard room.png"],
    capacity: {
      adults: 1,
    },
  },
  {
    roomNumber: "201",
    roomName: "Balcony Room",
    roomType: "balcony",
    description: "1 King or 2 Single Beds | 2 Adults & 2 Kids | 35 m²",
    roomDetails: `The perfect pristine accommodation featuring an exceptional view of the largest free-form swimming pool in northern Malaysia. Each room features a private relaxing balcony with views of the 26,000 sqft pool, a rock star inspired dual function bathroom wall and contemporary in-room amenities.`,
    pricePerNight: 220,
    amenities: ["wifi", "tv", "ac", "balcony", "breakfast"],
    images: ["/balcony room.png"],
    capacity: {
      adults: 2,
      children: 1,
    },
  },
  {
    roomNumber: "202",
    roomName: "Deluxe Twin Room",
    roomType: "deluxe twin",
    description: "2 Single Beds | 2 Adults | 30 m²",
    roomDetails: `The Deluxe Twin Room offers a comfortable stay with two single beds, perfect for friends or family traveling together. Enjoy modern amenities and a cozy environment for a relaxing getaway.`,
    pricePerNight: 230,
    amenities: ["wifi", "tv", "ac", "breakfast"],
    images: ["/deluxe twin room.png"],
    capacity: {
      adults: 2,
      children: 1,
    },
  },
  {
    roomNumber: "301",
    roomName: "Double Bed Room",
    roomType: "double bed",
    description: "2 Double Beds | 4 Adults | 40 m²",
    roomDetails: `Spacious and functional, the Double Bedroom is perfect for families or groups. Equipped with two double beds, a relaxing lounge area, and all essential amenities for a comfortable stay.`,
    pricePerNight: 220,
    amenities: ["wifi", "tv", "ac", "bathtub"],
    images: ["/double bedroom.png"],
    capacity: {
      adults: 2,
      children: 1,
    },
  },
];

const seedDatabase = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB");

    await Room.deleteMany({});
    await Room.insertMany(rooms);

    console.log("Rooms seeded successfully!");
  } catch (error) {
    console.error("Error seeding rooms:", error.message);
  } finally {
    mongoose.connection.close();
  }
};

seedDatabase();
