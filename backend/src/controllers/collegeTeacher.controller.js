import bcrypt from "bcrypt";
import { connectMasterDB, getCollegeDB } from "../db/db.index.js";
import { getCollegeModel } from "../models/college.model.js";
import { getCollegeTeacherModel } from "../models/collegeTeacher.model.js";
import { buildTeacherCredentialsMailTemplate } from "../template/buildTeacherCredentialsMailTemplate.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { sendMail } from "../utils/sendMail.js";
import { generateAccessAndRefreshTokens } from "../utils/tokenGenerator.js";

const generateTeacherCredentials = (teacherName, collegeCode, teacherCode) => {
  // sanitize teacher name

  const safeName = teacherName.toLowerCase().replace(/\s+/g, "");

  // generate random 5 character mix
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let randomPart = "";

  for (let i = 0; i < 5; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  const loginId = `${collegeCode}_${teacherCode}`;
  const password = `${teacherCode}_${randomPart}`;

  return { loginId, password };
};

// ===========================
// 🧾 Register / Create Teacher
// ===========================
export const registerTeacher = asyncHandler(async (req, res) => {
  const { collegeCode, userId } = req.user;

  const {
    teacherCode,
    employeeId,
    fullName,
    gender,
    dob,
    email,
    phone,
    alternatePhone,
    address,
    department,
    designation,
    qualification,
    specialization,
    experienceYears,
    joiningDate,
    employmentType,
    subjects, // select the id from dropdown!! from fronnt end
    salary,
    bankDetails,
    totalLeaves,
  } = req.body;

  if (
    !teacherCode ||
    !employeeId ||
    !fullName ||
    !gender ||
    !email ||
    !phone ||
    !department ||
    !designation ||
    !joiningDate
  ) {
    return res
      .status(400)
      .json({ message: "please fill all the required fields!!" });
  }

  // 2️⃣ Connect MASTER DB
  const masterConn = connectMasterDB();
  const College = getCollegeModel(masterConn);

  // 3️⃣ Find college
  // const college = await College.findOne({
  //   collegeCode,
  //   status: "active",
  // });
  // if (!college) {
  //   return res.status(404).json({ message: "College not active or not found" });
  // }

  // // 4️⃣ Connect COLLEGE DB
  // const collegeConn = getCollegeDB(college.dbName);

  // // 5️⃣ Attach Student model to THIS DB
  // const Teacher = getCollegeTeacherModel(collegeConn);

  // const existingTeacher = await Teacher.findOne({
  //   $or: [{ teacherCode }, { employeeId }],
  // });
  // if (existingTeacher)
  //   return res
  //     .status(409)
  //     .json({
  //       message: `Teacher already exist with ${teacherCode} or ${employeeId}`,
  //     });

  // //upload profile pic into cloudinary
  // let profilePicUrl = "";
  // if (req.file?.path) {
  //   const profilePicPath = req.file?.path?.replace(/\\/g, "/");
  //   const uploadResult = await uploadOnCloudinary(profilePicPath);
  //   profilePicUrl = uploadResult.url;
  // }

  // const { loginId, password } = generateTeacherCredentials(
  //   fullName,
  //   collegeCode,
  //   teacherCode
  // );

  // // 7️⃣ Hash password
  // const hashedPassword = await bcrypt.hash(password, 10);

  // createdBy
  //collegeCode
  // profilePhoto

  const addressObj = req.body.address ? JSON.parse(req.body.address) : {};
  const salaryObj = req.body.salary ? JSON.parse(req.body.salary) : {};
  const bankDetailsObj = req.body.bankDetails
    ? JSON.parse(req.body.bankDetails)
    : {};
  const specializationArr = req.body.specialization
    ? JSON.parse(req.body.specialization)
    : [];



  // const teacher = await Teacher.create({
  //   teacherCode,
  //   employeeId,
  //   fullName,
  //   gender,
  //   dob,
  //   email,
  //   phone,
  //   alternatePhone,
  //   address: addressObj,
  //   department,
  //   designation,
  //   qualification,
  //   specialization: specializationArr,
  //   experienceYears,
  //   joiningDate,
  //   employmentType,
  //   subjects, // select the id from dropdown!! from fronnt end
  //   salary: salaryObj,
  //   bankDetails: bankDetailsObj,
  //   totalLeaves,
  //   loginId,
  //   password: hashedPassword,
  //   profilePhoto: profilePicUrl,
  //   collegeCode,
  //   createdBy: userId,
  // });

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
  const Teacher = getCollegeTeacherModel(collegeConn);

  const existingTeacher = await Teacher.findOne({
    $or: [
      { teacherCode },
      { employeeId }
    ]
  });
  if (existingTeacher) return res.status(409).json({ message: `Teacher already exist with ${teacherCode} or ${employeeId}` })

  //upload profile pic into cloudinary
  let profilePicUrl = "";
  if (req.file?.path) {
    const profilePicPath = req.file?.path?.replace(/\\/g, "/");
    const uploadResult = await uploadOnCloudinary(profilePicPath);
    profilePicUrl = uploadResult.url;
  }

  const { loginId, password } = generateTeacherCredentials(fullName, collegeCode, teacherCode)

  // 7️⃣ Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // ✅ Required fields list
  const requiredFields = {
    teacherCode,
    employeeId,
    fullName,
    gender,
    email,
    phone,
    designation,
    joiningDate,
    loginId,
    password: hashedPassword,
    collegeCode
  };

  // ✅ Check if any required field is missing
  const missingFields = Object.entries(requiredFields)
    .filter(([key, value]) => !value || value === "")
    .map(([key]) => key);

  if (missingFields.length > 0) {
    return res.status(401).json({ message: `Missing required fields: ${missingFields.join(", ")}` })
  }
  const teacher = await Teacher.create({
    teacherCode,
    employeeId,
    fullName,
    gender,
    dob,
    email,
    phone,
    alternatePhone,
    address: addressObj,
    department,
    designation,
    qualification,
    specialization: specializationArr,
    experienceYears,
    joiningDate,
    employmentType,
    subjects, // select the id from dropdown!! from fronnt end
    salary: salaryObj,
    bankDetails: bankDetailsObj,
    totalLeaves,
    loginId,
    password: hashedPassword,
    profilePhoto: profilePicUrl,
    collegeCode,
    createdBy: userId,
  });


  await sendMail({
    to: email,
    subject: `${college.collegeName} - Your Teacher Login Credentials`,
    html: buildTeacherCredentialsMailTemplate(
      college.collegeName,
      fullName,
      { loginId, password }
    )
  });


  return res
    .status(200)
    .json({ fullName, message: "Teacher register successfully" });

});



export const teacherLogin = asyncHandler(async (req, res) => {
  // const { collegeCode, loginId, password } = req.body;

  const { collegeCode, loginId, password } = req.body
  if (!collegeCode || !loginId || !password) {
    return res
      .status(400)
      .json({ message: "CollegeCode, UserId & Password Required" });
  }

  // 2️⃣ Connect MASTER DB
  const masterConn = connectMasterDB();
  const College = getCollegeModel(masterConn);

  if (!collegeCode || !loginId || !password) { return res.status(400).json({ message: "CollegeCode, loginId & Password Required" }); }
  // 3️⃣ Find college
  const college = await College.findOne({
    collegeCode,
    status: "active",
  });
  if (!college) {
    return res.status(404).json({ message: "College not active or not found" });
  }

  // 4️⃣ Connect COLLEGE DB
  const collegeConn = getCollegeDB(college.dbName);

  // 5️⃣ Attach Student model to THIS DB
  const Teacher = getCollegeTeacherModel(collegeConn);
  const teacher = await Teacher.findOne(loginId);


  if (!teacher) {
    return res.status(401).json({ message: "Invalid LoginId" });
  }

  if (!teacher.isActive) {
    return res
      .status(403)
      .json({ message: "Your account is deactivated. Please contact admin." });
  }

  // 4️⃣ Verify password
  const isMatch = await bcrypt.compare(password, teacher.password);


  if (!isMatch) {
    return res.status(401).json({ message: "Invalid Password!!" });
  }

  // 5️⃣ Generate tokens
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens({
    userId: teacher._id,
    role: teacher.role,
    collegeCode,
  });

  // 6️⃣ Save refresh token
  teacher.refreshToken = refreshToken;
  await teacher.save({ validateBeforeSave: false });

  const cookieOptions = {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  };

  // 7️⃣ Send response

  const updatedTeacher = await Teacher.findById(teacher._id).select(
    "teacherCode employeeId fullName profilePhoto role isActive collegeCode"
  );

  res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })
    .json(new ApiResponse(200, updatedTeacher, "Login successful"));
});

