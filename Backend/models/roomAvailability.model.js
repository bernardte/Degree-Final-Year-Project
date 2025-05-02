import mongoose from "mongoose";

const roomAvailabilitySchema = mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  unavailableRooms: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "room",
    },
  ],
});

const RoomAvailability = mongoose.model(
  "roomAvailability",
  roomAvailabilitySchema
);
export default RoomAvailability;
