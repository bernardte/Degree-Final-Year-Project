import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const generateTokensAndSetCookies = (userId, res, role) => {
  const accessToken = jwt.sign(
    { userId, role },
    process.env.JWT_ACCESS_TOKEN,
    {
      expiresIn: "2h",
    }
  );

  const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_TOKEN, {
    expiresIn: "7d",
  });

  console.log("🔹 Access Token:", accessToken); // Debugging
  console.log("🔹 Refresh Token:", refreshToken); // Debugging

  // Set Refresh Token (HTTP Only Cookie)
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
  });

  // Set Access Token (HTTP Only Cookie)
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    maxAge: 2 * 60 * 60 * 1000, // 2 hours
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    secure: process.env.NODE_ENV === "production",
  });


  return { accessToken, refreshToken };
};

export default generateTokensAndSetCookies;
