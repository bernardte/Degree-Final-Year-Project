import ActivityLog from "../models/activityLog.model.js";
import SuspiciousEvent from "../models/suspiciousEvent.model.js";
import { sanitizeSensitiveData } from "./sanitizeSensitiveData.js";

export const anomalyDetector = async (activityLog) => {
  try {
    if (activityLog) {
      console.log("your active log: ", activityLog);
      const { ip, action, userId, sessionId, type, metadata, device } =
        activityLog;
      //check rate limit of within 1 miniute of same ip and action request
      const oneMinueAgo = new Date(Date.now() - 60 * 1000);
      const recentLogs = await ActivityLog.countDocuments({
        ip,
        action,
        createdAt: { $gte: oneMinueAgo }, // get logs within the last 1 minute of same ip and action
      });

      console.log("oneMinuteAgo: ", oneMinueAgo);
      console.log("GET: ", recentLogs);

      if (recentLogs > 5) {
        // if more than 5 logs found then it is considered as an anomoly
        await SuspiciousEvent.create({
          userId,
          reason: "rate limit exceeded",
          type,
          severity: "medium",
          handled: false,
          details: {
            ip,
            action,
            sessionId,
            metadata: sanitizeSensitiveData(metadata),
            device,
            count: recentLogs,
          },
        });
      }

      if (action.includes("login") && metadata && metadata.password) {
        // check for multiple failed login attempts
        const fiveMinuteAgo = new Date(Date.now() - 5 * 60 * 1000);
        const failedLoginAttempts = await ActivityLog.countDocuments({
          ip,
          action: "login",
          createdAt: { $gte: fiveMinuteAgo },
        });

        if (failedLoginAttempts > 5) {
          await SuspiciousEvent.create({
            userId,
            reason: "multiple failed logins",
            type: "login",
            severity: "high",
            handled: false,
            details: {
              ip,
              action,
              sessionId,
              metadata: sanitizeSensitiveData(metadata),
              device,
              count: failedLoginAttempts,
            },
          });
        }
      }
    }
  } catch (error) {
    console.log("Error in anomalyDetector middleware: ", error.message);
  }
};
