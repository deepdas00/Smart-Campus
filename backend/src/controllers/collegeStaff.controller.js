import bcrypt from "bcrypt";
import { connectMasterDB, getCollegeDB } from "../db/db.index.js";
import { getCollegeModel } from "../models/college.model.js";
import { getCollegeUserModel } from "../models/collegeUser.model.js";
import { generateAccessAndRefreshTokens } from "../utils/tokenGenerator.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const staffLogin = asyncHandler(async (req, res) => {

    const { collegeCode, loginId, password } = req.body;

    // 1️⃣ Resolve college
    const masterConn = connectMasterDB();
    const College = getCollegeModel(masterConn);

    const college = await College.findOne({ collegeCode, status: "active" });
    if (!college) {
        throw new ApiError(404, "College not found or inactive");
    }

    // 2️⃣ Connect college DB
    const collegeConn = getCollegeDB(college.dbName);
    const CollegeUser = getCollegeUserModel(collegeConn);

    // 3️⃣ Find staff user
    const user = await CollegeUser.findOne({ loginId });
    if (!user) {
        throw new ApiError(401, "Invalid credentials");
    }

    // 4️⃣ Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new ApiError(401, "Invalid credentials");
    }

    // 5️⃣ Generate tokens
    const { accessToken, refreshToken } =
        await generateAccessAndRefreshTokens({
            userId: user._id,
            role: user.role,
            collegeCode
        });

    // 6️⃣ Save refresh token
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    const cookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
    };
    // 7️⃣ Send response
    res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, {
            ...cookieOptions,
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        })
        .json(
            new ApiResponse(
                200,
                { role: user.role },
                "Login successful"
            )
        );
});
