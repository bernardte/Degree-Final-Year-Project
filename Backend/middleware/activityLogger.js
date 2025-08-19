    import ActivityLog from "../models/activityLog.model.js";
    import useragent from "useragent";
    import geoip from "geoip-lite"

    export const baseLogger = async (req, res, next) => {

        try {
          // get request details
          const sessionId =
            req.sessionId ||
            req.cookies["session-id"] ||
            req.headers["x-session-id"];
          const type = req.method === "GET" ? "page_view" : "action";
          const action =
            req.method === "GET"
              ? req.originalUrl
              : req.body.action || req.query.action || "unknown_action";

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

          // Temporarily store the req object in the database
          req._activityLog = {
            sessionId,
            type,
            action,
            metadata: req.body || req.query || {},
            ip,
            ua: userAgent,
            device,
            geo,
          };

          next();
        } catch (error) {
        console.log("Error in activityLogger middleware: ", error.message);
        next();
        }
    };

    export const enrichActivityLog = async (req, res, next) => {
        try {
            if(req._activityLog){
                //* if protect route middleware fill the req.user, then we can get the userId and save the activity log to the database
                const userId = req.user ? req.user._id : null;
                req._activityLog.userId = userId;
                // Save the activity log to the database;
                const activityLog = await ActivityLog.create(req._activityLog);
                await activityLog.save();
                // Clean up the req._activityLog to avoid memory leak
                req._activityLog = null;
            }

            next();
        } catch (error) {
            console.log("Error in enrichLogger middleware:", error.message);
            next();
        }
    }