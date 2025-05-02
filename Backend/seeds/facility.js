// scripts/seedFacilities.ts
import mongoose from "mongoose";
import Facility from "../models/facilities.model.js"
import dotenv from "dotenv";
dotenv.config();

const facilitiesList = [
  {
    facilitiesName: "Swimming Pool",
    description:
      "Relax and unwind in our beautiful swimming pool, perfect for a refreshing dip or lounging under the sun.",
    icon: "WavesLadder",
    iconColor: "text-blue-500",
    openTime: "08:00 AM",
    closeTime: "10:00 PM",
    image: "/facilities.png",
  },
  {
    facilitiesName: "Gym",
    description:
      "Stay fit during your stay with our fully equipped gym, featuring modern exercise equipment and free weights.",
    icon: "Dumbbell",
    iconColor: "text-gray-700",
    openTime: "06:00 AM",
    closeTime: "11:00 PM",
    image: "/facilities2.png",
  },
  {
    facilitiesName: "Playground",
    description:
      "Let your kids enjoy our safe and fun playground, designed for children of all ages.",
    icon: "RollerCoaster",
    iconColor: "text-yellow-700",
    openTime: "08:00 AM",
    closeTime: "10:00 PM",
    image: "/facilities3.png",
  },
  {
    facilitiesName: "Restaurant",
    description:
      "Indulge in delicious meals at our on-site restaurant, offering a variety of cuisines to satisfy every palate.",
    icon: "Utensils",
    iconColor: "text-red-600",
    openTime: "07:00 AM",
    closeTime: "11:00 PM",
    image: "/facilities4.png",
  },
  {
    facilitiesName: "8-Ball Room",
    description:
      "Enjoy a game of 8-ball in our dedicated 8-Ball Room, perfect for both beginners and experienced players.",
    icon: "CircleDot",
    iconColor: "text-black",
    openTime: "08:00 AM",
    closeTime: "10:00 PM",
    image: "/facilities5.png",
  },
];

const seedDatabase = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("Connected to MongoDB");

    await Facility.deleteMany({});
    await Facility.insertMany(facilitiesList);

    console.log("Facility seeded successfully!");
  } catch (error) {
    console.error("Error seeding facility:", error.message);
  } finally {
    mongoose.connection.close();
  }
};

seedDatabase();
