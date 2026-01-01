import { connectMasterDB, getCollegeDB } from "../../db/db.index.js";
import { getCollegeModel } from "../../models/college.model.js";
import { getCanteenPolicyModel } from "../../models/canteenPolicy.model.js";
import { ApiError } from "../../utils/apiError.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

// /* ================================
//    CREATE / UPDATE CANTEEN POLICY
// ================================ */

export const setCanteenPolicy = asyncHandler(async (req, res) => {
  const { collegeCode, userId } = req.user;

  const { openingTime, closingTime } = req.body;

  

    if (!openingTime || !closingTime) {
        throw new ApiError(400, "All required policy fields must be provided");
    }

    const masterConn = connectMasterDB();
    const College = getCollegeModel(masterConn);
    const college = await College.findOne({ collegeCode, status: "active" });
  if (!openingTime || !closingTime) {
    throw new ApiError(400, "All required policy fields must be provided");
  }


  if (!college) {
    throw new ApiError(404, "College not found");
  }

  const collegeConn = getCollegeDB(college.dbName);
  const Policy = getCanteenPolicyModel(collegeConn);

  let policy = await Policy.findOne();

  if (!policy) {
    policy = await Policy.create({
      openingTime,
      closingTime,
      updatedBy: userId,
    });
  } else {
    policy.openingTime = openingTime;
    policy.closingTime = closingTime;
    policy.updatedBy = userId;
    await policy.save({ validateBeforeSave: false });
  }

    if (!policy) {
        policy = await Policy.create({
            openingTime,
            closingTime,
            updatedBy: userId
        });
    } else {
        policy.openingTime = openingTime;
        policy.closingTime = closingTime;
        policy.updatedBy = userId;
        await policy.save();
    }

    res.status(200).json(
        new ApiResponse(200, policy, "Canteen policy updated successfully")
    );

});



export const fetchPolicy = asyncHandler(async (req, res) => {
  const { collegeCode, userId } = req.user;


  const masterConn = connectMasterDB();
  const College = getCollegeModel(masterConn);
  const college = await College.findOne({ collegeCode, status: "active" });


  if (!college) {
    throw new ApiError(404, "College not found");
  }

  const collegeConn = getCollegeDB(college.dbName);
  const Policy = getCanteenPolicyModel(collegeConn);

  let policy = await Policy.findOne();


  res.status(200).json(
    new ApiResponse(200, policy, "Canteen policy updated successfully")
  );


})