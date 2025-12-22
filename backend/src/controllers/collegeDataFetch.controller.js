import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { connectMasterDB } from "../db/db.index.js";
import { getCollegeModel } from "../models/college.model.js";




export const getAllColleges = asyncHandler(async (req, res) => {
  // 1️⃣ Connect to MASTER DB
  const masterConn = connectMasterDB();

  // 2️⃣ Get College model
  const College = getCollegeModel(masterConn);

  // 3️⃣ Fetch only active colleges and sort by first letter of name
  const colleges = await College.find({ status: "active" })
    .sort({ collegeName: 1 })
    .select("-_id -officialEmail -dbName -status -createdAt -updatedAt"); // ascending alphabetical order

  // 4️⃣ Send response
  res.status(200).json(
    new ApiResponse(
      200,
      colleges,
      "Active colleges sorted by name and sent successfully"
    )
  );
});
