import bcrypt from "bcrypt";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { connectMasterDB, getCollegeDB } from "../db/db.index.js";
import { getCollegeModel } from "../models/college.model.js";
import { getCollegeUserModel } from "../models/collegeUser.model.js"
import { buildCollegeRegistrationMailTemplate } from "../template/collegeRegistrationMail.template.js"
import { sendMail } from "../utils/sendMail.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { getCollegeInfoModel } from "../models/colllegeInfo.model.js";



const generatePassword = (collegeCode, role) => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  const randomLetters = Array.from({ length: 3 }, () =>
    letters.charAt(Math.floor(Math.random() * letters.length))
  ).join("");

  const randomDigits = Math.floor(10 + Math.random() * 90); // 2 digits

  return `${collegeCode}#${randomLetters}${randomDigits}!${role.toUpperCase()}`;
};



export const registerCollege = asyncHandler(async (req, res) => {

  console.log("--------------------------");
  console.log("1------------------>",req.body);
  
  const {
    collegeName,
    collegeCode,
    officialEmail,
    registrationNumber,
    address,
    contactPersonName,
    contactNumber,
    principalName,
  } = req.body;
  
  console.log("2--------------------->",collegeName,collegeCode);

  if (
    !collegeName ||
    !collegeCode ||
    !officialEmail ||
    !registrationNumber ||
    !address ||
    !contactPersonName ||
    !contactNumber ||
    !principalName
  ) {
    return res.status(400).json({ message: "Missing required fields!!" });
  }

  // 1️⃣ Connect to MASTER DB
  const masterConn = connectMasterDB();
  const MasterCollegeModel = getCollegeModel(masterConn);

  // 2️⃣ Check if college already exists
  const existingCollege = await MasterCollegeModel.findOne({ collegeCode });
  if (existingCollege) {
    throw new ApiError(409, "College already registered");
  }


  // 3️⃣ Generate DB name
const sanitizeName = (name) => {
  return name
    .toLowerCase()                // convert to lowercase
    .replace(/[^a-z0-9\s]/g, "")  // remove all special characters
    .trim()                       // remove leading/trailing spaces
    .replace(/\s+/g, "_");        // replace spaces with underscores
};

const dbName = `college_${sanitizeName(collegeCode)}_db`;

console.log(dbName);


  console.log("3--------------------->",dbName);


  // 5️⃣ Connect COLLEGE DB
  const collegeConn = getCollegeDB(dbName);
  const CollegeUserModel = getCollegeUserModel(collegeConn);
  const CollegeInfoModel = getCollegeInfoModel(collegeConn);

  const collegeInfo = CollegeInfoModel.create({
    collegeCode,
    collegeName,
    registrationNumber,
    officialEmail
  })

  
  // 4️⃣ Save college (ACTIVE)
  const college = await MasterCollegeModel.create({
    collegeName,
    collegeCode,
    officialEmail,
    registrationNumber,
    address,
    contactPersonName,
    contactNumber,
    principalName,
    dbName,
    status: "active"
  });

  // 6️⃣ Create system staffs based on role
  const roles = ["admin", "librarian", "canteen"];
  const credentials = [];

  for (const role of roles) {
    const plainPassword = generatePassword(collegeCode, role);
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const loginId = `${role}@${collegeCode}`;

    await CollegeUserModel.create({
      loginId,
      role,
      collegeCode,
      password: hashedPassword,
      createdBySystem: true
    });
    // console.log(role);

    credentials.push({
      role,
      loginId,
      password: plainPassword // ⚠️ for email only
    });
  }



  // 7️⃣ Send credentials email
  await sendMail({
    to: officialEmail,
    subject: "Smart-Campus System - Login Credentials",
    html: buildCollegeRegistrationMailTemplate(collegeName, credentials),
  });



  // 8️⃣ Send response (email will be added later)
  res.status(201).json(
    new ApiResponse(
      201,
      {
        college,
        credentials,
        collegeInfo
      },
      "College registered and system users created successfully"
    )
  );


});


export const updateCollegeStatus = asyncHandler(async (req, res) => {

  const { collegeId } = req.params;
  const { status } = req.body;

  if (!["active", "inactive"].includes(status)) {
    throw new ApiError(400, "Invalid status value");
  }

  const masterConn = connectMasterDB();
  const College = getCollegeModel(masterConn);

  const college = await College.findById(collegeId);

  if (!college) {
    throw new ApiError(404, "College not found");
  }

  college.status = status;
  await college.save();

  res.status(200).json(
    new ApiResponse(
      200,
      college,
      `College status updated to ${status}`
    )
  );
});


export const updateCollegeDetails = asyncHandler(async (req, res) => {

  const { collegeId } = req.params;
  const updates = req.body;

  const allowedFields = [
    "collegeCode",
    "collegeName",
    "officialEmail",
    "registrationNumber",
    "address",
    "contactPersonName",
    "contactNumber"
  ];

  const updatePayload = {};

  for (const key of allowedFields) {
    if (updates[key] !== undefined) {
      updatePayload[key] = updates[key];
    }
  }

  if (Object.keys(updatePayload).length === 0) {
    throw new ApiError(400, "No valid fields provided for update");
  }

  const masterConn = connectMasterDB();
  const College = getCollegeModel(masterConn);

  const college = await College.findByIdAndUpdate(
    collegeId,
    updatePayload,
    { new: true, runValidators: true }
  );


  if (!college) {
    throw new ApiError(404, "College not found");
  }


  // for now no phot update
  // if (req.file?.path) {
  //   for (const file of req.files) {
  //     const uploadResult = await uploadOnCloudinary(file.path.replace(/\\/g, "/"));
  //     if (!uploadResult?.url) {
  //       throw new ApiError(500, "Document upload failed");
  //     }
  //     documents.push(uploadResult.url);
  //   }
  // }

  res.status(200).json(
    new ApiResponse(200, college, "College details updated successfully")
  );
});

