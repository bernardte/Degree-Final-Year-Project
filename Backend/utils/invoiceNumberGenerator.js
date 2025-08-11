import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Emulating __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const STORAGE_FILE = path.join(__dirname, "invoices", "invoiceCounter.json");

/**
 * Get the invoice serial number of the day
 */
function getDailyCounter() {
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");

  let data = {};
  if (fs.existsSync(STORAGE_FILE)) {
    data = JSON.parse(fs.readFileSync(STORAGE_FILE, "utf-8"));
  }

  // If the date changes, reset the count
  if (!data.date || data.date !== today) {
    data = { date: today, counter: 0 };
  }

  data.counter += 1;

  // Save Count
  fs.mkdirSync(path.dirname(STORAGE_FILE), { recursive: true }); // 确保目录存在
  fs.writeFileSync(STORAGE_FILE, JSON.stringify(data));

  return { date: today, counter: data.counter };
}

/**
 * Generate enterprise-level invoice numbers
 * Format: INV-YYYYMMDD-XXXX-RAND
 */
export function generateInvoiceNumber() {
  const { date, counter } = getDailyCounter();

  const prefix = "INV";
  const sequence = String(counter).padStart(4, "0");
  const randomPart = Math.random().toString(16).substr(2, 4).toUpperCase();

  return `${prefix}-${date}-${sequence}-${randomPart}`;
}
