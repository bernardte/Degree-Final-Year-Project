import cloudinary from "../config/cloudinary.js";
import Facility from "../models/facilities.model.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";

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

const deleteFacility = async (req, res) => {
    const { facilityId } = req.params;

    try {
        const facility = await Facility.findByIdAndDelete(facilityId);

        if (!facility) {
            return res.status(404).json({ error: "Facility not found" });
        }

        if (facility.image) {
            const imageId = facility.image.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(imageId);
        }

        res
          .status(200)
          .json({
            message: `Facility ${facility.facilitiesName} deleted successfully`,
          });
    } catch (error) {
        console.log("Error in deleteFacility: ", error.message);
        res.status(500).json({ error: error.message });
    }
};

const updateFacility = async (req, res) => {
  const { facilityId } = req.params;
  const { facilitiesName, description, openTime, closeTime } = req.body;
  const image = req.files?.image;
  try {
    const facility = await Facility.findById(facilityId);
    if (!facility) {
      return res.status(404).json({ error: "Facility not found" });
    }

    // Remove old image if new one is uploaded
    if (image && facility.image) {
      const imageId = facility.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imageId);
    }

    // Upload new image if provided
    if (image) {
      const imageUrl = await uploadToCloudinary(image); // path or buffer depending on your cloudinary helper
      facility.image = imageUrl; // imageUrl should include { url, public_id }
    }

    facility.facilitiesName = facilitiesName;
    facility.description = description;
    facility.openTime = openTime;
    facility.closeTime = closeTime;

    await facility.save();

    res.status(200).json({
      message: `Facility "${facility.facilitiesName}" updated successfully`,
      facility,
    });
  } catch (error) {
    console.error("Error in updateFacility:", error.message);
    res.status(500).json({ error: error.message });
  }
};

const createFacility = async (req, res) => {
  const { facilitiesName, description, openTime, closeTime } = req.body;
  const image = req.files?.image;
  console.log("image: ", image);
  console.log(req.body);

  try {
    if (!facilitiesName || !description || !openTime || !closeTime) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingFacility = await Facility.findOne({ facilitiesName });
    if (existingFacility) {
      return res.status(400).json({ error: "Facility already exists" });
    }

    const imageUrl = await uploadToCloudinary(image);

    const newFacility = new Facility({
      facilitiesName,
      description,
      openTime,
      closeTime,
      image: imageUrl,
    });

    await newFacility.save();

    res.status(201).json({
      message: `Facility "${newFacility.facilitiesName}" created successfully`,
      facility: newFacility,
    });
  } catch (error) {
    console.error("Error in createFacility:", error.message);
    res.status(500).json({ error: error.message });
  }
};

export default {
  getFacility,
  deleteFacility,
  updateFacility,
  createFacility,
};