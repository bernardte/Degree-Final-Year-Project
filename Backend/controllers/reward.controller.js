import Reward from "../models/reward.model.js";

const addReward = async (req, res) => {
    const reward = req.body;
    console.log(reward);
    if(!reward){
        return res.status(400).json({error: "All field are required"});
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
        const existingReward = await Reward.findOne({ name });
        if (existingReward) {
          return res.status(400).json({ error: "Reward already exists" });
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
        res.status(201).json(newReward);
    } catch (error) {
        console.log("Error in addReward: ", error.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }

}

const fetchRewardList = async (req, res) => {
    try {
        const reward = await Reward.find().sort({ createdAt: -1 });
        if(!reward){
            return res.status(404).json({ error: "No rewards found" });
        }
        res.status(200).json(reward);
    } catch (error) {
        console.log("Error in addReward: ", error.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

const deleteReward = async (req, res) => {
    const { rewardId } = req.params
    try{
        const reward = await Reward.deleteOne({_id: rewardId});
        if(!reward){
            return res.status(404).json({ error: "Reward not found" });
        }
        res.status(200).json({message: "Reward deleted successfully"});
    }catch(error){
        console.log("Error in deleteReward: ", error.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

const editReward = async (req, res) => {
    const { rewardId } = req.params;
    const { name, description, points, category, status, icon } = req.body;
    try{
        const reward = await Reward.findById({ _id: rewardId });
        if(!reward){
            res.status(404).json({ error: "Reward Not Found"});
        }
        reward.name = name || reward.name;
        reward.description = description || reward.description;
        reward.points = points || reward.points;
        reward.category = category || reward.category;
        reward.status = status || reward.status;
        reward.icon = icon || reward.icon;
        await reward.save();
        res.status(200).json(reward);
    }catch(error){
        console.log("Error in editReward: ", error.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export default {
    addReward,
    deleteReward,
    fetchRewardList,
    editReward
}