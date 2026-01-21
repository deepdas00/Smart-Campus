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

  if (!collegeCode || !loginId || !password) {
    return res
      .status(400)
      .json({
        message: "Missing required fields: college, loginId, or password",
      });
  }
  // 1️⃣ Resolve college
  const masterConn = connectMasterDB();
  const College = getCollegeModel(masterConn);

  const college = await College.findOne({ collegeCode, status: "active" });
  if (!college) {
    return res.status(404).json({ message: "College not found or inactive!!" });
    // throw new ApiError(404, "College not found or inactive");
  }

  // 2️⃣ Connect college DB
  const collegeConn = getCollegeDB(college.dbName);
  const CollegeUser = getCollegeUserModel(collegeConn);

  // 3️⃣ Find staff user
  const user = await CollegeUser.findOne({ loginId });
  if (!user) {
    return res.status(500).json({ message: "Invalid User!!" });
  }

  // 4️⃣ Verify password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(500).json({ message: "Invalid Password!!" });
  }

  // 5️⃣ Generate tokens
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens({
    userId: user._id,
    role: user.role,
    collegeCode,
  });

  // 6️⃣ Save refresh token
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
  };
  // const cookieOptions = {
  //   httpOnly: true,
  //   secure: false,
  //   sameSite: "lax",
  //   maxAge: 24 * 60 * 60 * 1000, // 1 day
  // };
  // 7️⃣ Send response
  res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })
    .json(new ApiResponse(200, { role: user.role }, "Login successful"));
});

export const currentStaff = asyncHandler(async (req, res) => {
  try {
    // verifyJWT middleware should attach 'user' to 'req'
    // console.log("daraaaaaaaaa",req.user);

    const { userId, collegeCode, role } = req.user;

    const masterConn = connectMasterDB();
    const College = getCollegeModel(masterConn);
    const college = await College.findOne({ collegeCode, status: "active" });
    if (!college) throw new ApiError(404, "College not found");

    const collegeConn = getCollegeDB(college.dbName);
    const Staff = getCollegeUserModel(collegeConn);
    const currentStaff = await Staff.findById(userId).select(
      "-password -refreshToken"
    );

    if (!currentStaff) {
      return res
        .status(404)
        .json({ success: false, message: "Staff not found" });
    }


    console.log(currentStaff);
    

    // Change 'data' to 'user' to match your React AuthContext expectations
    res.status(200).json(new ApiResponse(200, currentStaff, "GOT STUDENT"));
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
