import { Parser } from "json2csv";
import PDFDocument from "pdfkit";
import fs from "fs";
import { formatDate } from "../../formatDate.js";
import { addTableHeader, addTableRow } from "../table/tableComponent.js";


export const generateOccupancyCSV = async (data, filePath) => {
  const fields = [
    { label: "Metrics", value: "metric" },
    { label: "Value", value: "value" },
  ];

  const csvData = [
    { metric: "Number of rooms booked", value: data.bookedRooms },
    { metric: "Total Number of Room", value: data.totalRooms },
    { metric: "Occupancy Rate", value: data.occupacyRate },
  ];

  const parser = new Parser({ fields });
  const csv = parser.parse(csvData);
  fs.writeFileSync(filePath, csv);
  return csv;
};

export const generateOccupancyPDF = async (
  data,
  filePath,
  startDate,
  endDate
) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);

    //Title
    doc.fontSize(20).font("Helvetica-Bold").text("Occupancy Report", 50, 50);

    doc
      .fontSize(12)
      .font("Helvetica")
      .text(
        `Reporting period: ${formatDate(startDate)} - ${formatDate(endDate)}`,
        50,
        80
      );

    doc.moveTo(50, 100).lineTo(550, 100).stroke();

    // Data Display
    let y = 120;

    doc.fontSize(14).font("Helvetica-Bold").text("Data", 50, y);

    y += 30;

    const headers = ["Metric", "Value"];
    const widths = [200, 100];
    const alignments = ["left", "right"];

    y = addTableHeader(doc, y, headers, widths, alignments);

    const rows = [
      ["Number of Rooms Booked", data.bookedRooms.toString()],
      ["Total Number of Rooms", data.totalRooms.toString()],
      ["Occupancy Rate", data.occupacyRate],
    ];

    rows.forEach((row) => {
      y = addTableRow(doc, y, row, widths, alignments);
    });

    //footer
    const footerY = 750;

    doc
      .fontSize(10)
      .text(`Generate Date: ${new Date().toLocaleString()}`, 50, footerY, {
        align: "left",
      })
      .text(`1 Page, 1 Page`, 0, footerY, { align: "center" });
    doc.end();

    stream.on("finish", () => {
      resolve(fs.readFileSync(filePath));
    });

    stream.on("error", reject);
  });
};

export const generateRevenueCSV = async (data, filePath) => {
  const mainFields = [
    { label: "Total Revenue", value: "totalRevenue" },
    { label: "Payment Method Statistic", value: "paymentMethodStats" },
  ];

  // Payment method details
  const paymentDetails = [];
  for (const [method, stats] of Object.entries(data.paymentMethodStats)) {
    paymentDetails.push({
      method,
      count: stats.count,
      totalRevenue: stats.totalRevenue,
      average: data.averagePriceByPaymentMethod[method] || 0,
    });
  }

  // Write main data
  const mainParser = new Parser({ fields: mainFields });
  const mainCsv = mainParser.parse([
    {
      totalRevenue: data.totalRevenue,
      paymentMethodStats: `${
        Object.keys(data.paymentMethodStats).length
      } Payment methods`,
    },
  ]);

  //    Write payment method details
  const paymentParser = new Parser({
    fields: [
      { label: "Payment Method", value: "method" },
      { label: "Number of Transactions", value: "count" },
      { label: "Total Revenue", value: "totalRevenue" },
      { label: "Average Transaction Amount", value: "average" },
    ],
  });

  const paymentCsv = paymentParser.parse(paymentDetails);

  const fullCsv = `Revenue Statement Summary\n${mainCsv}\n\nPayment method details\n${paymentCsv}`;
  fs.writeFileSync(filePath, fullCsv);
  return fullCsv;
};

export const generateRevenuePDF = async (data, filePath, startDate, endDate) => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ margin: 50 });
        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);

        // title
        doc.fontSize(20).font('Helvetica-Bold')
        .text('Income Statement', 50, 50);
    
        doc.fontSize(12).font('Helvetica')
        .text(`Reporting Period: ${formatDate(startDate)} - ${formatDate(endDate)}`, 50, 80);

        doc.moveTo(50, 100).lineTo(550, 100).stroke();

        // Data Display
        let y = 120;
        doc.fontSize(14).font("Helvetica-Bold").text("Data", 50, y);

        y += 30;

         doc
           .fontSize(12)
           .font("Helvetica")
           .text(`Total Revenue: RM ${data.totalRevenue.toFixed(2)}`, 50, y);

         y += 30;

         // Payment Method Statistic
         doc.fontSize(14).font("Helvetica-Bold").text("Payment Method Statistic", 50, y);

         y += 30;

         const headers = [
           "Payment Method",
           "Number of Transactions",
           "Total Revenue",
           "Average Transaction Amount",
         ];
         const widths = [150, 120, 120, 150]; 
         const alignments = ["left", "right", "right", "right"];
        
        y = addTableHeader(doc, y, headers, widths, alignments);

        for (const [method, stats] of Object.entries(data.paymentMethodStats)) {
          const avg = data.averagePriceByPaymentMethod[method] || 0;
          const row = [
            method,
            stats.count.toString(),
            `RM ${stats.totalRevenue.toFixed(2)}`,
            `RM ${avg.toFixed(2)}`,
          ];
          y = addTableRow(doc, y, row, widths, alignments);

          // If the content exceeds the page, add a new page
          if (y > 700) {
            doc.addPage();
            y = 50;
            y = addTableHeader(doc, y, headers, widths, alignments);
          }
        }

        // footer
        const footerY = 733;
        doc
          .fontSize(10)
          .text(`Generate Date: ${new Date().toLocaleString()}`, 50, footerY, {
            align: "left",
          })
          .text(`Page 1, Page 1`, 0, footerY, { align: "center" });

        doc.end();

        stream.on("finish", () => {
          resolve(fs.readFileSync(filePath));
        });

        stream.on("error", reject);
    });
}

