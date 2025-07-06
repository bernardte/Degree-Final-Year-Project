import {
  Bell,
  Bookmark,
  Calendar,
  Home,
  Star,
  User,
  Wrench,
} from "lucide-react";

export const notificationTypes = {
  booking: {
    icon: Calendar,
    color: "bg-blue-100 text-blue-600",
    borderColor: "border-blue-200",
  },
  system: {
    icon: Bell,
    color: "bg-purple-100 text-purple-600",
    borderColor: "border-purple-200",
  },
  room: {
    icon: Home,
    color: "bg-green-100 text-green-600",
    borderColor: "border-green-200",
  },
  user: {
    icon: User,
    color: "bg-indigo-100 text-indigo-600",
    borderColor: "border-indigo-200",
  },
  event: {
    icon: Star,
    color: "bg-yellow-100 text-yellow-600",
    borderColor: "border-yellow-200",
  },
  facility: {
    icon: Wrench,
    color: "bg-orange-100 text-orange-600",
    borderColor: "border-orange-200",
  },
  reward: {
    icon: Bookmark,
    color: "bg-pink-100 text-pink-600",
    borderColor: "border-pink-200",
  },
};
