import bcrypt from "bcrypt";
import { connectMasterDB, getCollegeDB } from "../db/db.index.js";
import { getCollegeModel } from "../models/college.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import { getCollegeStudentModel } from "../models/collegeStudent.model.js";
import { generateAccessAndRefreshTokens } from "../utils/tokenGenerator.js";
import { getCollegeUserModel } from "../models/collegeUser.model.js";
import { getLibraryTransactionModel } from "../models/libraryTransaction.model.js";
import { getLibraryBookModel } from "../models/libraryBook.model.js";
import { sendMail } from "../utils/sendMail.js";
import { buildStudentCredentialsMailTemplate } from "../template/buildStudentCredentialsMailTemplate.js";
import { getCollegeDepartmentModel } from "../models/collegeDepartment.model.js";
import { populate } from "dotenv";

const generatePassword = (collegeCode, rollNo) => {

  // generate random 5 character mix
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let randomPart = "";

  for (let i = 0; i < 5; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  const password = `${collegeCode}_${randomPart}_${rollNo}`;

  return password;
};

export const registerStudent = asyncHandler(async (req, res) => {

  console.log(req.user);
  
  const { collegeCode, userId } = req.user;

  const {
    fullName,
    rollNo,
    registrationNo,
    gender,
    dob,
    admissionYear,
    email,
    phone,
    department,
  } = req.body;

  if (!fullName || !rollNo || !gender || !dob || !admissionYear || !email || !phone || !department) {
    return res.status(400).json({ status: "failed", message: "Required fields missing" });
  }

  const masterConn = connectMasterDB();
  const College = getCollegeModel(masterConn);
  const college = await College.findOne({ collegeCode, status: "active" });
  if (!college) return res.status(404).json({ status: "failed", message: "college not found or inactive" });


  const collegeConn = getCollegeDB(college.dbName);
  const Student = getCollegeStudentModel(collegeConn);

  const existing = await Student.findOne({
    $or: [{ rollNo }, { email }, { phone }]
  });

  if (existing) return res.status(409).json({ status: "failed", message: "Student already exists with this email or roll or phone or registerationNo" });

  let profilePhoto = "";
  if (req.file?.path) {
    const upload = await uploadOnCloudinary(req.file.path.replace(/\\/g, "/"));
    profilePhoto = upload.url;
  }

  const password = generatePassword(collegeCode, rollNo)
  const hashedPassword = await bcrypt.hash(password, 10);

  const student = await Student.create({
    ...req.body,
    password: hashedPassword,
    profilePhoto,
    collegeCode,
    loginId: email,
    createdBy: userId
  });

  await sendMail({
    to: email,
    subject: `${college.collegeName} - Student Login Credentials`,
    html: buildStudentCredentialsMailTemplate(
      college.collegeName,
      fullName,
      { loginId: email, password }
    )
  });



  res.status(201).json({
    status: 201,
    student: { fullName, rollNo },
    message: "Student registered successfully"
  });

});

export const studentLogin = asyncHandler(async (req, res) => {

  console.log(req.body);
  

  const { collegeCode, loginId, password } = req.body;

  if (!collegeCode || !loginId || !password) {
    return res.status(400).json({ status: "failed", message: "College code, Login ID and Password are required" });
  }

  // 1️⃣ Resolve college
  const masterConn = connectMasterDB();
  const College = getCollegeModel(masterConn);

  const college = await College.findOne({ collegeCode, status: "active" });
  if (!college) {
    return res.status(404).json({ status: "failed", message: "college not found or inactive" });
  }

  // 2️⃣ Connect college DB
  const collegeConn = getCollegeDB(college.dbName);
  const Student = getCollegeStudentModel(collegeConn);

  // 3️⃣ Find student
  const student = await Student.findOne({ loginId }).select("+password");

  if (!student) {
    return res.status(401).json({ status: "failed", message: "Invalid login credentials" });
  }

  // 4️⃣ Block inactive accounts
  if (!student.isActive) {
    return res.status(404).jso3({ status: "failed", message: "Your account is deactivated. Contact administration" });
  }

  // 5️⃣ Verify password
  const isMatch = await bcrypt.compare(password, student.password);
  if (!isMatch) {
    return res.status(401).json({ status: "failed", message: "Invalid password" });
  }

  // 6️⃣ Generate tokens
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens({
    userId: student._id,
    role: student.role,
    collegeCode,
  });

  // 7️⃣ Save refresh token
  student.refreshToken = refreshToken;
  await student.save({ validateBeforeSave: false });

  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  };
  // const cookieOptions = {
  //   httpOnly: true,
  //   secure: false,
  //   sameSite: "lax",
  //   maxAge: 24 * 60 * 60 * 1000, // 1 day
  // };

  // 8️⃣ Prepare response
  const safeStudent = await Student.findById(student._id).select("-password -refreshToken");

  // 9️⃣ Send response
  res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })
    .json(new ApiResponse(200, safeStudent, "Login successful"));
});

