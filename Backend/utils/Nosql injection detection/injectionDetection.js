import SuspiciousEvent from "../../models/suspiciousEvent.model.js"

const hasDollarKeys = (obj) => {
    if(!obj || typeof obj !== "object") return false;

    for(const key of Object.keys(obj)){
        if(key.startsWith("$")) return true;
        const val = obj[key];
        if(val && typeof val === "object" && hasDollarKeys(val)) return true;
    }

    return false;
}

const detectSuspiciousStructure = (obj, fieldExpectations = {}) => {
     // fieldExpectations: { username: "string", age: "number" }
    const issues = [];
    if(typeof obj !== "object" || obj === null) return issues;

    for(const [key, value] of Object.entries(obj)){
        //1) dollar-key
        if(key.startsWith("$")){
            issues.push({ reason: "dollar key", key: key })
        }

        //type mismatch if expectation exists
        if(fieldExpectations[key]){
          const expected = fieldExpectations[key];

          if (expected === "string" && typeof value !== "string") {
            issues.push({
              reason: "type mismatch",
              key: key,
              expected,
              got: typeof value,
            });
          }

          if (expected === "number" && typeof value !== "number") {
            issues.push({
              reason: "type_mismatch",
              key: key,
              expected,
              got: typeof value,
            });
          }
          // If a primitive was expected but an object was received -> suspicious
          if (
            (expected === "string" || expected === "number") &&
            typeof value === "object"
          ) {
            issues.push({
              reason: "type_mismatch_object",
              key: key,
              expected,
              got: typeof value,
            });
          }
        }

        if(value && typeof value === "object"){
            issues.push(...detectSuspiciousStructure(value, fieldExpectations));
        }
    }

    return issues;
}

export const nosqlDetectionMiddleware = (options = {}) => {
  const sensitiveRoutes = options.sensitiveRoutes || [];
  const fieldExpectations = options.fieldExpectations || {};

  return async (req, res, next) => {
    try {
      const fullPath = req.baseUrl + req.path; // e.g. "/api/bookings/create-booking"
      console.log(fullPath);
      // 判断是否在 sensitiveRoutes 里（支持字符串或正则）
      const isSensitive = sensitiveRoutes.some((route) => {
        if (route instanceof RegExp) return route.test(fullPath);
        return route === fullPath || route === req.path;
      });

      if (!isSensitive) {
        return next();
      }

      // 根据匹配路径找 fieldExpectations
      let routeExpect = {};
      for (const [pattern, expect] of Object.entries(fieldExpectations)) {
        if (pattern === req.path || pattern === fullPath) {
          routeExpect = expect;
          break;
        }
        // 如果 key 本身是正则字符串
        try {
          const regex = new RegExp(pattern);
          if (regex.test(fullPath)) {
            routeExpect = expect;
            break;
          }
        } catch (e) {
          // ignore invalid regex
        }
      }

      // 开始检测 payload
      const payloadCombined = {
        body: req.body,
        query: req.query,
        params: req.params,
      };

      const hasDollar = hasDollarKeys(payloadCombined);
      const issues = detectSuspiciousStructure(payloadCombined, routeExpect);

      if (hasDollar || issues.length > 0) {
        await SuspiciousEvent.create({
          userId: req.user?._id || null,
          guestId: req.cookies.guestId,
          type: "nosql injection",
          reason: `Possible NoSQL injection attempt on ${req.path}`,
          details: {
            ip: req.ip,
            path: req.originalUrl,
            method: req.method,
            issues,
            sampleBody: req.body && Object.keys(req.body).slice(0, 5),
            timestamp: new Date(),
          },
          severity: "high",
          handled: false,
        });

        return res.status(400).json({ error: "Invalid request payload" });
      }

      next();
    } catch (err) {
      console.error("NoSQL detection middleware error:", err);
      next();
    }
  };
};
