import mongoose from "mongoose";

const usersSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        enum: ["admin", "user", "manager"],
        default: "user"
    },
    isOTPVerified: {
        type: Boolean,
        default: false
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    profilePic: {
        type: String,
        default: "",
        required: false
    }
}, {timestamps: true});

const User = mongoose.model("user", usersSchema);

export default User;