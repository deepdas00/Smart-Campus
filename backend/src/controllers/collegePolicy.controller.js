import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { connectMasterDB, getCollegeDB } from "../db/db.index.js";
import { getCollegeModel } from "../models/college.model.js";
import { getCollegePolicyModel } from "../models/colllegePolicy.model.js";

export const createOrUpdateCollegePolicy = asyncHandler(async (req, res) => {

  const { collegeCode } = req.user;
  const { departmentName } = req.body;
 console.log(departmentName);
 
  if (!Array.isArray(departmentName) || departmentName.length === 0) {
    throw new ApiError(400, "departmentName must be a non-empty array");
  }

  const masterConn = connectMasterDB();
  const College = getCollegeModel(masterConn);

  const college = await College.findOne({ collegeCode, status: "active" });
  if (!college) throw new ApiError(404, "College not found");

  const collegeConn = getCollegeDB(college.dbName);
  const CollegePolicy = getCollegePolicyModel(collegeConn);

  const policy = await CollegePolicy.findOneAndUpdate(
    {},
    { departmentName },
    { new: true, upsert: true }
  );

  res.status(200).json(
    new ApiResponse(200, policy, "College policy updated successfully")
  );
});





export const getCollegePolicy = asyncHandler(async (req, res) => {

  const { collegeCode } = req.params;

  const masterConn = connectMasterDB();
  const College = getCollegeModel(masterConn);

  const college = await College.findOne({ collegeCode, status: "active" });
  if (!college) throw new ApiError(404, "College not found");

  const collegeConn = getCollegeDB(college.dbName);
  const CollegePolicy = getCollegePolicyModel(collegeConn);

  const policy = await CollegePolicy.findOne();

  res.status(200).json(
    new ApiResponse(200, policy, "College policy fetched successfully")
  );
});
