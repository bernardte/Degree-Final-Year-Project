import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    console.log("🔹 Cookies Received:", req.cookies); // Debugging
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN);
    console.log("🔹 Decoded Token:", decoded); // Debuggin

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res
        .status(401)
        .json({ message: "User not found, authorization denied" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Error in protectRoute: ", error.message);

    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export default protectRoute;