export const currentStudent = asyncHandler(async (req, res) => {
  // verifyJWT middleware should attach 'user' to 'req'

  const { collegeCode, userId } = req.user;

  const masterConn = connectMasterDB();
  const College = getCollegeModel(masterConn);
  const college = await College.findOne({ collegeCode, status: "active" });
  if (!college) throw new ApiError(404, "College not found");

  const collegeConn = getCollegeDB(college.dbName);
  const Student = getCollegeStudentModel(collegeConn);
  const student = await Student.findById(userId).select(
    "-password -refreshToken -resetPasswordOTP -resetPasswordOTPExpiry"
  );

  if (!student) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  // Change 'data' to 'user' to match your React AuthContext expectations
  res.status(200).json(new ApiResponse(200, student, "GOT STUDENT"));
});



export const currentStudentAllDetails = asyncHandler(async (req, res) => {
  // verifyJWT middleware should attach 'user' to 'req'
  console.log("hiiiiiiii");

  const { collegeCode, userId } = req.body;

  console.log(collegeCode, userId);


  const masterConn = connectMasterDB();
  const College = getCollegeModel(masterConn);
  const college = await College.findOne({ collegeCode, status: "active" });
  if (!college) throw new ApiError(404, "College not found");

  const collegeConn = getCollegeDB(college.dbName);
  const Student = getCollegeStudentModel(collegeConn);
  const LibraryTransaction = getLibraryTransactionModel(collegeConn);
  const LibraryBooks = getLibraryBookModel(collegeConn);
  const student = await Student.findById(userId)
  .populate({path:"department"})
  .select(
    "-password -refreshToken -resetPasswordOTP -resetPasswordOTPExpiry"
  );




  const libraryTransaction = await LibraryTransaction.find({
    studentId: userId,
    transactionStatus: "issued",

  })
    .populate({ path: "bookId", select: "title coverImage author category isbn" })
    .select("-qrCode")


  console.log(libraryTransaction);
  if (!student) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  // Change 'data' to 'user' to match your React AuthContext expectations
  res
    .status(200)
    .json(
      {
        student,
        libraryTransaction,
        message: "GOT STUDENT"
      });



});


export const allStudentFetch = asyncHandler(async (req, res) => {
  // verifyJWT middleware should attach 'user' to 'req'
  const { collegeCode } = req.user;

  const masterConn = connectMasterDB();
  const College = getCollegeModel(masterConn);
  const college = await College.findOne({ collegeCode, status: "active" });
  if (!college) throw new ApiError(404, "College not found");

  const collegeConn = getCollegeDB(college.dbName);
  const Department = getCollegeDepartmentModel(collegeConn)
  const Student = getCollegeStudentModel(collegeConn);
  const students = await Student.find()
  .populate({path: "department"})
  .select(
    "-password -refreshToken -resetPasswordOTP -resetPasswordOTPExpiry"
  );

  if (!students) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  // Change 'data' to 'user' to match your React AuthContext expectations


  res.status(200).json({
    students,
    collegeCode,
    message: "Student details fetched"
  })



  // res.status(200).json(new ApiResponse(200, students,collegeCode, "GOT STUDENT"));
});






////////////////////////////////////////////////////////////////////////////////////////////////////
//                                 BULK REGISTRATION OF STUDENT
////////////////////////////////////////////////////////////////////////////////////////////////////
/*-
const generateStudentPassword = (collegeCode, rollNo) => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const random =
    chars[Math.floor(Math.random() * 26)] +
    chars[Math.floor(Math.random() * 26)] +
    chars[Math.floor(Math.random() * 26)] +
    Math.floor(10 + Math.random() * 90);

  return `${collegeCode}_${rollNo}_${random}`;
};

export const bulkRegisterStudents = asyncHandler(async (req, res) => {

  const { students } = req.body;
  if (!Array.isArray(students) || students.length === 0) {
    throw new ApiError(400, "Students array required");
  }

  const masterConn = connectMasterDB();
  const College = getCollegeModel(masterConn);

  const college = await College.findOne({
    collegeCode: students[0].collegeCode,
    status: "active"
  });
  if (!college) throw new ApiError(404, "College not active");

  const collegeConn = getCollegeDB(college.dbName);
  const CollegeStudent = getCollegeStudentModel(collegeConn);

  const results = {
    inserted: 0,
    failed: 0,
    failures: []
  };

  const newStudents = [];

  for (const s of students) {

    const exists = await CollegeStudent.findOne({
      $or: [{ email: s.email }, { rollNo: s.rollNo }, { mobileNo: s.mobileNo }]
    });

    if (exists) {
      results.failed++;
      results.failures.push({ rollNo: s.rollNo, reason: "Duplicate record" });
      continue;
    }

    const plainPassword = generateStudentPassword(s.collegeCode, s.rollNo);
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    newStudents.push({
      ...s,
      password: hashedPassword,
      isActive: true
    });

    // Email sending (async background safe)
    sendStudentCredentialsEmail(s.email, s.rollNo, plainPassword);
    results.inserted++;
  }

  if (newStudents.length > 0) {
    await CollegeStudent.insertMany(newStudents);
  }

  res.status(201).json(
    new ApiResponse(201, results, "Bulk student registration completed")
  );
});
////route
router.post(
  "/students/bulk-register",
  verifyJWT,
  authorizeRoles("admin"),
  bulkRegisterStudents
);

*/
