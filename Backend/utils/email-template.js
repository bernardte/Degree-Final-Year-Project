const BREAKFAST_PRICE = 30;
export const generateBookingEmailHTML = ({
  username,
  bookingReference,
  roomDetail, // this should be an array of room objects
  checkInDate,
  checkOutDate,
  breakfastIncluded,
  adults,
  children,
  totalPrice,
  qrCodeImageURL,
}) => {
  
  return `
    <body style="margin:0; padding:0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
      <!-- outer container -->
      <div style="max-width: 680px; margin: 20px auto; background: #ffffff; border-radius: 12px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
        <!-- top header -->
        <div style="height: 8px; background: linear-gradient(90deg, #0057a3 0%, #0081d6 100%);"></div>

        <!-- header -->
        <div style="padding: 40px 20px; text-align: center; background: #f8fafc; border-bottom: 1px solid #e2e8f0;">
          <img src="https://i.ibb.co/wh88Rcs2/Logo.png" alt="Hotel Logo" style="height: 300px; margin-bottom: 25px;">
          <h1 style="color: #1a365d; font-size: 28px; margin: 0; padding: 0;">
            Your Stay is Confirmed
          </h1>
          <p style="color: #718096; margin: 15px 0 0; font-size: 16px;">
            ${new Date(checkInDate).toLocaleDateString()} - ${new Date(
    checkOutDate
  ).toLocaleDateString()}
          </p>
        </div>

        <!-- main content -->
        <div style="padding: 30px;">
          <!-- user details -->
          <div style="margin-bottom: 30px; text-align: center;">
            <h2 style="color: #1a365d; font-size: 22px; margin: 0 0 15px;">
              Welcome, ${username}!
            </h2>
            <div style="color: #718096; font-size: 16px;">
              Booking Ref: ${bookingReference}
            </div>
          </div>

          <!-- key information -->
          <table style="width: 100%; margin: 25px 0; border-collapse: collapse;">
            <tr>
              <td style="padding: 15px; background: #f8fafc; border: 1px solid #e2e8f0; width: 33%;">
                <div style="color: #4a5568; font-size: 14px;">Check-In</div>
                <div style="color: #1a365d; font-size: 18px; font-weight: bold; margin-top: 5px;">
                  ${new Date(checkInDate).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              </td>
              <td style="padding: 15px; background: #f8fafc; border: 1px solid #e2e8f0; width: 33%;">
                <div style="color: #4a5568; font-size: 14px;">Nights</div>
                <div style="color: #1a365d; font-size: 18px; font-weight: bold; margin-top: 5px;">
                  ${Math.ceil(
                    (new Date(checkOutDate) - new Date(checkInDate)) /
                      (1000 * 3600 * 24)
                  )}
                </div>
              </td>
              <td style="padding: 15px; background: #f8fafc; border: 1px solid #e2e8f0; width: 33%;">
                <div style="color: #4a5568; font-size: 14px;">Check-Out</div>
                <div style="color: #1a365d; font-size: 18px; font-weight: bold; margin-top: 5px;">
                  ${new Date(checkOutDate).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              </td>
            </tr>
          </table>

          <!-- room details -->
          <div style="margin: 30px 0;">
            <h3 style="color: #1a365d; font-size: 18px; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; margin: 0 0 20px;">
              Room Details
            </h3>
            ${roomDetail
              .map(
                (room) => `
              <div style="margin-bottom: 20px; padding: 20px; background: #f8fafc; border-radius: 8px;">
                <div style="display: table; width: 100%;">
                  <div style="display: table-cell; width: 70%; vertical-align: top;">
                    <div style="font-weight: bold; color: #1a365d; font-size: 16px;">${
                      room.roomType
                    }</div>
                    <div style="color: #718096; font-size: 14px; margin: 8px 0;">
                      Room ${
                        room.roomNumber
                      } • ${adults} Adults • ${children} Children
                    </div>
                    <div style="color: ${
                      breakfastIncluded.length > 0 ? "#38a169" : "#e53e3e"
                    }; font-size: 14px;">
                      ${
                        breakfastIncluded.length > 0
                          ? "✓ Breakfast included"
                          : "No breakfast included"
                      }
                    </div>
                  </div>
                </div>
              </div>
            `
              )
              .join("")}
          </div>

          <!-- price details -->
          <div style="background: #f8fafc; padding: 25px; border-radius: 8px; text-align: center; margin: 30px 0;">
            <div style="color: #718096; font-size: 14px; margin-bottom: 10px;">
              Total Payment
            </div>
            <div style="color: #1a365d; font-size: 32px; font-weight: bold;">
              RM ${totalPrice}
            </div>
            <div style="color: #718096; font-size: 14px; margin-top: 10px;">
              Includes all taxes and fees
            </div>
          </div>

          <!-- QR Code -->
          <div style="text-align: center; margin: 40px 0;">
            <div style="display: inline-block; padding: 20px; background: #f8fafc; border-radius: 12px;">
              <img src="${qrCodeImageURL}" alt="QR Code" width="180" height="180" style="border-radius: 8px;">
              <div style="color: #718096; font-size: 14px; margin-top: 15px;">
                Present this QR code at check-in
              </div>
            </div>
          </div>

          <!-- contact us details -->
          <div style="border-top: 1px solid #e2e8f0; padding: 30px 0 0; margin-top: 30px;">
            <table style="width: 100%;">
              <tr>
                <td style="width: 50%; vertical-align: top;">
                  <div style="color: #4a5568; font-size: 14px; margin-bottom: 10px;">Need Help?</div>
                  <a href="mailto:support@example.com" style="color: #0057a3; text-decoration: none; font-size: 14px;">Contact Support →</a>
                </td>
                <td style="width: 50%; vertical-align: top; text-align: right;">
                  <div style="color: #4a5568; font-size: 14px; margin-bottom: 10px;">Hotel Address</div>
                  <div style="color: #718096; font-size: 14px;">
                    George Town, Penang, Malaysia
                  </div>
                </td>
              </tr>
            </table>
          </div>
        </div>

        <!-- footer -->
        <div style="background: #1a365d; padding: 20px; text-align: center; border-radius: 0 0 12px 12px;">
          <div style="color: #ffffff; font-size: 12px;">
            © ${new Date().getFullYear()} The Seraphine Hotel. All rights reserved.
          </div>
        </div>
      </div>
    </body>
  `;
};