export const generateFinancialCSV = async (data, filePath) => {
  const fields = [
    { label: "Metrics", value: "metric" },
    { label: "Amount", value: "amount" },
  ];

  const csvData = [
    { metric: "Total Revenue", amount: data.totalRevenue },
    { metric: "Total Cancelled Order Revenue", amount: data.totalCancelledRevenue },
    { metric: "Net Profit", amount: data.netRevenue },
  ];

  // Add payment method statistics
  for (const [method, stats] of Object.entries(data.paymentMethodStats)) {
    csvData.push({
      metric: `${method.toUpperCase()} Total Payment Amount`,
      amount: stats.totalRevenue,
    });
  }

  const parser = new Parser({ fields });
  const csv = parser.parse(csvData);
  fs.writeFileSync(filePath, csv);
  return csv;
};

export const generateFinancialPDF = async (
  data,
  filePath,
  startDate,
  endDate
) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // Title
    doc
      .fontSize(20)
      .font("Helvetica-Bold")
      .text("Financial Statements", 50, 50);

    doc
      .fontSize(12)
      .font("Helvetica")
      .text(
        `Reporting Period: ${formatDate(startDate)} - ${formatDate(endDate)}`,
        50,
        80
      );

    doc.moveTo(50, 100).lineTo(550, 100).stroke();

    // Data Display
    let y = 120;
    doc.fontSize(14).font("Helvetica-Bold").text("Financial Summary", 50, y);

    y += 30;

    const headers = ["Financial Indicators", "Amount"];
    const widths = [250, 100];
    const alignments = ["left", "right"];

    y = addTableHeader(doc, y, headers, widths, alignments);

    const rows = [
      ["Total Revenue", `RM ${data.totalRevenue.toFixed(2)}`],
      ["Cancel Order Total", `RM ${data.totalCancelledRevenue.toFixed(2)}`],
      ["Net Profit", `RM ${data.netRevenue.toFixed(2)}`],
    ];

    rows.forEach((row) => {
      y = addTableRow(doc, y, row, widths, alignments);
    });

    y += 20;

    // payment method statistic
    doc
      .fontSize(14)
      .font("Helvetica-Bold")
      .text("Revenue distribution by payment method", 50, y);

    y += 30;

    y = addTableHeader(
      doc,
      y,
      ["Payment Method", "Income Amount", "Percentage"],
      [150, 100, 100],
      ["left", "right", "right"]
    );

    let total = data.totalRevenue;
    for (const [method, stats] of Object.entries(data.paymentMethodStats)) {
      const percentage = ((stats.totalRevenue / total) * 100).toFixed(2) + "%";
      const row = [method, `RM ${stats.totalRevenue.toFixed(2)}`, percentage];
      y = addTableRow(doc, y, row, [150, 100, 100], ["left", "right", "right"]);

      let page = 1;
      let totalPage = 0;

      if (y > 700) {
        doc.addPage();
        totalPage = page++;
        y = 50;
        y = addTableHeader(
          doc,
          y,
          ["Payment Method", "Income amount", "Percentage"],
          [150, 100, 100],
          ["left", "right", "right"]
        );
      }
    }

    // Footer
    const footerY = 500;
    // Footer with dynamic page numbers
    const range = doc.bufferedPageRange(); // { start: 0, count: N }
    for (let i = range.start; i < range.start + range.count; i++) {
      doc.switchToPage(i);

      const pageNumber = i + 1;
      const totalPage = range.count;

      doc
        .fontSize(10)
        .text(`Generate Date: ${new Date().toLocaleString()}`, 50, 750, {
          align: "left",
        })
        .text(`Page ${pageNumber} of ${totalPage}`, 0, footerY, {
          align: "center",
        });
    }
    doc.end();

    stream.on("finish", () => {
      resolve(fs.readFileSync(filePath));
    });

    stream.on("error", reject);
  });
};

