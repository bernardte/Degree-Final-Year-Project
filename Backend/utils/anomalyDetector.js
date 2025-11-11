import ActivityLog from "../models/activityLog.model.js";
import SuspiciousEvent from "../models/suspiciousEvent.model.js";
import { sanitizeSensitiveData } from "./sanitizeSensitiveData.js";
import dotenv from "dotenv";

dotenv.config();

const RATE_LIMIT_COUNT = 5; // Number of requests allowed in one minute
const FAILED_LOGIN_LIMIT = 5; // The number of failed login attempts allowed within five minutes

const rateDetectStore = {}; // Memory store for rate-limit detection only

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
    const key = `detect_${ip}_${action}`;
    const now = Date.now();
    const window = 60000; // 1 min

    if(!rateDetectStore[key]){
      rateDetectStore[key] = { count: 1, time: now };
    }else{
      if(now - rateDetectStore[key].time > window){
        rateDetectStore[key].count = 1;
        rateDetectStore[key].time = now;
      }else{
        rateDetectStore[key].count++;
      }
    }

    if(rateDetectStore[key].count > RATE_LIMIT_COUNT){
      await createSuspiciousEvent({
        userId,
        guestId,
        reason: "Rate limit exceed abnormal behavior",
        type,
        severity: "high",
        ip,
        action,
        sessionId,
        metadata: metadata,
        device,
        count: rateDetectStore[key].count,
      });
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
