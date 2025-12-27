import { connectMasterDB } from "../../db/db.index.js";
import { getCollegeRequestModel } from "../../models/collegeRequest.model.js";
import { uploadOnCloudinary } from "../../utils/cloudinary.js";
import { ApiError } from "../../utils/apiError.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const submitCollegeRequest = asyncHandler(async (req, res) => {

  const {
    collegeName,
    officialEmail,
    contactPersonName,
    contactNumber,
    address,
    principalName
  } = req.body;

  if (
    !collegeName ||
    !officialEmail ||
    !contactPersonName ||
    !contactNumber ||
    !address ||
    !principalName
  ) {
    new ApiResponse(201, request, "College request submitted successfully")
  
  }

  const masterConn = connectMasterDB();
  const CollegeRequest = getCollegeRequestModel(masterConn);

  let docs = [];

  if (req.files?.length) {
    for (const file of req.files) {
      const upload = await uploadOnCloudinary(file.path.replace(/\\/g, "/"));
      if (upload?.url) docs.push(upload.url);
    }
  }

  const request = await CollegeRequest.create({
    collegeName,
    officialEmail,
    contactPersonName,
    contactNumber,
    address,
    principalName,
    documents: docs
  });

  return res.status(201).json(
    new ApiResponse(201, request, "College request submitted successfully")
  );
});
