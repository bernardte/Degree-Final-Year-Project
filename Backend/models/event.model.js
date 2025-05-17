import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    fullname: {
      type: String,
      require: true,
    },
    phoneNumber: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      requrie: true,
    },
    eventType: {
      type: String,
      enum: ["Wedding Ceremony", "Corporate Party", "Business Meeting"],
      require: true,
    },
    eventDate: {
      type: Date,
      require: true,
    },
    additionalInfo: {
      type: String,
      require: false,
    },
    totalGuests: {
      type: Number,
      require: true,
    },
    status: {
      type: String,
      enum: ["pending", "Accept", "Decline"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Event = mongoose.model("event", eventSchema);

export default Event;   