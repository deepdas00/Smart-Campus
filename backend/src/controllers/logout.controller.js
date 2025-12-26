import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const logoutUser = asyncHandler(async (req, res) => {

  const user = req.user;  // set by verifyJWT middleware

  // 🔥 Invalidate refresh token in DB
  user.refreshToken = null;
  await user.save({ validateBeforeSave: false });

  // 🍪 Clear cookies
  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None"
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "Logged out successfully"));
});
