import bcrypt from "bcrypt";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { connectMasterDB, getCollegeDB } from "../db/db.index.js";
import { getCollegeModel } from "../models/college.model.js";
import { getCollegeUserModel } from "../models/collegeUser.model.js"
import { buildCollegeRegistrationMailTemplate } from "../template/collegeRegistrationMail.template.js"
import { sendCollegeRegistraionMail } from "../utils/sendMail.js"



const generatePassword = (collegeCode, role) => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  const randomLetters = Array.from({ length: 3 }, () =>
    letters.charAt(Math.floor(Math.random() * letters.length))
  ).join("");

  const randomDigits = Math.floor(10 + Math.random() * 90); // 2 digits

  return `${collegeCode}#${randomLetters}${randomDigits}!${role.toUpperCase()}`;
};




export const registerCollege = asyncHandler(async (req, res) => {
  const { collegeName, collegeCode, officialEmail } = req.body;
  // console.log(collegeName,collegeCode);

  if (!collegeName || !collegeCode || !officialEmail) {
    throw new ApiError(400, "College name and code and officialEmail are required");
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
  const dbName = `college_${collegeCode.toLowerCase()}_db`;
  // console.log(dbName);


  // 4️⃣ Save college (PENDING)
  const college = await MasterCollegeModel.create({
    collegeName,
    collegeCode,
    officialEmail,
    dbName,
    status: "active",
  });


  // 5️⃣ Connect COLLEGE DB
  const collegeConn = getCollegeDB(dbName);
  const CollegeUserModel = getCollegeUserModel(collegeConn);
console.log("1");

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
// console.log(credentials);




  // 7️⃣ Send credentials email
  await sendCollegeRegistraionMail({
    to: officialEmail,
    subject: "SmartCollege System - Login Credentials",
    html: buildCollegeRegistrationMailTemplate(collegeName, credentials),
  });
 


  // 8️⃣ Send response (email will be added later)
  res.status(201).json(
    new ApiResponse(
      201,
      {
        college,
        credentials
      },
      "College registered and system users created successfully"
    )
  );


});


