import jwt from "jsonwebtoken";
import { ApiError } from "./apiError.js";

export const generateAccessAndRefreshTokens = async ({
  userId,
  role,
  collegeCode
}) => {
  try {
    const accessToken = jwt.sign(
      {
        userId,
        role,
        collegeCode
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
      }
    );

    const refreshToken = jwt.sign(
      {
        userId,
        collegeCode
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
      }
    );

    return { accessToken, refreshToken };

  } catch (error) {
    throw new ApiError(500, "Token generation failed");
  }
};
