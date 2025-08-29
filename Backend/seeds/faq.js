// scripts/seedFacilities.ts
import mongoose from "mongoose";
import FAQ from "../models/faq.model.js";
import dotenv from "dotenv";
dotenv.config();

const faqList = [
  {
    question: "What are the opening hours of the swimming pool?",
    answer: "The swimming pool is open from 08:00 AM to 10:00 PM daily.",
    intent: "faq",
    category: "General Info",
    question_embedding: [],
  },
  {
    question: "I'd like to book a room for two nights.",
    answer: "Sure! Please provide your preferred dates and room type.",
    intent: "booking",
    category: "Booking",
    question_embedding: [],
  },
  {
    question: "Can I cancel my reservation?",
    answer:
      "Yes, please let us know your booking details to proceed with cancellation.",
    intent: "cancel",
    category: "Cancellation",
    question_embedding: [],
  },
  {
    question: "Hi there!",
    answer: "Hello! How can I assist you today?",
    intent: "greeting",
    category: "Greeting",
    question_embedding: [],
  },
  {
    question: "Tell me a joke.",
    answer:
      "Why did the scarecrow win an award? Because he was outstanding in his field!",
    intent: "chat",
    category: "Chit Chat",
    question_embedding: [],
  },
  {
    question: "Is there free Wi-Fi in the rooms?",
    answer: "Yes, free Wi-Fi is available in all rooms and public areas.",
    intent: "faq",
    category: "General Info",
    question_embedding: [],
  },
  {
    question: "My room is too cold.",
    answer:
      "I’m sorry about that. We’ll send maintenance to adjust the temperature right away.",
    intent: "complaint",
    category: "Complaints",
    question_embedding: [],
  },
  {
    question: "Can I check in early?",
    answer:
      "Early check-in is subject to availability. Please contact the front desk.",
    intent: "faq",
    category: "General Info",
    question_embedding: [],
  },
  {
    question: "Can I change my booking?",
    answer: "Yes, please provide your reservation number and the new details.",
    intent: "change_booking",
    category: "Booking Change",
    question_embedding: [],
  },
  {
    question: "Goodbye and thank you!",
    answer: "You're welcome! Have a great day!",
    intent: "goodbye",
    category: "Goodbye",
    question_embedding: [],
  },
  {
    question: "Do you offer airport shuttle service?",
    answer:
      "Yes, we offer airport shuttle service for an additional charge, and pay during check-in.",
    intent: "faq",
    category: "General Info",
    question_embedding: [],
  },
  {
    question: "Are pets allowed in the hotel?",
    answer: "Unfortunately, pets are not allowed in the hotel premises.",
    intent: "faq",
    category: "General Info",
    question_embedding: [],
  },
  {
    question: "Please reserve a spa session for me.",
    answer:
      "Sure, your spa session has been reserved. Enjoy your relaxation time!",
    intent: "booking",
    category: "Booking",
    question_embedding: [],
  },
  {
    question: "Can I request a late checkout?",
    answer:
      "Late checkout is available upon request and subject to availability.",
    intent: "faq",
    category: "General Info",
    question_embedding: [],
  },
  {
    question: "Can you cancel my dinner reservation?",
    answer: "Yes, your dinner reservation has been canceled.",
    intent: "cancel",
    category: "Cancellation",
    question_embedding: [],
  },
  {
    question: "I’m bored. What can we talk about?",
    answer: "We can chat about travel, food, or anything you're interested in!",
    intent: "chat",
    category: "Chit Chat",
    question_embedding: [],
  },
  {
    question: "What is the cancellation policy?",
    answer:
      "Cancellations must be made at least 24 hours in advance to avoid charges.",
    intent: "faq",
    category: "General Info",
    question_embedding: [],
  },
  {
    question: "Thanks, see you later.",
    answer: "Take care! Looking forward to seeing you again.",
    intent: "goodbye",
    category: "Goodbye",
    question_embedding: [],
  },
  {
    question: "The service was terrible.",
    answer: "I'm very sorry to hear that. We'll look into this immediately.",
    intent: "complaint",
    category: "Complaints",
    question_embedding: [],
  },
  {
    question: "Can you help me with my luggage?",
    answer: "Of course! Someone from our staff will assist you shortly.",
    intent: "complaint",
    category: "Complaints",
    question_embedding: [],
  },
  {
    question: "Book a room new room for me.",
    answer:
      "Of course! Someone from our staff will book a room for you shortly.",
    intent: "booking",
    category: "Booking",
    question_embedding: [],
  },
  {
    question: "What are the opening hours of the swimming pool?",
    answer: "The swimming pool is open from 08:00 AM to 10:00 PM daily.",
    intent: "faq",
    category: "General Info",
    question_embedding: [],
  },
  {
    question: "Is there free Wi-Fi in the rooms?",
    answer: "Yes, free Wi-Fi is available in all rooms and public areas.",
    intent: "faq",
    category: "General Info",
    question_embedding: [],
  },
  {
    question: "Can I check in early?",
    answer:
      "Early check-in is subject to availability. Please contact the front desk.",
    intent: "faq",
    category: "General Info",
    question_embedding: [],
  },
  {
    question: "Do you offer airport shuttle service?",
    answer:
      "Yes, we offer airport shuttle service for an additional charge, and pay during check-in.",
    intent: "faq",
    category: "General Info",
    question_embedding: [],
  },
  {
    question: "Are pets allowed in the hotel?",
    answer: "Unfortunately, pets are not allowed in the hotel premises.",
    intent: "faq",
    category: "General Info",
    question_embedding: [],
  },
  {
    question: "Can I request a late checkout?",
    answer:
      "Late checkout is available upon request and subject to availability.",
    intent: "faq",
    category: "General Info",
    question_embedding: [],
  },
  {
    question: "What is the cancellation policy?",
    answer:
      "Cancellations must be made at least 24 hours in advance to avoid charges.",
    intent: "faq",
    category: "General Info",
    question_embedding: [],
  },
  {
    question: "Is breakfast included in the room rate?",
    answer:
      "Yes, a complimentary breakfast is included with all room bookings.",
    intent: "faq",
    category: "General Info",
    question_embedding: [],
  },
  {
    question: "Do you have parking facilities?",
    answer: "Yes, we provide free parking for all hotel guests.",
    intent: "faq",
    category: "General Info",
    question_embedding: [],
  },
  {
    question: "Do you have a gym?",
    answer: "Yes, our fitness center is open 24/7 for all guests.",
    intent: "faq",
    category: "General Info",
    question_embedding: [],
  },
  {
    question: "Is room service available?",
    answer: "Yes, 24-hour room service is available.",
    intent: "faq",
    category: "General Info",
    question_embedding: [],
  },
  {
    question: "Do you offer laundry service?",
    answer: "Yes, we provide same-day laundry and dry-cleaning service.",
    intent: "faq",
    category: "General Info",
    question_embedding: [],
  },
  {
    question: "Do the rooms have air conditioning?",
    answer: "Yes, all rooms are equipped with air conditioning.",
    intent: "faq",
    category: "General Info",
    question_embedding: [],
  },
  {
    question: "Can I store my luggage after checkout?",
    answer: "Yes, we provide complimentary luggage storage for guests.",
    intent: "faq",
    category: "General Info",
    question_embedding: [],
  },

  // --- Booking ---
  {
    question: "I'd like to book a room for two nights.",
    answer: "Sure! Please provide your preferred dates and room type.",
    intent: "booking",
    category: "Booking",
    question_embedding: [],
  },
  {
    question: "Please reserve a spa session for me.",
    answer:
      "Sure, your spa session has been reserved. Enjoy your relaxation time!",
    intent: "booking",
    category: "Booking",
    question_embedding: [],
  },
  {
    question: "Book a room new room for me.",
    answer:
      "Of course! Someone from our staff will book a room for you shortly.",
    intent: "booking",
    category: "Booking",
    question_embedding: [],
  },
  {
    question: "I want to book a table at the restaurant.",
    answer: "Of course! Please provide the time and number of guests.",
    intent: "booking",
    category: "Booking",
    question_embedding: [],
  },
  {
    question: "Can you book me a taxi to the airport?",
    answer:
      "Yes, we will arrange a taxi for you. Please confirm your departure time.",
    intent: "booking",
    category: "Booking",
    question_embedding: [],
  },

  // --- Change Booking ---
  {
    question: "Can I change my booking?",
    answer: "Yes, please provide your reservation number and the new details.",
    intent: "change_booking",
    category: "Booking Change",
    question_embedding: [],
  },
  {
    question: "I need to extend my stay by one night.",
    answer: "Certainly! Let me update your reservation for an extra night.",
    intent: "change_booking",
    category: "Booking Change",
    question_embedding: [],
  },
  {
    question: "Can I upgrade my room to a suite?",
    answer:
      "Yes, suite upgrades are available for an additional fee. Would you like me to proceed?",
    intent: "change_booking",
    category: "Booking Change",
    question_embedding: [],
  },

  // --- Cancellation ---
  {
    question: "Can I cancel my reservation?",
    answer:
      "Yes, please let us know your booking details to proceed with cancellation.",
    intent: "cancel",
    category: "Cancellation",
    question_embedding: [],
  },
  {
    question: "Can you cancel my dinner reservation?",
    answer: "Yes, your dinner reservation has been canceled.",
    intent: "cancel",
    category: "Cancellation",
    question_embedding: [],
  },
  {
    question: "I need to cancel my spa appointment.",
    answer: "Sure, your spa appointment has been canceled.",
    intent: "cancel",
    category: "Cancellation",
    question_embedding: [],
  },

  // --- Complaints ---
  {
    question: "My room is too cold.",
    answer:
      "I’m sorry about that. We’ll send maintenance to adjust the temperature right away.",
    intent: "complaint",
    category: "Complaints",
    question_embedding: [],
  },
  {
    question: "The service was terrible.",
    answer: "I'm very sorry to hear that. We'll look into this immediately.",
    intent: "complaint",
    category: "Complaints",
    question_embedding: [],
  },
  {
    question: "Can you help me with my luggage?",
    answer: "Of course! Someone from our staff will assist you shortly.",
    intent: "complaint",
    category: "Complaints",
    question_embedding: [],
  },
  {
    question: "There is too much noise in my room.",
    answer:
      "I apologize for the inconvenience. We can move you to a quieter room right away.",
    intent: "complaint",
    category: "Complaints",
    question_embedding: [],
  },
  {
    question: "The Wi-Fi is not working.",
    answer:
      "I’m sorry to hear that. We will reset the router and assist you immediately.",
    intent: "complaint",
    category: "Complaints",
    question_embedding: [],
  },

  // --- Greeting ---
  {
    question: "Hi there!",
    answer: "Hello! How can I assist you today?",
    intent: "greeting",
    category: "Greeting",
    question_embedding: [],
  },
  {
    question: "Good morning!",
    answer: "Good morning! I hope you have a pleasant stay with us.",
    intent: "greeting",
    category: "Greeting",
    question_embedding: [],
  },
  {
    question: "Hey, how are you?",
    answer: "I’m doing great, thank you! How can I assist you today?",
    intent: "greeting",
    category: "Greeting",
    question_embedding: [],
  },

  // --- Goodbye ---
  {
    question: "Goodbye and thank you!",
    answer: "You're welcome! Have a great day!",
    intent: "goodbye",
    category: "Goodbye",
    question_embedding: [],
  },
  {
    question: "Thanks, see you later.",
    answer: "Take care! Looking forward to seeing you again.",
    intent: "goodbye",
    category: "Goodbye",
    question_embedding: [],
  },
  {
    question: "Bye for now.",
    answer: "Goodbye! Have a wonderful day.",
    intent: "goodbye",
    category: "Goodbye",
    question_embedding: [],
  },

  // --- Chat ---
  {
    question: "Tell me a joke.",
    answer:
      "Why did the scarecrow win an award? Because he was outstanding in his field!",
    intent: "chat",
    category: "Chit Chat",
    question_embedding: [],
  },
  {
    question: "I’m bored. What can we talk about?",
    answer: "We can chat about travel, food, or anything you're interested in!",
    intent: "chat",
    category: "Chit Chat",
    question_embedding: [],
  },
  {
    question: "What's the weather like?",
    answer:
      "I can’t provide live weather updates, but it’s always cozy inside our hotel!",
    intent: "chat",
    category: "Chit Chat",
    question_embedding: [],
  },
  {
    question: "Tell me something interesting.",
    answer:
      "Did you know our hotel was built over 50 years ago and still retains its original charm?",
    intent: "chat",
    category: "Chit Chat",
    question_embedding: [],
  },
  {
    question: "Do you like music?",
    answer:
      "Yes! Many of our guests enjoy live music at the hotel lounge every Friday night.",
    intent: "chat",
    category: "Chit Chat",
    question_embedding: [],
  },
];

const seedDatabase = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("Connected to MongoDB");

    await FAQ.deleteMany({});
    await FAQ.insertMany(faqList);

    console.log("FAQ seeded successfully!");
  } catch (error) {
    console.error("Error seeding FAQ:", error.message);
  } finally {
    mongoose.connection.close();
  }
};

//! to run seed, use this line of code node seeds/faq.js

seedDatabase();
