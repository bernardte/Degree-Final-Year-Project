import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import generateTokensAndSetCookies from "../utils/generateTokensAndSetCookies.js";

const handleRefreshToken = async (req, res) => {
    const token = req.cookies.refreshToken;
    console.log("🔹 Cookies Received:", req.cookies); // Debugging
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try{
        
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_TOKEN);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    const { accessToken } = generateTokensAndSetCookies(
      user._id,
      res,
      user.role,
      { requireRefresh: true }
    );

    user.password = undefined; // Remove password from user object

    // Set new access token in cookies
    res.status(200).json({
        message: "New tokens generated",
        accessToken,
        role: user.role,
        userId: user._id,
        username: user.username,
        user
    });

    }catch(error){
        console.log("Error in refreshToken: ", error.message);
        if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
            return res.status(401).json({ error: "Invalid or expired token" });
        }
        return res.status(500).json({ error: "Internal Server Error" });
    }
}


export default {
  handleRefreshToken,
};