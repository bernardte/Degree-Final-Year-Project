import SuspiciousEvent from "../models/suspiciousEvent.model.js";

const verifyRoles = async (req, res, next) => {
  const isAdmin = req.user.role === "admin";
  const isSuperAdmin = req.user.role === "superAdmin";;

  try {
      if (!isAdmin && !isSuperAdmin) {
        const suspiciousEvent = new SuspiciousEvent({
          userId: req.user._id || "",
          guestId: req.cookies.guestId || "",
          type: "unauthorized_access",
          reason: `Unauthorized access attempt to ${req.originalUrl}`,
          details: { method: req.method, path: req.originalUrl },
          severity: "low",
          handled: false,
        });
        await suspiciousEvent.save();
        console.log("your suspiciousEvent: ", suspiciousEvent);
        return res
          .status(401)
          .json({
            message: "Access denied, only admin or superAdmin can access",
          });
      }
  } catch (error) {
    console.log("Error in verifyRoles: ", error.message);
    res.status(500).json({ error: "Internal Server Error" })
  }
  next();
};

export default verifyRoles;