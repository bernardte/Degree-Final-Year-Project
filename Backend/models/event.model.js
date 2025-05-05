import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: false
        },
        fullname: {
            type: string,
            require: true
        },
        phoneNumber: {
            type: string,
            require: true,
        },
        email: {
            type: string,
            requrie: true,
        },
        eventType: {
            type: string,
            enum: ["wedding","party", "meeting"],
            require: true,
        },
        eventDate: {
            type: Date,
            require: true
        },
        additionalInfo: {
            type: string,
            require: false
        }   
    }
)

const Event = mongoose.model("event", eventSchema);

export default Event;   