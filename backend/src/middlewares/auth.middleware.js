import jwt from "jsonwebtoken";
import { ApiError } from "../utils/apiError.js";
import { connectMasterDB, getCollegeDB } from "../db/db.index.js";
import { getCollegeModel } from "../models/college.model.js";
import { getCollegeStudentModel } from "../models/collegeStudent.model.js";
import { getCollegeTeacherModel } from "../models/collegeTeacher.model.js";

export const verifyJWT = async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace(/^Bearer\s+/i, "") ||
    req.cookies?.platformAccessToken;
 
    
   
    

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized: No token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;


    

    const { role, collegeCode, userId } = decoded;

    if(["admin","canteen","librarian"].includes(role)) return next();
    // Resolve College
    const masterConn = connectMasterDB();
    const College = getCollegeModel(masterConn);
    const college = await College.findOne({ collegeCode, status: "active" });

    if (!college) {
      return res
        .status(403)
        .json({ message: "College is inactive or not found" });
    }

    //  Connect College DB
    const collegeConn = getCollegeDB(college.dbName);

    let account;

    if (["admin", "librarian", "canteen"].includes(role)) {
      return next();
    } 


    //  Check account status by role
    if (role === "student") {
      const Student = getCollegeStudentModel(collegeConn);
      account = await Student.findById(userId).select("isActive");
    }

    if (role === "teacher") {
      const Teacher = getCollegeTeacherModel(collegeConn);
      account = await Teacher.findById(userId).select("isActive");
    }

    if (!account) {
      return res.status(401).json({ message: "Account not found" });
    }

    if (!account.isActive) {
      return res
        .status(403)
        .json({ message: "Your account is deactivated. Contact admin." });
    }

    next();
  } catch (error) {
    throw new ApiError(401, "Invalid or expired token");
  }
};
