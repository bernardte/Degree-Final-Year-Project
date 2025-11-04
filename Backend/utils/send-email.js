import dotenv from 'dotenv';
import transporter from '../config/nodemailer.js';
import { generateBookingEmailHTML } from './email-template.js';

dotenv.config();

export const sendBookingConfirmationEmail = async (userEmail, bookingData) => {
    try {
        const mailOptions = {
          from: `"The Seraphine Hotel" <${process.env.EMAIL_USER}>`, 
          to: userEmail, 
          subject: "Booking Confirmation",
          html: generateBookingEmailHTML(bookingData),
        };
       await transporter.sendMail(mailOptions);
       console.log("Booking confirmation email sent to:", userEmail);


    } catch (error) {
        console.error('Error sending email:', error);
    }
}