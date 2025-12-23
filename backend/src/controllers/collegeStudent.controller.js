import bcrypt from "bcrypt";
import { connectMasterDB, getCollegeDB } from "../db/db.index.js";
import { getCollegeModel } from "../models/college.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getStudentModel } from "../models/collegeStudent.model.js"
import { generateAccessAndRefreshTokens } from "../utils/tokenGenerator.js";



export const registerStudent = asyncHandler(async (req, res) => {

  // 1️⃣ Get data from frontend
  const {
    collegeCode,
    studentName,
    rollNo,
    mobileNo,
    email,
    password,
  } = req.body;

  // 2️⃣ Connect MASTER DB
  const masterConn = connectMasterDB();
  const College = getCollegeModel(masterConn);

  // 3️⃣ Find college
  const college = await College.findOne({
    collegeCode,
    status: "active",
  });
  if (!college) {
    throw new ApiError(404, "College not active or not found");
  }


  // 4️⃣ Connect COLLEGE DB
  const collegeConn = getCollegeDB(college.dbName);


  // 5️⃣ Attach Student model to THIS DB
  const CollegeStudent = getStudentModel(collegeConn);



  ////// verification of student with id



  // 6️⃣ Upload avatar (optional)
  const avatarLocalPath = req.file?.path?.replace(/\\/g, "/");
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar File is required!!(local)");
  }
  let avatarUrl = "";
  const avatarUploadResult = await uploadOnCloudinary(avatarLocalPath);
  avatarUrl = avatarUploadResult.url;

  // 7️⃣ Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 8️⃣ Save student in COLLEGE DB
  const student = await CollegeStudent.create({
    studentName,
    rollNo,
    mobileNo,
    email,
    password: hashedPassword,
    avatar: avatarUrl,
  });
 

//// error handling for db fail 
  
  // 9️⃣ Send response
  res.status(201).json(
    new ApiResponse(201, student, "Student registered successfully")
  );

});



export const studentLogin = asyncHandler(async (req, res) => {
  const { collegeCode, mobileNo, email, password } = req.body

  if (!(mobileNo || email)) {
    throw new ApiError(400, "Mobile No. or Email is required!!")
  }

  // 1️⃣ Resolve college
  const masterConn = connectMasterDB();
  const College = getCollegeModel(masterConn);

  const college = await College.findOne({ collegeCode, status: "active" });
  if (!college) {
    throw new ApiError(404, "College not found or inactive");
  }


  // 2️⃣ Connect college DB
  const collegeConn = getCollegeDB(college.dbName);
  const CollegeStudentModel = getStudentModel(collegeConn);

  // 3️⃣ Find staff user
  const student = await CollegeStudentModel.findOne({
    $or: [
      { email },
      { mobileNo }
    ]
  });

  if (!student) {
    throw new ApiError(401, "Invalid credentials");
  }

  // 4️⃣ Verify password
  const isMatch = await bcrypt.compare(password, student.password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid credentials");
  }


  // 5️⃣ Generate tokens
  const { accessToken, refreshToken } =
    await generateAccessAndRefreshTokens({
      userId: student._id,
      role: student.role,
      collegeCode
    });

  // 6️⃣ Save refresh token
  student.refreshToken = refreshToken;
  await student.save({ validateBeforeSave: false });

  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  };

  // 7️⃣ Send response

  const updatedStudent = await CollegeStudentModel.findById(student._id).select("-password -refreshToken")

  res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    })
    .json(
      new ApiResponse(
        200,
        updatedStudent,
        "Login successful"
      )
    );


})