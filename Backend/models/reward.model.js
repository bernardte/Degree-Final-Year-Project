import mongoose from "mongoose";

const RewardSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    points: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active"
    },
    icon: {
        type: String,
        required: true,
    }
}, {timestamps: true})

const Reward = mongoose.model("reward", RewardSchema);

export default Reward;