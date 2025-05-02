import qrcode from "qrcode";
import cloudinary from "../config/cloudinary.js";

const generateAndUploadQRCode = async (QRcodeData) => {
    try {
        const qrCodeImageURL = await qrcode.toDataURL(
          JSON.stringify(QRcodeData),
          {
            errorCorrectionLevel: "H",
          });

        if (qrCodeImageURL) {
          const result = await cloudinary.uploader.upload(qrCodeImageURL, {
            resource_type: "image",
          });

          console.log("cloudinary url: ", result.secure_url);

          return result.secure_url;
        }
    } catch (error) {
        console.log("Error in generateAndUploadQRcode: ", error.message);
    }
}

export default generateAndUploadQRCode
