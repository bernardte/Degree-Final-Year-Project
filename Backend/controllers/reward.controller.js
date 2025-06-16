import Reward from "../models/reward.model.js";

const addReward = async (req, res) => {
    const { reward } = req.body;
    if(!reward){
        return res.status(400).json({message: "All field are required"});
    }

    const {
        name,
        description,
        points,
        category,
        status,
        icon
    } = reward;

    try {
        const Reward = await Reward.find({ name });
        if (Reward) {
            return res.status(400).json({ message: "Reward already exists" });
        }
        const newReward = new Reward({
          name,
          description,
          points,
          category,
          status,
          icon
        });

        await newReward.save();
        res.status(201).json({ message: "Reward created successfully", newReward });
    } catch (error) {
        console.log("Error in addReward: ", error.message);
        return res.status(500).json({message: "Internal Server Error"});
    }

}

const fetchRewardList = async (req, res) => {
    try {
        
    } catch (error) {
        console.log("Error in addReward: ", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export default {
    addReward,
    fetchRewardList
}