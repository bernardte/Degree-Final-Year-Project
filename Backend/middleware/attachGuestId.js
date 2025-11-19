import { v4 as uuidv4 } from "uuid";
import { configDotenv } from "dotenv";

configDotenv();
export const attachGuestId = (req, res, next) => {
    const guestId = req.cookies.guestId;
    if(req.user && req.user._id){
        return next();
    }

    if(guestId){
        return next();
    }

    const newGuestId = uuidv4();
    res.cookie("guestId", newGuestId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    console.log("Assigned new guestId: ", newGuestId);
    next();
}