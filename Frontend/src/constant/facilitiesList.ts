import {
  Dumbbell,
  WavesLadder,
  RollerCoaster,
  Utensils,
  CircleDot,
} from "lucide-react";

const facilitiesList = [
  {
    id: 1,
    name: "Swimming Pool",
    description:
      "Relax and unwind in our beautiful swimming pool, perfect for a refreshing dip or lounging under the sun.",
    icon: WavesLadder,
    iconColor: "text-blue-500",
    openTime: "08:00 AM",
    closeTime: "10:00 PM",
    image: "/facilities.png",
  },
  {
    id: 2,
    name: "Gym",
    description:
      "Stay fit during your stay with our fully equipped gym, featuring modern exercise equipment and free weights.",
    icon: Dumbbell,
    iconColor: "text-gray-700",
    openTime: "06:00 AM",
    closeTime: "11:00 PM",
    image: "/facilities2.png",
  },
  {
    id: 3,
    name: "Playground",
    description:
      "Let your kids enjoy our safe and fun playground, designed for children of all ages.",
    icon: RollerCoaster,
    iconColor: "text-yellow-700",
    openTime: "08:00 AM",
    closeTime: "10:00 PM",
    image: "/facilities3.png",
  },
  {
    id: 4,
    name: "Restaurant",
    description:
      "Indulge in delicious meals at our on-site restaurant, offering a variety of cuisines to satisfy every palate.",
    icon: Utensils,
    iconColor: "text-red-600",
    openTime: "07:00 AM",
    closeTime: "11:00 PM",
    image: "/facilities4.png",
  },
  {
    id: 5,
    name: "8-Ball Room",
    description:
      "Enjoy a game of 8-ball in our dedicated 8-Ball Room, perfect for both beginners and experienced players.",
    icon: CircleDot,
    iconColor: "text-black",
    openTime: "08:00 AM",
    closeTime: "10:00 PM",
    image: "/facilities5.png",
  },
];

export default facilitiesList;
