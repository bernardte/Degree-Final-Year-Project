import cloudinary from "../config/cloudinary.js";
import Facility from "../models/facilities.model.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";
import User from "../models/user.model.js";
import notifyUsers from "../utils/notificationSender.js";

const getFacility = async (req, res) => {
  try {
    const facilities = await Facility.find({ isActivate: true });
    if(!facilities){
      return res.status(404).json({ message: "No facilities found" });
    }

    res.status(200).json(facilities);
  }catch(error){
    console.log("Error in getFacility: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

const getAdminPageFacility = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const skip = (page - 1) * limit;

  try {
    const [facility, totalCount] = await Promise.all([
      Facility.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
      Facility.countDocuments(),
    ]);

    if (!facility) {
      return res.status(404).json({ error: "Facility not found" });
    }

    res
      .status(200)
      .json({
        facility,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
      });
  } catch (error) {
    console.log("Error in getAdminPageFacility: ", error.message);
  }
};

const deleteFacility = async (req, res) => {
    const { facilityId } = req.params;
    const user = req.user;

    try {
        const facility = await Facility.findByIdAndDelete(facilityId);

        if (!facility) {
            return res.status(404).json({ error: "Facility not found" });
        }

        if (facility.image) {
            const imageId = facility.image.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(imageId);
        }

        const allAdmins = await User.find({
          role: { $in: ["admin", "superAdmin"] },
        });
        const adminIds = allAdmins.map((admin) => admin._id);
    
        //* notify all admins
        await notifyUsers(
          adminIds,
          `Facility ${facility.facilitiesName.toLowerCase()} has been deleted by ${user.name}`,
          "facility"
        );

        res.status(200).json({
          message: `Facility ${facility.facilitiesName} deleted successfully`,
        });
    } catch (error) {
        console.log("Error in deleteFacility: ", error.message);
        res.status(500).json({ error: error.message });
    }
};

const updateFacility = async (req, res) => {
  const { facilityId } = req.params;
  const { facilitiesName, description, openTime, closeTime, icon, iconColor, category } = req.body;
  const image = req.files?.image;
  const user = req.user;

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
      const imageUrl = await uploadToCloudinary(image); 
      facility.image = imageUrl; // imageUrl include { url, public_id }
    }

    facility.facilitiesName = facilitiesName;
    facility.description = description;
    facility.openTime = openTime;
    facility.closeTime = closeTime;
    facility.icon = icon;
    facility.iconColor = iconColor;
    facility.category = category

    await facility.save();

    const allAdmins = await User.find({
      role: { $in: ["admin", "superAdmin"] },
    });
    const adminIds = allAdmins.map((admin) => admin._id);

    console.log("new icon", icon)
    console.log("new icon color", iconColor)

    //* notify all admins
    await notifyUsers(
      adminIds,
      `facility ${facilitiesName} has been updated by ${user.name}`,
      "facility"
    );

    res.status(200).json({
      message: `Facility "${facility.facilitiesName}" updated successfully`,
      facility,
    });
  } catch (error) {
    console.error("Error in updateFacility:", error.message);
    res.status(500).json({ error: error.message });
  }
};

const updateFacilityStatus = async (req, res) => {
  const { facilityId } = req.params;
  const { isActivate } = req.body;
  try {
    const facility = await Facility.findById(facilityId).select("isActivate facilitiesName");
    if (!facility) {
      return res.status(404).json({ error: "Facility not found" });
    }
    facility.isActivate = isActivate;
    await facility.save();

    const allAdmins = await User.find({
      role: { $in: ["admin", "superAdmin"] },
    });
    const adminIds = allAdmins.map((admin) => admin._id);

    //* notify all admins
    await notifyUsers(
      adminIds,
      `facility ${facility.facilitiesName} has been update to ${isActivate === true ? "activate" : "deactivate"}`,
      "facility"
    );

    res.status(200).json({
      message: `Facility status updated successfully`,
      facility,
    });
  }catch(error){
    console.log("Error in updateFacilityStatus: ", error.message);
    res.status(500).json({ error: error.message });
  }
}

const createFacility = async (req, res) => {
  const { facilitiesName, description, openTime, closeTime, icon, iconColor, category } = req.body;
  const image = req.files?.image;
  const user = req.user;

  try {
    if (!facilitiesName || !description || !openTime || !closeTime || !icon || !iconColor || !category) {
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
      icon,
      iconColor,
      category
    });

    await newFacility.save();

    const allAdmins = await User.find({
      role: { $in: ["admin", "superAdmin"] },
    });
    const adminIds = allAdmins.map((admin) => admin._id);

    //* notify all admins
    await notifyUsers(
      adminIds,
      `New facility ${facilitiesName} has been created by ${user.name}`,
      "facility"
    );

    res.status(201).json({
      message: `Facility "${newFacility.facilitiesName}" created successfully`,
      facility: newFacility,
    });
  } catch (error) {
    console.error("Error in createFacility:", error.message);
    res.status(500).json({ error: error.message });
  }
};

const getCertainFacility = async (req, res) => {
  const { facilityId } = req.params
  try {
    const facility = await Facility.findById(facilityId);
    if (!facility) {
     return res.status(401).json({ error: "facility not found" });
    }
    res.status(200).json(facility);
  } catch (error) {
    console.error("Error in getCertainFacility:", error.message);
    res.status(500).json({ error: error.message });
  }
}


export default {
  getFacility,
  getAdminPageFacility,
  deleteFacility,
  updateFacility,
  updateFacilityStatus,
  createFacility,
  getCertainFacility,
};