export const generateCancellationCSV = async (data, filePath) => {
  const summaryFields = [
    { label: "Total number of canceled orders", value: "totalCancellations" },
    { label: "Total refund amount", value: "totalRefundAmount" },
  ];

  const summaryParser = new Parser({ fields: summaryFields });
  const summaryCsv = summaryParser.parse([
    {
      totalCancellations: data.totalCancellationBooking,
      totalRefundAmount: data.totalRefundAmount,
    },
  ]);

  // Cancel order details
  const detailFields = [
    { label: "Booking Reference", value: "bookingReference" },
    { label: "customerName", value: "customerName" },
    { label: "Original Amount", value: "originalAmount" },
    { label: "Refund Amount", value: "refundAmount" },
    { label: "Cancellation Date", value: "cancellationDate" },
  ];

  const details = data.cancellationBookings.map((booking) => ({
    bookingReference: booking.bookingReference,
    customerName: booking.contactName || booking.bookingCreatedByUser.username || "unknown customer",
    originalAmount: booking.totalPrice || 0,
    refundAmount: booking.refundAmount || 0,
    cancellationDate: formatDate(booking.updatedAt),
  }));

  const detailParser = new Parser({ fields: detailFields });
  const detailCsv = detailParser.parse(details);

  const fullCsv = `Cancelled Order Summary\n${summaryCsv}\n\nCancel order details\n${detailCsv}`;
  fs.writeFileSync(filePath, fullCsv);
  return fullCsv;
};

export const generateCancellationPDF = async (
  data,
  filePath,
  startDate,
  endDate
) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // Title
    doc
      .fontSize(20)
      .font("Helvetica-Bold")
      .text("Order Cancellation Report", 50, 50);

    doc
      .fontSize(12)
      .font("Helvetica")
      .text(
        `Reporting period: ${formatDate(startDate)} - ${formatDate(endDate)}`,
        50,
        80
      );

    doc.moveTo(50, 100).lineTo(550, 100).stroke();

    // Data Display
    let y = 120;
    doc.fontSize(14).font("Helvetica-Bold").text("Data", 50, y);

    y += 30;

    doc
      .fontSize(12)
      .font("Helvetica")
      .text(
        `Total Number of Cancelled Orders: ${data.totalCancellationBooking}`,
        50,
        y
      );

    y += 20;

    doc.text(
      `Total Refund Amount: RM ${data.totalRefundAmount.toFixed(2)}`,
      50,
      y
    );

    y += 40;

    // Cancel order details
    doc.fontSize(14).font("Helvetica-Bold").text("Cancel order details", 50, y);

    y += 30;

    const headers = [
      "Booking Reference",
      "Customer Name",
      "Original Amount",
      "Refund Amount",
      "Cancellation Date",
    ];
    const widths = [120, 80, 80, 80, 120];
    const alignments = ["left", "right", "right", "right", "right"];

    y = addTableHeader(doc, y, headers, widths, alignments);

    data.cancellationBookings.forEach((booking) => {
      const row = [
        booking.bookingReference,
        booking.contactName || booking.bookingCreatedByUser.username || "unknown customer",
        `RM ${(booking.totalPrice || 0).toFixed(2)}`,
        `RM ${(booking.refundAmount || 0).toFixed(2)}`,
        formatDate(booking.updatedAt),
      ];
      y = addTableRow(doc, y, row, widths, alignments);

      if (y > 700) {
        doc.addPage();
        y = 50;
        y = addTableHeader(doc, y, headers, widths, alignments);
      }
    });

    //footer
    const footerY = 750;
    doc
      .fontSize(10)
      .text(`Generate Date: ${new Date().toLocaleString()}`, 50, footerY, {
        align: "left",
      })
      .text(`Page 1, Page 1`, 0, footerY, { align: "center" });

    doc.end();

    stream.on("finish", () => {
      resolve(fs.readFileSync(filePath));
    });

    stream.on("error", reject);
  });
};

export const generateCSV = async (type, data, filePath) => {
  switch (type) {
    case "occupancy":
      return await generateOccupancyCSV(data, filePath);
    case "revenue":
      return await generateRevenueCSV(data, filePath);
    case "financial":
      return await generateFinancialCSV(data, filePath);
    case "cancellation":
      return await generateCancellationCSV(data, filePath);
    default:
      throw new Error("Unsupported Report Type");
  }
};

export const generatePDF = async (type, data, filePath, startDate, endDate) => {
  switch (type) {
    case "occupancy":
      return await generateOccupancyPDF(data, filePath, startDate, endDate);
    case "revenue":
      return await generateRevenuePDF(data, filePath, startDate, endDate);
    case "financial":
      return await generateFinancialPDF(data, filePath, startDate, endDate);
    case "cancellation":
      return await generateCancellationPDF(data, filePath, startDate, endDate);
    default:
      throw new Error("Unsupported Report Type");
  }
};



