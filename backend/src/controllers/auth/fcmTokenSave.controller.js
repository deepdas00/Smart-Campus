import { getCollegeStudentModel } from "../../models/collegeStudent.model.js";
import { connectMasterDB, getCollegeDB } from "../../db/db.index.js";
import { ApiError } from "../../utils/apiError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { getCollegeModel } from "../../models/college.model.js";

export const saveFcmToken = asyncHandler(async (req, res) => {
  const { token } = req.body;
  const { userId, collegeCode } = req.user;
  
  if (!token) {
    return res.status(400).json({ message: "FCM token required" });
  }
  
  const masterConn = connectMasterDB();
  const College = getCollegeModel(masterConn);
  
  const college = await College.findOne({ collegeCode, status: "active" });
  console.log("///////Student tokennnnn///////",college);
  if (!college) throw new ApiError(404, "College not found");

  const collegeConn = getCollegeDB(college.dbName);
  const Student = getCollegeStudentModel(collegeConn);

  await Student.findByIdAndUpdate(userId, { fcmToken: token });

  res.status(200).json({ message: "FCM token saved" });
});
