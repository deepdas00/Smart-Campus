import jwt from "jsonwebtoken";
import { connectMasterDB, getCollegeDB } from "../db/db.index.js";
import { getCollegeModel } from "../models/college.model.js";
import { getCollegeUserModel } from "../models/collegeUser.model.js";
import { getCollegeStudentModel } from "../models/collegeStudent.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const refreshAccessToken = asyncHandler(async (req, res) => {

    const refreshToken = req.cookies?.refreshToken;


    if (!refreshToken) {
        throw new ApiError(401, "Refresh token missing");
    }

    // 1️⃣ Verify refresh token
    let decoded;
    try {
        decoded = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );
    } catch {
        throw new ApiError(401, "Invalid refresh token");
    }

    const { userId, collegeCode } = decoded;

    // 2️⃣ Resolve college
    const masterConn = connectMasterDB();
    const College = getCollegeModel(masterConn);

    const college = await College.findOne({ collegeCode, status: "active" });
    if (!college) {
        throw new ApiError(404, "College not found");
    }

    // 3️⃣ Connect college DB
    const collegeConn = getCollegeDB(college.dbName);

    // 4️⃣ Find user (staff OR student)
    let user =
        await getCollegeUserModel(collegeConn).findById(userId) ||
        await getCollegeStudentModel(collegeConn).findById(userId);

    if (!user || user.refreshToken !== refreshToken) {
        throw new ApiError(401, "Refresh token mismatch");
    }

    // 5️⃣ Generate new access token
    const newAccessToken = jwt.sign(
        {
            userId: user._id,
            role: user.role || "student",
            collegeCode
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    );

    // 6️⃣ Send new access token cookie

    const cookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000
    }
    res
        .status(200)
        .cookie("accessToken", newAccessToken, cookieOptions)
        .json(
            new ApiResponse(
                200,
                null,
                "Access token refreshed successfully"
            )
        );
});