export const updateTeacher = asyncHandler(async (req, res) => {
  const { collegeCode } = req.user;
  const { teacherId } = req.params;

  // Resolve College
  const masterConn = connectMasterDB();
  const College = getCollegeModel(masterConn);
  const college = await College.findOne({ collegeCode, status: "active" });
  if (!college) return res.status(404).json({ message: "College not found" });

  // Connect College DB
  const collegeConn = getCollegeDB(college.dbName);
  const Teacher = getCollegeTeacherModel(collegeConn);

  const updatedTeacher = await Teacher.findByIdAndUpdate(teacherId, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedTeacher) {
    return res.status(404).json({ message: "Teacher not found" });
  }

  res.status(200).json({
    message: "Teacher updated successfully",
    data: updatedTeacher,
  });
});

export const singleTeacher = asyncHandler(async (req, res) => {
  console.log("ihihihihih");

  const { collegeCode } = req.user;

  const { teacherId } = req.params;
  console.log(teacherId);

  const masterConn = connectMasterDB();
  const College = getCollegeModel(masterConn);
  const college = await College.findOne({ collegeCode, status: "active" });
  if (!college) return res.status(404).json({ message: "College not found" });

  const collegeConn = getCollegeDB(college.dbName);
  const Teacher = getCollegeTeacherModel(collegeConn);

  const teacher = await Teacher.findById(teacherId)
    .select("-password -refreshToken")
    .populate("department");

  if (!teacher) return res.status(404).json({ message: "Teacher not found" });

  res.status(200).json({ data: teacher });
});

