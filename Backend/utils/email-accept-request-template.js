export const acceptedEmailTemplate = (name, eventDate, eventType) => `
  <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <div style="background-color: #22c55e; color: white; padding: 15px; border-radius: 6px 6px 0 0; text-align: center; font-size: 20px; font-weight: bold;">
        Event Enquiry Accepted
      </div>
      <div style="margin-top: 20px; font-size: 16px; color: #333333;">
        <p>Dear ${name},</p>
        <p>We are pleased to inform you that your enquiry for the <strong>${eventType}</strong> on <strong>${eventDate}</strong> has been <span style="color:green;"><strong>ACCEPTED</strong></span>.</p>
        <p>Our team will contact you shortly with further details.</p>
        <p>Thank you for choosing our services!</p>
      </div>
      <div style="margin-top: 30px; font-size: 14px; color: #888888; text-align: center;">
        &copy; ${new Date().getFullYear()} Hotel Booking System — All rights reserved.
      </div>
    </div>
  </div>
`;
