import ActivityLog from "../models/activityLog.model.js";
import useragent from "useragent";
import geoip from "geoip-lite";
import { anomalyDetector } from "../utils/anomalyDetector.js";
import { sanitizeSensitiveData } from "../utils/sanitizeSensitiveData.js";
import { normalizeAction } from "../utils/normalizeAction.js";
import { getActionFromMap } from "../utils/mapAction.js";

export const activityLogger = (req, res, next) => {
  res.on("finish", async () => {
    try {
      // get request details
      const sessionId =
        req.sessionId ||
        req.cookies["session-id"] ||
        req.headers["x-session-id"];

      let logType =
        req.query?.type ||
        req.body?.type ||
        (req.method === "GET" ? "page view" : "action");
      let logAction =
        req.query?.action ||
        req.body?.action ||
        `${req.method} ${req.baseUrl}${req.path}`;
      const errorMessage = res.locals.errorMessage || null;
      logAction = normalizeAction(logAction)
      logAction = getActionFromMap(req.method, `${req.baseUrl}${req.path}`);
      console.log("current action: ", logAction)
      // get user agent and geo information
      //? req.headers["x-forwarded-for"], if have nginx or proxy server then will get this header request, if just directly communicate to the browser then just used req.ip to get the ip address
      let ip =
        req.ip ||
        req.connection.remoteAddress ||
        req.headers["x-forwarded-for"] ||
        "unknown_ip";

      //! third party(API calling) to take user current IP address 
      //* This API calling has limit for only 1000 Geo IP request per day. 
      // const geoRes = await fetch("https://ipapi.co/json/");
      // const geoData = await geoRes.json();
      // console.log("current user IP: ", geoData);

      //! Normalize localhost IPv6 (::1) to IPv4 (127.0.0.1) (localhost)
      if (ip === "::1" || ip === "0:0:0:0:0:0:0:1") {
        ip = "127.0.0.1";
      }

      const userAgent = req.headers["user-agent"] || "unknown user agent";
      const agent = useragent.parse(userAgent);

      // get geo information
      // geoip-lite not support IPv6, so we need to use IPv4 address;
      //! geoip-lite return null, since we are using localhost, so we need to set default value
      const geo = geoip.lookup(ip) || {
        country: ip === "127.0.0.1" ? "Malaysia" : "unknown country",
        city: ip === "127.0.0.1" ? "Local" : "unknown city",
        //? ll = latitude and longitude
        ll: [0, 0], // default to [0, 0] if geo lookup fails
      };

      const device = {
        os: agent.os || "unknown os",
        browser: agent.toAgent() || "unknown browser",
        platform: agent.platform
          ? agent.platform.toString()
          : "unknown_platform",
        isMobile: agent.device
          ? agent.device.toString().toLowerCase().includes("mobile")
          : false,
      };

      let metadata = req.query?.metadata || req.body?.metadata;
      if (metadata) {
        // If it is a string (sent by JSON.stringify), parse it first
        if (typeof metadata === "string") {
          try {
            metadata = JSON.parse(metadata);
          } catch (err) {
            console.warn(
              "Failed to parse metadata string, fallback to default"
            );
            metadata = null;
          }
        }
      }


      // generate metadata when frontend not passing through
      if (!metadata) {
        const {
          type: bodyType,
          action: bodyAction,
          ...bodyRest
        } = req.body || {};
        const {
          type: queryType,
          action: queryAction,
          ...queryRest
        } = req.query || {};
        const page = req.originalUrl;
        const actionId = bodyRest.buttonId || queryRest.buttonId || logAction;
        const params = { ...bodyRest, ...queryRest };
        const extra = {
          rawBody: req.body || {},
          rawQuery: req.query || {},
          referrer: req.headers.referer || null,
        };
        metadata = { page, actionId, params, extra };
      }

       metadata = sanitizeSensitiveData(metadata);

      const activityLog = await ActivityLog.create({
        userId: req.user ? req.user._id : null, // protectRoute have value or else null
        userRole: req.user ? req.user.role : "guest",
        sessionId,
        type: logType,
        action: logAction,
        ip,
        ua: userAgent,
        metadata: metadata,
        device,
        geo,
        status: res.statusCode >= 200 && res.statusCode < 400 ? "success" : "failed",
        errorMessage,
      });

      // anomaly detection
      await anomalyDetector(activityLog);
    } catch (err) {
      console.error("Logging error:", err);
    }
  });

  next();
};
