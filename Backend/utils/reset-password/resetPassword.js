import transporter from "../../config/nodemailer.js"
import dotenv from "dotenv";
import { resetPasswordEmailTemplate } from "./resetPasswordEmailTemplate.js";
dotenv.config();

export const sendResetPasswordEmail = async (email, resetUrl, hotelDetail) => {
    try {
        await transporter.sendMail({
          from: `"The Seraphine Hotel" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: "Password Reset Request",
          html: resetPasswordEmailTemplate(resetUrl, hotelDetail),
        });
       
    } catch (error) {
        console.log('Error in sendResetPasswordEmail: ', error.message);
    }
};