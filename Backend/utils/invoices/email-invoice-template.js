export const generateBookingEmailHTML = ({
  userEmail,
  username,
  bookingReference,
  roomDetail, // this should be an array of room objects
  checkInDate,
  checkOutDate,
  breakfastIncluded,
  adults,
  children,
  totalPrice,
  paymentStatus,
  paymentIntentId,
  paymentMethod,
  reward,
  loyaltyTier,
  invoiceNumber,
  hotelDetail
}) => {
  console.log("your total price: ", totalPrice);
  console.log("room details: ", roomDetail);
  const totalRoom = roomDetail.length;
  const nights = Math.ceil(
    (new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 3600 * 24)
  );
  const totalBreakfastPrice = breakfastIncluded * 30.0 * nights;
  const totalRoomPrice =
    roomDetail.reduce((acc, rm) => acc + rm.pricePerNight, 0) || 0;
  const subtotal = totalRoomPrice * nights

  return `
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px;">
    <div id="invoice" style="max-width: 900px; margin: 0 auto; background-color: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); padding: 30px; position: relative;">
        <!-- Watermark -->
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); font-size: 120px; font-weight: bold; color: rgba(66, 153, 225, 0.08); z-index: 0; pointer-events: none; user-select: none;">
            ${hotelDetail?.name}
        </div>
        
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; border-bottom: 1px solid #e2e8f0; padding-bottom: 20px; position: relative; z-index: 1;">
            <div style="display: flex; align-items: center;">
                <div style="background-color: #dbeafe; border-radius: 12px; padding: 12px; margin-right: 15px;">
                    <i class="fas fa-hotel" style="font-size: 28px; color: #2563eb;"></i>
                </div>
                <div>
                    <h1 style="font-size: 28px; font-weight: 700; color: #1e293b; margin: 0;">${hotelDetail?.name}</h1>
                    <p style="font-size: 18px; font-weight: 600; color: #2563eb; margin: 5px 0 0 0;">Reservation Invoice</p>
                </div>
            </div>
            <div>
                <div style="display: flex; align-items: center; font-size: 18px; font-weight: 700; color: #1e293b; margin-bottom: 10px;">
                    <i class="fas fa-hotel" style="color: #2563eb; margin-right: 10px;"></i>
                    Invoice #: <span id="invoiceNumber" style="margin-left: 5px;">${invoiceNumber}</span>
                </div>
                <div style="margin-bottom: 10px;">
                    <span id="paymentStatus" style="background-color: #c6f6d5; color: #22543d; border-radius: 9999px; padding: 4px 12px; font-size: 14px; font-weight: 600; text-transform: capitalize;">
                        <i class="fas fa-check-circle" style="margin-right: 5px;"></i>${paymentStatus}
                    </span>
                </div>
                <div style="display: flex; align-items: center; font-size: 14px; color: #4a5568;">
                    <i class="far fa-calendar-alt" style="margin-right: 8px; color: #718096;"></i>
                    <span style="font-weight: 500;">Issued On:</span>
                    <span style="margin-left: 5px;" id="invoiceDate">${new Date().toLocaleDateString(
                      "en-US",
                      {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      }
                    )}</span>
                </div>
            </div>
        </div>
        
        <!-- Hotel & Guest Info -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; position: relative; z-index: 1;">
            <!-- Hotel Information -->
            <div style="border-radius: 12px; border: 1px solid #dbeafe; background: linear-gradient(to bottom right, #dbeafe, #cffafe); padding: 20px;">
                <div style="display: flex; align-items: center; margin-bottom: 15px;">
                    <i class="fas fa-hotel" style="font-size: 18px; color: #2563eb; margin-right: 10px;"></i>
                    <h3 style="font-size: 18px; font-weight: 600; color: #1e293b; margin: 0;">Hotel Information</h3>
                </div>
                <p style="font-weight: 700; color: #1e293b; margin: 0 0 10px 0;">${hotelDetail?.name}</p>
                <div style="display: flex; align-items: flex-start; color: #4a5568; margin-bottom: 8px;">
                    <i class="fas fa-map-marker-alt" style="margin-top: 4px; margin-right: 10px; color: #718096;"></i>
                    <span>${hotelDetail?.address}</span>
                </div>
                <div style="display: flex; align-items: center; color: #4a5568; margin-bottom: 8px;">
                    <i class="fas fa-phone-alt" style="margin-right: 10px; color: #718096;"></i>
                    <span>${hotelDetail?.phone}</span>
                </div>
                <div style="display: flex; align-items: center; color: #4a5568; margin-bottom: 8px;">
                    <i class="fas fa-envelope" style="margin-right: 10px; color: #718096;"></i>
                    <span>${hotelDetail?.email}</span>
                </div>
            </div>
            
            <!-- Guest Information -->
            <div style="border-radius: 12px; border: 1px solid #b2f5ea; background: linear-gradient(to bottom right, #ccfbf1, #c6f6d5); padding: 20px;">
                <div style="display: flex; align-items: center; margin-bottom: 15px;">
                    <i class="fas fa-user" style="font-size: 18px; color: #0d9488; margin-right: 10px;"></i>
                    <h3 style="font-size: 18px; font-weight: 600; color: #1e293b; margin: 0;">Guest Information</h3>
                </div>
                <p id="username" style="font-weight: 700; color: #1e293b; margin: 0 0 10px 0;">${username}</p>
                <div style="display: flex; align-items: center; color: #4a5568; margin-bottom: 8px;">
                    <i class="fas fa-envelope" style="margin-right: 10px; color: #718096;"></i>
                    <span id="useremail">${userEmail}</span>
                </div>
                <div style="display: flex; align-items: center; color: #4a5568; margin-bottom: 8px;">
                    <i class="fas fa-gift" style="margin-right: 10px; color: #718096;"></i>
                    <span>Loyalty Member: <span id="loyaltyTier" style="text-transform: capitalize;">${loyaltyTier}</span></span>
                </div>
            </div>
        </div>
        
        <!-- Booking Details -->
        <div style="border-radius: 12px; border: 1px solid #b2f5ea; background: linear-gradient(to bottom right, #ccfbf1, #d1fae5); padding: 20px; margin-bottom: 30px; position: relative; z-index: 1;">
            <div style="display: flex; align-items: center; margin-bottom: 15px;">
                <i class="far fa-calendar-alt" style="font-size: 18px; color: #0d9488; margin-right: 10px;"></i>
                <h3 style="font-size: 18px; font-weight: 600; color: #1e293b; margin: 0;">Booking Details</h3>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 20px;">
                <div>
                    <p style="font-size: 14px; color: #4a5568; margin: 0 0 5px 0;">Booking Reference</p>
                    <p id="bookingReference" style="font-weight: 500; color: #1e293b; margin: 0;">${bookingReference}</p>
                </div>
                <div>
                    <p style="font-size: 14px; color: #4a5568; margin: 0 0 5px 0;">Check-in Date</p>
                    <p style="display: flex; align-items: center; font-weight: 500; color: #1e293b; margin: 0;">
                        <i class="far fa-calendar-alt" style="color: #0d9488; margin-right: 8px;"></i>
                        <span id="checkInDate">${new Date(
                          checkInDate
                        ).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}</span>
                    </p>
                </div>
                <div>
                    <p style="font-size: 14px; color: #4a5568; margin: 0 0 5px 0;">Check-out Date</p>
                    <p style="display: flex; align-items: center; font-weight: 500; color: #1e293b; margin: 0;">
                        <i class="far fa-calendar-alt" style="color: #0d9488; margin-right: 8px;"></i>
                        <span id="checkOutDate">${new Date(
                          checkOutDate
                        ).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}</span>
                    </p>
                </div>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px;">
                <div>
                    <p style="font-size: 14px; color: #4a5568; margin: 0 0 5px 0;">Nights</p>
                    <p id="nights" style="font-weight: 500; color: #1e293b; margin: 0;">${nights}</p>
                </div>
                <div>
                    <p style="font-size: 14px; color: #4a5568; margin: 0 0 5px 0;">Room Type</p>
                    <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                        ${roomDetail.map(
                          (room) => `
                            <span style="background-color: #ccfbf1; color: #0d9488; border-radius: 9999px; padding: 4px 12px; font-size: 13px; font-weight: 500; text-transform: capitalize;">
                                <i class="fas fa-bed" style="margin-right: 5px;"></i> ${room.roomType} 
                            </span>
                            `
                        )}
                    </div>
                </div>
                <div>
                    <p style="font-size: 14px; color: #4a5568; margin: 0 0 5px 0;">Guests</p>
                    <p style="font-weight: 500; color: #1e293b; margin: 0;">
                        <span id="adults">${adults}</span> Adults, 
                        <span id="children">${children}</span> Children
                    </p>
                </div>
                <div>
                    <p style="font-size: 14px; color: #4a5568; margin: 0 0 5px 0;">Rooms</p>
                    <p style="font-weight: 500; color: #1e293b; margin: 0;">2</p>
                </div>
            </div>
        </div>
        
        <!-- Charges Summary -->
        <div style="margin-bottom: 30px; position: relative; z-index: 1;">
            <div style="display: flex; align-items: center; margin-bottom: 15px;">
                <i class="far fa-credit-card" style="font-size: 18px; color: #2563eb; margin-right: 10px;"></i>
                <h3 style="font-size: 18px; font-weight: 600; color: #1e293b; margin: 0;">Charges Summary</h3>
            </div>
            
            <div style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr>
                            <th style="text-align: left; padding: 12px; background-color: #f1f5f9; color: #4a5568; font-size: 13px; font-weight: 600; text-transform: uppercase; border-bottom: 1px solid #e2e8f0;">Description</th>
                            <th style="text-align: right; padding: 12px; background-color: #f1f5f9; color: #4a5568; font-size: 13px; font-weight: 600; text-transform: uppercase; border-bottom: 1px solid #e2e8f0;">Amount</th>
                        </tr>
                    </thead>
                    <tbody id="roomDetails">
                        <!-- Room details will be populated by JavaScript -->
                           ${roomDetail
                             .map(
                               (room) => `
                        <tr key="${room._id}">
                            <td style="padding: 16px 24px; font-size: 14px; white-space: nowrap; color: #1e293b; text-transform: capitalize;">
                                ${room.roomType} Room (${nights} night${
                                 nights > 1 ? "s" : ""
                               } @ RM 
                                ${room.pricePerNight.toFixed(2)} / night)
                            </td>
                            <td style="padding: 16px 24px; text-align: right; font-size: 14px; font-weight: 500; white-space: nowrap; color: #1e293b;">
                                RM ${(room.pricePerNight * nights).toFixed(2)}
                            </td>
                        </tr>
                    `
                             )
                             .join("")}
                    ${
                      reward
                        ? `
                        <tr style="background-color: #f9fafb;">
                            <td style="padding: 16px 24px; font-size: 14px; font-weight: 500; white-space: nowrap; color: #1e293b;">
                                Subtotal
                            </td>
                            <td style="padding: 16px 24px; text-align: right; font-size: 14px; font-weight: 500; white-space: nowrap; color: #1e293b;">
                                RM ${subtotal.toFixed(2)}
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 16px 24px; font-size: 14px; white-space: nowrap; color: #1e293b;">
                                <div style="display: flex; align-items: center;">
                                    <i class="fas fa-gift" style="margin-right: 8px; color: #10B981;"></i>
                                    ${reward.name} (${reward.description})
                                </div>
                            </td>
                            <td style="padding: 16px 24px; text-align: right; font-size: 14px; font-weight: 500; white-space: nowrap; color: #DC2626;">
                                -RM ${(
                                  subtotal *
                                  (reward.rewardDiscount / 100)
                                ).toFixed(2)}
                            </td>
                        </tr>
                        <tr style="border-top: 1px solid #e5e7eb;">
                            <td style="padding: 16px 24px; font-size: 16px; font-weight: 600; white-space: nowrap; color: #1e293b;">
                                Total
                            </td>
                            <td style="padding: 16px 24px; text-align: right; font-size: 16px; font-weight: 600; white-space: nowrap; color: #1e293b;">
                                RM ${(
                                  subtotal *
                                  (1 - reward.rewardDiscount / 100)
                                ).toFixed(2)}
                            </td>
                        </tr>
                    `
                        : `
                        <tr style="border-top: 1px solid #e5e7eb;">
                            <td style="padding: 16px 24px; font-size: 16px; font-weight: 600; white-space: nowrap; color: #1e293b;">
                                Subtotal
                            </td>
                            <td style="padding: 16px 24px; text-align: right; font-size: 16px; font-weight: 600; white-space: nowrap; color: #1e293b;">
                                RM ${subtotal.toFixed(2)}
                            </td>
                        </tr>
                    `
                    }

                     ${
                       breakfastIncluded
                         ? `
                        <tr>
                            <td style="padding: 12px; font-size: 14px; color: #1e293b;">
                                Breakfast Voucher (${
                                  totalBreakfastPrice / 30
                                } x RM 30.00 x ${nights} night${nights > 1 ? "s" : ""})
                            </td>
                            <td style="padding: 12px; text-align: right; font-weight: 500; color: #1e293b;">
                                RM ${totalBreakfastPrice.toFixed(2)}
                            </td>
                        </tr>
                    `
                         : ""
                     }
                    </tbody>
                    <tfoot>
                        <tr style="background-color: #dbeafe;">
                            <td style="padding: 15px; font-weight: 700; color: #1e293b; font-size: 16px; border-top: 1px solid #e2e8f0;">Total Amount</td>
                            <td style="padding: 15px; text-align: right; font-weight: 700; color: #2563eb; font-size: 22px; border-top: 1px solid #e2e8f0;">
                                RM <span id="totalPrice">${totalPrice}</span>
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
        
        <!-- Payment & Policies -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; position: relative; z-index: 1;">
            <!-- Payment Information -->
            <div style="border-radius: 12px; border: 1px solid #c7d2fe; background: linear-gradient(to bottom right, #e0e7ff, #ede9fe); padding: 20px;">
                <div style="display: flex; align-items: center; margin-bottom: 15px;">
                    <i class="far fa-credit-card" style="font-size: 18px; color: #4f46e5; margin-right: 10px;"></i>
                    <h3 style="font-size: 18px; font-weight: 600; color: #1e293b; margin: 0;">Payment Information</h3>
                </div>
                
                <div style="margin-top: 15px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                        <span style="color: #4a5568;">Payment Method:</span>
                        <span style="font-weight: 500;" id="paymentMethod">${paymentMethod}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span style="color: #4a5568;">Transaction ID:</span>
                        <span style="font-weight: 500;" id="paymentIntentId">${paymentIntentId}</span>
                    </div>
                </div>
                
                <div style="margin-top: 20px; border-radius: 8px; border: 1px solid #c7d2fe; background-color: white; padding: 15px;">
                    <div style="display: flex; align-items: center;">
                        <i class="fas fa-info-circle" style="font-size: 18px; color: #4f46e5; margin-right: 10px;"></i>
                        <p style="font-size: 14px; color: #4a5568; margin: 0;">
                            Payment processed successfully on <span id="paymentDate">August 16, 2023</span>
                        </p>
                    </div>
                </div>
            </div>
            
            <!-- Hotel Policies -->
            <div style="border-radius: 12px; border: 1px solid #fde68a; background: linear-gradient(to bottom right, #fef3c7, #ffedd5); padding: 20px;">
                <div style="display: flex; align-items: center; margin-bottom: 15px;">
                    <i class="fas fa-info-circle" style="font-size: 18px; color: #d97706; margin-right: 10px;"></i>
                    <h3 style="font-size: 18px; font-weight: 600; color: #1e293b; margin: 0;">Hotel Policies</h3>
                </div>
                
                <ul style="margin-top: 15px; padding-left: 20px; color: #4a5568;">
                    <li style="margin-bottom: 10px;">Check-in time is 3:00 PM, check-out is 12:00 PM</li>
                    <li style="margin-bottom: 10px;">Early check-in and late check-out subject to availability</li>
                    <li style="margin-bottom: 10px;">Cancellations must be made 48 hours prior to arrival</li>
                    <li style="margin-bottom: 10px;">No smoking policy in all rooms</li>
                    <li>Pets are not allowed</li>
                </ul>
                
                <div style="margin-top: 20px; border-radius: 8px; border: 1px solid #fde68a; background-color: white; padding: 15px;">
                    <div style="display: flex; align-items: center;">
                        <i class="fas fa-info-circle" style="font-size: 18px; color: #d97706; margin-right: 10px;"></i>
                        <p style="font-size: 14px; color: #4a5568; margin: 0;">
                            Please present this invoice at check-in along with your ID
                        </p>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Footer -->
        <div style="margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 20px; text-align: center; font-size: 14px; color: #4a5568; position: relative; z-index: 1;">
            <p style="margin: 0;">Thank you for choosing ${hotelDetail?.name}! We look forward to serving you.</p>
            <p style="margin: 10px 0 0 0; font-size: 12px;">Invoice generated on August 16, 2023</p>
        </div>
    </div>
</body>
    `;
};
