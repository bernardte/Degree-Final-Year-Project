import { ComponentType } from "react";

export interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
  role: string;
  profilePic: string;
  loyaltyTier: string;
  totalSpent: number;
  token: string;
};

export interface Room {
  _id: string;
  roomNumber: string;
  roomName: string;
  roomType: string;
  description: string;
  roomDetails: string;
  pricePerNight: number;
  amenities: Amenity[];
  images: (string | File)[];
  capacity: {
    adults: number;
    children?: number;
  };
  bedType: "King" | "Queen" | "Single" | "Double" | "Twin";
  bookings: Bookings[];
  breakfastIncluded: boolean;
  rating: number;
  reviews: Reviews[];
  isActivate: boolean;
  scheduledDeactivationDate: Date;
  createdAt: string;
  updatedAt: string;
}

export enum Amenity {
  Wifi = "wifi",
  Tv = "tv",
  AirConditioning = "air conditioning",
  MiniFridge = "mini fridge",
  PrivateBathroom = "private bathroom",
  RoomService = "room service",
  InRoomSafe = "in room safe",
  Sofa = "sofa",
  DeskLamp = "desk lamp",
}

export interface Reviews {
    rating: number;
    comment: string;
    createdAt: string;
    username: String;
}

export interface Bookings {
  title: any;
  _id: string;
  bookingCreatedByUser: User;
  contactName: string;
  contactEmail: string;
  contactNumber: string;
  room: Room;
  roomType: string;
  startDate: Date;
  endDate: Date;
  totalGuests: {
    adults: number;
    children: number;
  };
  totalPrice: number;
  BookingDate: Date;
  status: "confirmed" | "pending" | "cancelled" | "completed";
  paymentMethod: "card" | "grabpay" | "fpx";
  paymentStatus: "paid" | "unpaid" | "refund";
  specialRequests?: string;
  bookingReference: string;
  createdAt: Date;
  updatedAt: Date;
  qrCodeImageURL: string;
  userType: string;
}

export interface CancelBookingRequest {
  _id: string;
  bookingId: string;
  bookingReference: string;
  email: string;
  userId: User;
  requestedAt: Date;
  status: "pending" | "approved" | "decline";
  checkInDate: Date;
  processedBy: User;
  processedAt: Date;
}

export interface BookingSession {
  _id: string;
  sessionId: string;
  userId: User;
  roomId: string[];
  checkInDate: Date;
  checkOutDate: Date;
  customerName: string;
  totalGuest: {
    adults: number;
    children: number;
  };
  breakfastIncluded: number;
  isBreakfastIncluded: boolean;
  paymentIntentId: string; // Added this property
  paymentMethod: string;
  paymentStatus: string;
  totalPrice: number;
  userType: "user" | "guest";
  contactName: string;
  contactEmail: string;
  contactNumber: number;
  additionalDetails: string;
  roomName: string;
  createdAt: Date;
}

export interface RoomAvailability {
    _id: string;
    date: Date;
    unAvailableRooms: Room[]
}

export interface Facility {
  _id: string;
  facilitiesName: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  iconColor: string;
  openTime: string;
  closeTime: string;
  isActivate: boolean;
  image: string | File;
}

export interface Statistic {
  totalBooking: number;
  totalUsers: number;
  totalRoom: number;
  totalRoomAvailable: number;
  totalRevenue: number;
  totalRefundAmount: number;
}

export interface Event {
  _id: string,
  fullname: string,
  phoneNumber: string,
  email: string,
  eventType: string,
  eventDate: string,
  totalGuests: number,
  additionalInfo?: string,
  createdAt: Date,
  updatedAt: Date,
  status: string,
}

// Mock data for demonstration
export interface RewardSettings {
  bookingRewardPoints: number,
  earningRatio: number,
  minRedeemPoints: number,
  maxRedeemPoints: number,
  rewardProgramEnabled: boolean,
  tierMultipliers: {
    bronze: number,
    silver: number,
    gold: number,
    platinum: number,
  };
};

export interface RewardHistories{
  _id: string,
  user: User,
  bookingId: Bookings["_id"][],
  bookingReference: string,
  points: number,
  description: string,
  type: "redeem" | "earn"
  source: "booking" | "redemption" | "others"
  createdAt: Date
}

export interface Reward {
  _id: string,
  name: string,
  description: string,
  points: number,
  category: string,
  status: "active" | "inactive",
  icon: string
}

export interface ClaimedReward {
  _id: string;
  user: User;
  reward: Reward;
  redeemedAt: Date;
  rewardCode: string;
  category: string;
  expiredAt: Date;
  status: "active" | "used" | "expired";
  code: string;
  claimedBy: User;
}
export interface Notification {
  _id: string,
  userId: User["_id"],
  message: string,
  type: "reward" | "booking" | "user" | "room" | "facility" | "event" | "system",
  isRead: boolean;
  createdAt: Date
  updatedAt: Date
}

export interface Conversation {
  _id: string,
  userId: string,
  userCode: string,
  mode: "chatbot"| "human",
  status: "open" | "closed",
  bookingId: Bookings["_id"],
  roomType: string,
  unreadCount: number,
  lastMessage: string,
  lastMessageAt: Date,
  isLock: boolean,//? only one admin can take current conversation
  lockedBy: User,
  visibleToAdmin: User["_id"],//? visible for admin which have the authorization to view
}

export interface Message {
  _id: string,
  conversationId: Conversation["_id"],
  senderType: "user" | "guest"| "admin" | "superAdmin" | "bot",
  senderId: string,
  content: string,
  isRead: boolean,
  image: string,
  createdAt: Date,
}