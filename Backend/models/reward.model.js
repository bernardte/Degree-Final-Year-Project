import mongoose from "mongoose";

const RewardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    points: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    discountPercentage: {
      type: Number,
      min: 1,
      max: 100,
      default: null,
      validate: {
        validator: function (v) {
          //when icon === 'Percent' ，v cannot be null or undefined
          if (this.icon === "Percent") {
            return v != null;
          }
          // others icon not affected
          return true;
        },
        message: "discountPercentage is required when icon is 'Percent'",
      },
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    icon: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Reward = mongoose.model("reward", RewardSchema);

export default Reward;