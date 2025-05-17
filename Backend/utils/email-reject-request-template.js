export const declinedEmailTemplate = (name, eventDate, eventType) => `
  <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <div style="background-color: #ef4444; color: white; padding: 15px; border-radius: 6px 6px 0 0; text-align: center; font-size: 20px; font-weight: bold;">
        Event Enquiry Declined
      </div>
      <div style="margin-top: 20px; font-size: 16px; color: #333333;">
        <p>Dear ${name},</p>
        <p>We regret to inform you that your enquiry for the <strong>${eventType}</strong> on <strong>${eventDate}</strong> has been <span style="color:red;"><strong>DECLINED</strong></span>.</p>
        <p>We apologize for the inconvenience and hope to serve you in the future.</p>
      </div>
      <div style="margin-top: 30px; font-size: 14px; color: #888888; text-align: center;">
        &copy; ${new Date().getFullYear()} Hotel Booking System — All rights reserved.
      </div>
    </div>
  </div>
`;
