import cloudinary from "../config/cloudinary.js";

export const uploadToCloudinary = async (file) => {

    console.log("file: ", file);
    try {
        const result = await cloudinary.uploader.upload(file.tempFilePath, {
            resource_type: "auto",
        })

        return result.secure_url;
    } catch (error) {
        console.log("Error in uploadCloudinary: ", error.message);
        throw new Error('Error in uploadToCloudinary');
    }
}
