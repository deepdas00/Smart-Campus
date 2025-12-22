import jwt from "jsonwebtoken";
import { ApiError } from "../utils/apiError.js";

export const verifyJWT = (req, res, next) => {

  const token = req.cookies?.accessToken  || req.header("Authorization")?.replace(/^Bearer\s+/i, "")

  if (!token) {
    throw new ApiError(401, "Unauthorized: No token");
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    console.log(decoded);
    
    next();
  } catch {
    throw new ApiError(401, "Invalid or expired token");
  }
};
