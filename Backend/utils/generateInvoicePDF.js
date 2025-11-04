import puppeteer from "puppeteer";
import path from "path";
import fs from "fs";

const generateInvoicePDF = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // load html
  await page.setContent(invoiceHtml, { waitUntil: "networkidle0" });

  // save as pdf
  const pdfPath = path.join(process.cwd(), "invoice.pdf");
  await page.pdf({ path: pdfPath, format: "A4" });

  await browser.close();
  return pdfPath;
};
