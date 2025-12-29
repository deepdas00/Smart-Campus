import jwt from "jsonwebtoken";
import { ApiError } from "../utils/apiError.js";

export const verifyJWT = (req, res, next) => {


  console.log("huuuuuuuuuuuuuuuuuuuuuuuuuuu");
  

  const token = req.cookies?.accessToken  || req.header("Authorization")?.replace(/^Bearer\s+/i, "") || req.cookies?.platformAccessToken

  if (!token) {
      // Instead of throwing, return a response or use next()
      return res.status(401).json({ success: false, message: "Unauthorized: No token" });
    }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
   
  console.log(req.user)
    
    next();
  } catch {
    throw new ApiError(401, "Invalid or expired token");
  }
};
