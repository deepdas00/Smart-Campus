import bcrypt from "bcrypt";
import { connectMasterDB, getCollegeDB } from "../db/db.index.js";
import { getCollegeModel } from "../models/college.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import { getStudentModel } from "../models/collegeStudent.model.js";
import { generateAccessAndRefreshTokens } from "../utils/tokenGenerator.js";
import { getCollegeUserModel } from "../models/collegeUser.model.js";
import { getLibraryTransactionModel } from "../models/libraryTransaction.model.js";
import { getLibraryBookModel } from "../models/libraryBook.model.js";

export const registerStudent = asyncHandler(async (req, res) => {
  // 1️⃣ Get data from frontend
  const {
    collegeCode,
    studentName,
    rollNo,
    mobileNo,
    email,
    password,
    department,
    admissionYear,
  } = req.body;



  if(!collegeCode ||
     !studentName ||
     !rollNo ||
     !mobileNo ||
     !email ||
     !password ||
     !department ||
     !admissionYear
  ) { return res.status(400).json({ message: "All fields are required" }); }


  // 2️⃣ Connect MASTER DB
  const masterConn = connectMasterDB();
  const College = getCollegeModel(masterConn);

  // 3️⃣ Find college
  const college = await College.findOne({
    collegeCode,
    status: "active",
  });
  if (!college) {
    return res.status(404).json({ message: "College not active or not found" })

  }

  // 4️⃣ Connect COLLEGE DB
  const collegeConn = getCollegeDB(college.dbName);

  // 5️⃣ Attach Student model to THIS DB
  const CollegeStudent = getStudentModel(collegeConn);

  const existingStudent = await CollegeStudent.findOne({
    $or: [
      { email },
      { mobileNo },
      { rollNo }
    ]
  });

  if (existingStudent) {
    return res.status(409).json({ message: "student already exist with this Email or MobileNo. or RollNo" })
  }



  // 6️⃣ Upload avatar (optional)
  const avatarLocalPath = req.file?.path?.replace(/\\/g, "/");
  if (!avatarLocalPath) {
    return res.status(400).json({ message: "Avatar File is required!!(local)" })
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
    department,
    admissionYear,
  });

  // 9️⃣ Generate tokens using your existing util
  const { accessToken, refreshToken } =
    await generateAccessAndRefreshTokens({
      userId: student._id,
      role: "student",
      collegeCode
    });

  // 🍪 Cookie options
  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "strict"
  };



  // 🔟 Send cookies + response
  return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        201,
        {
          student
        },
        "Student registered & logged in successfully"
      )
    );
});

export const studentLogin = asyncHandler(async (req, res) => {
  const { collegeCode, mobileNo, email, password } = req.body;

  console.log(req.body);

  if (!collegeCode) {
    return res.status(400).json({ message: "Select College!!" });
  } else if (!(mobileNo || email)) {
    return res.status(400).json({ message: "Mobile No. or Email is required!!" });
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
  const Student = getStudentModel(collegeConn);

  // 3️⃣ Find staff user
  const student = await Student.findOne({
    $or: [{ email }, { mobileNo }],
  });

  if (!student) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // 4️⃣ Verify password
  const isMatch = await bcrypt.compare(password, student.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid Password!!" });
  }

  // 5️⃣ Generate tokens
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens({
    userId: student._id,
    role: student.role,
    collegeCode,
  });

  // console.log(" GENERATION SUCCESSFULL", accessToken, refreshToken);

  // 6️⃣ Save refresh token
  student.refreshToken = refreshToken;
  await student.save({ validateBeforeSave: false });

  const cookieOptions = {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  };

  // 7️⃣ Send response

  const updatedStudent = await Student.findById(student._id).select(
    "-password -refreshToken"
  );

  res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })
    .json(new ApiResponse(200, updatedStudent, "Login successful"));
});

export const currentStudent = asyncHandler(async (req, res) => {
  // verifyJWT middleware should attach 'user' to 'req'

  const { collegeCode, userId } = req.user;

  const masterConn = connectMasterDB();
  const College = getCollegeModel(masterConn);
  const college = await College.findOne({ collegeCode, status: "active" });
  if (!college) throw new ApiError(404, "College not found");

  const collegeConn = getCollegeDB(college.dbName);
  const Student = getStudentModel(collegeConn);
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
  const Student = getStudentModel(collegeConn);
  const LibraryTransaction = getLibraryTransactionModel(collegeConn);
  const LibraryBooks = getLibraryBookModel(collegeConn);
  const student = await Student.findById(userId).select(
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
  const Student = getStudentModel(collegeConn);
  const students = await Student.find().select(
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
  const CollegeStudent = getStudentModel(collegeConn);

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
