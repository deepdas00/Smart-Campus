import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { connectMasterDB } from "../db/db.index.js";
import { getCollegeModel } from "../models/college.model.js";



//just will send collegeCode and collgeName as responce (dropDown at login)
export const getAllColleges = asyncHandler(async (req, res) => {
  // 1️⃣ Connect to MASTER DB
  const masterConn = connectMasterDB();

  // 2️⃣ Get College model
  const College = getCollegeModel(masterConn);

  // 3️⃣ Fetch only active colleges and sort by first letter of name
  const colleges = await College.find({ status: "active" })
    .sort({ collegeName: 1 })
    .select("collegeCode collegeName"); // ascending alphabetical order

  // 4️⃣ Send response
  res.status(200).json(
    new ApiResponse(
      200,
      colleges,
      "Active colleges sorted by name and sent successfully"
    )
  );
});




//will send full details of the college as responce (Official ADMIN)
export const getAllCollegesFullDetails = asyncHandler(async (req, res) => {
  // 1️⃣ Connect to MASTER DB
  const masterConn = connectMasterDB();

  // 2️⃣ Get College model
  const College = getCollegeModel(masterConn);

  // 3️⃣ Fetch only active colleges and sort by first letter of name
  const colleges = await College.find({ status: "active" })
    .sort({ collegeName: 1 })
    .select("-dbName "); // ascending alphabetical order

  // 4️⃣ Send response
  res.status(200).json(
    new ApiResponse(
      200,
      colleges,
      "Active colleges sorted by name and sent successfully"
    )
  );
});



