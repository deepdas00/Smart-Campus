import { connectMasterDB, getCollegeDB } from "../../db/db.index.js";
import { getCollegeModel } from "../../models/college.model.js";
import { getLibraryPolicyModel } from "../../models/libraryPolicy.model.js";
import { ApiError } from "../../utils/apiError.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

/* ================================
   CREATE / UPDATE LIBRARY POLICY
================================ */

export const setLibraryPolicy = asyncHandler(async (req, res) => {

  const { collegeCode, userId } = req.user;

  const {
    maxBooksAllowed,
    returnPeriodDays,
    finePerDay,
    maxFine
  } = req.body;

  if (!maxBooksAllowed || !returnPeriodDays || !finePerDay || !maxFine) {
    throw new ApiError(400, "All required policy fields must be provided");
  }

  const masterConn = connectMasterDB();
  const College = getCollegeModel(masterConn);
  const college = await College.findOne({ collegeCode, status: "active" });

  if (!college) {
    throw new ApiError(404, "College not found");
  }

  const collegeConn = getCollegeDB(college.dbName);
  const Policy = getLibraryPolicyModel(collegeConn);

  let policy = await Policy.findOne();

  if (!policy) {
    policy = await Policy.create({
      maxBooksAllowed,
      returnPeriodDays,
      finePerDay,
      maxFine,
      updatedBy: userId
    });
  } else {
    policy.maxBooksAllowed = maxBooksAllowed;
    policy.returnPeriodDays = returnPeriodDays;
    policy.finePerDay = finePerDay;
    policy.maxFine = maxFine;
    policy.updatedBy = userId;
    await policy.save({ validateBeforeSave: false });
  }

  res.status(200).json(
    new ApiResponse(200, policy, "Library policy updated successfully")
  );
});




export const fetchLibraryPolicy = asyncHandler(async (req, res) => {

  const { collegeCode, userId } = req.user;

  const masterConn = connectMasterDB();
  const College = getCollegeModel(masterConn);
  const college = await College.findOne({ collegeCode, status: "active" });

  if (!college) {
    throw new ApiError(404, "College not found");
  }

  const collegeConn = getCollegeDB(college.dbName);
  const Policy = getLibraryPolicyModel(collegeConn);

  let policy = await Policy.findOne();

  res.status(200).json(
    new ApiResponse(200, policy, "Library policy updated successfully")
  );
});


