import transporter from "../../config/nodemailer.js";
import dotenv from "dotenv";
import { generateAdminAccessCodeEmailTemplate } from "./generateAdminAccessCodeEmailTemplate.js";

dotenv.config();

export const sendAdminAccessCode = async (email, accessCode, hotelName) => {
    console.log("hotel name: ", hotelName)

    try {
    await transporter.sendMail({
      from: `"The Seraphine Hotel" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Admin Access Code",
      html: generateAdminAccessCodeEmailTemplate(accessCode, hotelName),
    });
  } catch (error) {
    console.log("Error in sendAdminAccessCode: ", error.message);
  }
};
