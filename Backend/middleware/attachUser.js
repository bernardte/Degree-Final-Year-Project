import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()
export const attachUser = async(req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if(!token){
        req.user = null;
        return next();
    }

    jwt.verify(token, process.env.JWT_ACCESS_TOKEN, (error, user) => {
      if (error) {
        req.user = null;
      } else {
        req.user = user;
        console.log("user catch: ", req.user)
      }

      next();
    });

}