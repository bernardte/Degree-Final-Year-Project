// middleware/rateLimiter.js
import crypto from "crypto";

// In-memory store (可换 redis)
const rateStore = {};

function hash(str) {
  return crypto.createHash("sha256").update(str).digest("hex");
}

/**
 * Real API Rate Limiter 
 */
export const rateLimiter = (key, limit = 5, seconds = 60) => {
  return (req, res, next) => {
    const ip =
      req.ip ||
      req.connection.remoteAddress ||
      req.headers["x-forwarded-for"] ||
      "unknown_ip";
    const hashed = hash(ip);
    const storeKey = `${key}_${hashed}`;
    const now = Date.now();

    if (!rateStore[storeKey]) {
      rateStore[storeKey] = { count: 1, time: now };
      return next();
    }

    const record = rateStore[storeKey];

    // Reset window
    if (now - record.time > seconds * 1000) {
      record.count = 1;
      record.time = now;
      return next();
    }

    // Too many requests
    if (record.count >= limit) {

      console.log("reach limit: ", record.count);
      return res.status(429).json({
        success: false,
        error: "Too many requests. Please try again later.",
      });
    }

    record.count++;
    next();
  }
}
