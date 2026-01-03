import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { connectMasterDB, getCollegeDB } from "../db/db.index.js";
import { getCollegeModel } from "../models/college.model.js";
import { getCollegeInfoModel } from "../models/colllegeInfo.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { getCollegeDepartmentModel } from "../models/collegeDepartment.model.js";

export const createOrUpdateCollegeInfo = asyncHandler(async (req, res) => {

  const { collegeCode } = req.user;

  const {   
    officialEmail,
    address,
    NAAC,
    contactPersonName,
    contactNumber,
    principalName,
    description,
    isAutonomous,
    universityName
  } = req.body;

  

  // Resolve college
  const masterConn = connectMasterDB();
  const College = getCollegeModel(masterConn);

  const college = await College.findOne({ collegeCode, status: "active" });
  if (!college) throw new ApiError(404, "College not found");

  const collegeConn = getCollegeDB(college.dbName);
  const CollegeInfo = getCollegeInfoModel(collegeConn);

  // Handle logo upload
  let logoUrl;
  const logoPath = req.file?.path?.replace(/\\/g, "/");

  if (logoPath) {
    const uploadResult = await uploadOnCloudinary(logoPath);
    logoUrl = uploadResult.url;
  }

  const payload = {
    officialEmail,
    address,
    NAAC,
    isAutonomous,
    universityName,
    contactPersonName,
    contactNumber,
    principalName,
    description,
    isAutonomous,
    universityName
  };

  if (logoUrl) payload.logo = logoUrl;

  const collegeInfo = await CollegeInfo.findOneAndUpdate(
    { collegeCode },
    payload,
    { new: true, upsert: true, runValidators: true }
  );

  res.status(200).json(
    new ApiResponse(200, collegeInfo, "College information saved successfully")
  );
});


/// return Full information about college for college admin
export const getCollegeFullInfo = asyncHandler(async (req, res) => {
  const { collegeCode } = req.user;

  // Resolve college
  const masterConn = connectMasterDB();
  const College = getCollegeModel(masterConn);

  const college = await College.findOne({ collegeCode, status: "active" });
  if (!college) throw new ApiError(404, "College not found");

  const collegeConn = getCollegeDB(college.dbName);
  const CollegeInfo = getCollegeInfoModel(collegeConn);

  const collegeInfo = await CollegeInfo.findOne({ collegeCode })
  
  
  
  if (!collegeInfo) throw new ApiError(404, "College information not found");

  res.status(200).json(
    new ApiResponse(200, collegeInfo, "College full information fetched successfully")
  );
});


//return limited information for studetn sand staff
export const getCollegeLimitedInfo = asyncHandler(async (req, res) => {
  const { collegeCode } = req.user;

  // Resolve college
  const masterConn = connectMasterDB();
  const College = getCollegeModel(masterConn);

  const college = await College.findOne({ collegeCode, status: "active" });
  if (!college) throw new ApiError(404, "College not found");

  const collegeConn = getCollegeDB(college.dbName);
  const CollegeInfo = getCollegeInfoModel(collegeConn);
  const Department = getCollegeDepartmentModel(collegeConn);

  
  const collegeInfo = await CollegeInfo.findOne({ collegeCode }).select("collegeCode collegeName officialEmail address logo description principalName NAAC registrationNumber");

  // also fetching all departments name
  const departments = await Department.find().sort({ departmentName: 1 });
  
  if (!collegeInfo) throw new ApiError(404, "College information not found");

  res.status(200).json(
    new ApiResponse(200, {collegeInfo,departments}, "College limited information fetched successfully")
  );
});


// //department fetch  
// export const getDepartments = asyncHandler(async (req, res) => {

//   const { collegeCode } = req.params;
  
//   const masterConn = connectMasterDB();
//   const College = getCollegeModel(masterConn);

//   const college = await College.findOne({ collegeCode, status: "active" });
//   if (!college) throw new ApiError(404, "College not found");

//   const collegeConn = getCollegeDB(college.dbName);
//   const CollegeInfo = getCollegeInfoModel(collegeConn);

//   const info = await CollegeInfo.findOne();
//   const departments = info.departmentName
//   res.status(200).json({
//     departments,
//     message:"Departments fetched Successfully"
//   })
// });



