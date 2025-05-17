import dotenv from 'dotenv';
import transporter from '../config/nodemailer.js';
import { acceptedEmailTemplate } from './email-accept-request-template.js';
import { declinedEmailTemplate } from './email-reject-request-template.js';

dotenv.config();

const sendEventResponseEmail = async (user, isAccepted) => {
  const emailHtml = isAccepted
    ? acceptedEmailTemplate(user.fullname, user.eventDate, user.eventType)
    : declinedEmailTemplate(user.fullname, user.eventDate, user.eventType);

  const subject = isAccepted
    ? "Your Event Enquiry Has Been Accepted"
    : "Your Event Enquiry Has Been Declined";

  await transporter.sendMail({
    from:`"The Seraphine Hotel" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject,
    html: emailHtml,
  });
};

export default sendEventResponseEmail;