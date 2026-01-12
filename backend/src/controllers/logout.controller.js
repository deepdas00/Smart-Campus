import { connectMasterDB, getCollegeDB } from "../db/db.index.js";
import { getCollegeModel } from "../models/college.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getCollegeStudentModel } from "../models/collegeStudent.model.js";
import { getCollegeUserModel } from "../models/collegeUser.model.js"

export const logoutUser = asyncHandler(async (req, res) => {

  const { userId, role, collegeCode } = req.user;

  const masterConn = connectMasterDB();
  const College = getCollegeModel(masterConn);

  const college = await College.findOne({
    collegeCode,
    status: "active"
  });

  if (!college) {
    throw new ApiError(404, "College not found");
  }

  const collegeConn = getCollegeDB(college.dbName);

  let userDoc = null;


  if (role === "student") {
    const Student = getCollegeStudentModel(collegeConn);
    userDoc = await Student.findById(userId);
  } 
  else {
    const CollegeUser = getCollegeUserModel(collegeConn);
    userDoc = await CollegeUser.findById(userId);
  }

  if (!userDoc) {
    throw new ApiError(404, "User not found");
  }


  userDoc.refreshToken = null;
  await userDoc.save({ validateBeforeSave: false });

// For deploy 
  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None"
  };

//For local host
  // const options = {
  //   httpOnly: true,
  //   secure: false,
  //   sameSite: "Lax"
  // };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "Logged out successfully"));
});