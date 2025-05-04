import { ComponentType } from "react";

export interface User {
    [x: string]: any;
    id: string;
    name: string;
    username: string;
    email: string;
    role: string;
    profilePic: string;
    token: string;
};

export interface Room {
  filter: any;
  map(arg0: (room: any) => void): any;
  _id: string;
  roomNumber: string;
  roomName: string;
  roomType:
    | "double bed"
    | "balcony"
    | "single"
    | "double"
    | "sea view"
    | "deluxe"
    | "deluxe twin";
  description: string;
  roomDetails: string;
  pricePerNight: number;
  amenities: Amenity[];
  images: string;
  capacity: {
    adults: number;
    children?: number;
  };
  bookings: Bookings[];
  rating: number;
  reviews: Reviews[];
  createdAt: string;
  updatedAt: string;
}

export enum Amenity {
  Wifi = "wifi",
  Tv = "tv",
  Ac = "ac",
  Fridge = "fridge",
  Balcony = "balcony",
  Bathtub = "bathtub",
  Pool = "pool",
  Gym = "gym",
  Parking = "parking",
  Breakfast = "breakfast",
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
  status: "confirmed" | "pending" | "canceled" | "completed";
  paymentMedhod: "card" | "grabpay" | "fpx";
  paymentStatus: "paid" | "unpaid";
  specialRequests?: string;
  bookingReference: string;
  createdAt: Date;
  updatedAt: Date;
  qrCodeImageURL: string;
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
  image: string;
}