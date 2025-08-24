import dotenv from "dotenv";
import transporter from "../../config/nodemailer.js";
import { generateBookingEmailHTML } from "./email-invoice-template.js";
import pdf from "html-pdf-node"; 
dotenv.config();

export const sendInvoiceEmail = async (
  userEmail,
  bookingData,
  reward,
  loyaltyTier,
  invoiceNumber
) => {

  let pdfBuffer;

  try {
    //generate html content
    const htmlContent = generateBookingEmailHTML({
      userEmail,
      ...bookingData,
      reward,
      loyaltyTier,
      invoiceNumber,
    });

    console.log("html content generated ✅");

    //generate PDF， html-pdf-node required to have object 
    const file = { content: htmlContent };
    const options = { format: "A4" };
    
    pdfBuffer = await pdf.generatePdf(file, options);

    if (!pdfBuffer || !Buffer.isBuffer(pdfBuffer)) {
      console.error("PDF generate fail, return value not a buffer:", pdfBuffer);
      return;
    }

    console.log("buffer: ", pdfBuffer);

    console.log("✅ PDF generated with html-pdf-node, size:", pdfBuffer.length);

    const mailOptions = {
      from: `"The Seraphine Hotel" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `Booking Invoice #${invoiceNumber}`,
      html: `<p>Dear Guest, please find attached your booking invoice.</p>`,
      attachments: [
        {
          filename: `invoice-${invoiceNumber}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    };

    // send email
    const info = await new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) return reject(err);
        resolve(info);
      });
    });

    console.log(`📧 Booking invoice email sent to: ${userEmail}, info:`, info);
  } catch (error) {
    console.error("❌ Error sending email:", error);
    console.error(error.stack);
  }
};
