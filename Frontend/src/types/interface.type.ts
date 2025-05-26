import { ComponentType } from "react";

export interface User {
    _id: string;
    name: string;
    username: string;
    email: string;
    role: string;
    profilePic: string ;
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
  images: string | File ;
  capacity: {
    adults: number;
    children?: number;
  };
  bedType: "King" | "Queen" | "Single" | "Double" | "Twin";
  bookings: Bookings[];
  rating: number;
  reviews: Reviews[];
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
  InRoomSafe = "in room_safe",
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
  status: string,
}