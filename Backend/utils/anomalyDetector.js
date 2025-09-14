import ActivityLog from "../models/activityLog.model.js";
import SuspiciousEvent from "../models/suspiciousEvent.model.js";
import { sanitizeSensitiveData } from "./sanitizeSensitiveData.js";
import dotenv from "dotenv";

dotenv.config();

const RATE_LIMIT_COUNT = 5; // Number of requests allowed in one minute
const FAILED_LOGIN_LIMIT = 5; // The number of failed login attempts allowed within five minutes

const createSuspiciousEvent = async ({
  userId,
  guestId,
  reason,
  type,
  ip,
  action,
  sessionId,
  metadata,
  device,
  count,
  severity = "medium",
}) => {
  await SuspiciousEvent.create({
    userId,
    guestId: guestId || null,
    reason,
    type,
    severity,
    handled: false,
    details: {
      ip,
      action,
      sessionId,
      metadata: sanitizeSensitiveData(metadata),
      device,
      count,
    },
  });
};


export const anomalyDetector = async (activityLog) => {
  try {
    if(!activityLog) return;

    const { ip, action, userId, sessionId, type, metadata, device, guestId } = activityLog;

    const identifierQuery = process.env.NODE_ENV === "production" 
                            ? { ip, action } 
                            : { $or: [{ sessionId }, { userId }, { guestId }], action };
    
    // Rate Limiting detection
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
    const recentLogs = await ActivityLog.countDocuments({
      ...identifierQuery,
      createdAt: { $gte: oneMinuteAgo },
    })

    if(recentLogs > RATE_LIMIT_COUNT){
     const rateLimit = await createSuspiciousEvent({
        userId,
        guestId,
        reason: "Rate Limit Exceeded",
        type,
        ip,
        action,
        sessionId,
        metadata,
        device,
        count: recentLogs,
        severity: "high",
      });

      console.log("rate limit exceed", rateLimit);
    }

    // login failed attempts
    if(action.includes("login") && metadata?.password){
      const fiveMinuteAgo = new Date(Date.now() - 5 * 60 * 1000)
      const failedLoginAttempts = await ActivityLog.countDocuments({
        ip,
        action: login,
        createdAt: { $gte: fiveMinuteAgo }
      });
      if(failedLoginAttempts > FAILED_LOGIN_LIMIT){
          await createSuspiciousEvent({
            userId,
            reason: "Multiple Login Failed",
            type: "Login",
            ip,
            action,
            sessionId,
            metadata,
            device,
            count: failedLoginAttempts,
            severity: "medium",
          });
      }
    }

  } catch (error) {
    console.log("Error in anomalyDetector middleware: ", error.message);
  }
};
