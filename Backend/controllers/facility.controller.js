import Facility from "../models/facilities.model.js";

const getFacility = async (req, res) => {
    try {
        const facility = await Facility.find();
        
        if(!facility){
            return res.status(404).json({ error: "Facility not found" });
        }

        res.status(200).json(facility);
    } catch (error) {
        console.log("Error in getFacility: ", error.message);
    }
}

export default {
    getFacility,
}