export const fetchAllTeachers = asyncHandler(async (req, res) => {
  console.log("huuhhuhu");

  const { collegeCode } = req.user;

  const masterConn = connectMasterDB();
  const College = getCollegeModel(masterConn);
  const college = await College.findOne({ collegeCode, status: "active" });

  if (!college) return res.status(404).json({ message: "College not found" });

  const collegeConn = getCollegeDB(college.dbName);
  const Teacher = getCollegeTeacherModel(collegeConn);

  console.log(Teacher);

  console.log("bye");
  const teachers = await Teacher.find()
    .select("-password -refreshToken")
    .populate("department");

  res.status(200).json({
    total: teachers.length,
    data: teachers,
  });
});

export const toggleTeacherStatus = asyncHandler(async (req, res) => {

  const { collegeCode } = req.user;

  const { teacherId } = req.params;

  const masterConn = connectMasterDB();
  const College = getCollegeModel(masterConn);
  const college = await College.findOne({ collegeCode, status: "active" });
  if (!college) return res.status(404).json({ message: "College not found" });

  const collegeConn = getCollegeDB(college.dbName);
  const Teacher = getCollegeTeacherModel(collegeConn);

  const teacher = await Teacher.findById(teacherId);
  if (!teacher) return res.status(404).json({ message: "Teacher not found" });

  teacher.isActive = !teacher.isActive;
  await teacher.save({ validateBeforeSave: false });

  res.status(200).json({
    message: `Teacher is now ${teacher.isActive ? "Active" : "Inactive"}`,
    status: teacher.isActive
  });
});
