import ActivityLog from "../models/activityLog.model.js";
import useragent from "useragent";
import geoip from "geoip-lite";
import { anomalyDetector } from "../utils/anomalyDetector.js";
import { sanitizeSensitiveData } from "../utils/sanitizeSensitiveData.js";

export const activityLogger = (req, res, next) => {
  res.on("finish", async () => {
    try {
      // get request details
      const sessionId =
        req.sessionId ||
        req.cookies["session-id"] ||
        req.headers["x-session-id"];
      const type = req.method === "GET" ? "page_view" : "action";
      const action = req.body?.action || `${req.method} ${req.originalUrl}`;
      // get user agent and geo information
      //? req.headers["x-forwarded-for"], if have nginx or proxy server then will get this header request, if just directly communicate to the browser then just used req.ip to get the ip address
      let ip =
        req.ip ||
        req.connection.remoteAddress ||
        req.headers["x-forwarded-for"] ||
        "unknown_ip";

      //! Normalize localhost IPv6 (::1) to IPv4 (127.0.0.1) (localhost)
      if (ip === "::1" || ip === "0:0:0:0:0:0:0:1") {
        ip = "127.0.0.1";
      }

      const userAgent = req.headers["user-agent"] || "unknown_user_agent";
      const agent = useragent.parse(userAgent);

      // get geo information
      // geoip-lite not support IPv6, so we need to use IPv4 address;
      //! geoip-lite return null, since we are using localhost, so we need to set default value
      const geo = geoip.lookup(ip) || {
        country: "unknown_country",
        city: "unknown_city",
        //? ll = latitude and longitude
        ll: [0, 0], // default to [0, 0] if geo lookup fails
      };

      const device = {
        os: agent.os || "unknown_os",
        browser: agent.toAgent() || "unknown_browser",
        platform: agent.platform
          ? agent.platform.toString()
          : "unknown_platform",
        isMobile: agent.device
          ? agent.device.toString().toLowerCase().includes("mobile")
          : false,
      };

      const metadata = {
        ...(req.body && Object.keys(req.body).length
          ? sanitizeSensitiveData(req.body)
          : {}),
        ...(req.query && Object.keys(req.query).length
          ? sanitizeSensitiveData(req.query)
          : {}),
      };


      const activityLog = await ActivityLog.create({
        userId: req.user ? req.user._id : null, // protectRoute have value or else null
        userRole: req.user ? req.user.role : null,
        sessionId,
        type,
        action,
        ip,
        ua: userAgent,
        metadata: metadata,
        device,
        geo,
      });

      // anomaly detection
      await anomalyDetector(activityLog);
    } catch (err) {
      console.error("Logging error:", err);
    }
  });

  next();
};
