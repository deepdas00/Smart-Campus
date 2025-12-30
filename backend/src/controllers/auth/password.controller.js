import crypto from "crypto";
import bcrypt from "bcrypt";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/apiError.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { connectMasterDB, getCollegeDB } from "../../db/db.index.js";
import { getCollegeModel } from "../../models/college.model.js";
import { getCollegeUserModel } from "../../models/collegeUser.model.js";
import { getStudentModel } from "../../models/collegeStudent.model.js"
import { sendMail } from "../../utils/sendMail.js";
import { buildForgotPasswordOtpTemplate } from "../../template/forgotPasswordOtpTemplate.js";

///forget pasword otp send
export const forgotPasswordSendOTP = asyncHandler(async (req, res) => {

    // as user is not logged in so we can not get this data from (res.user)
    const { collegeCode, loginId } = req.body;

    if (!collegeCode || !loginId) {
        return res.status(400).json({ message: "login ID are required" })
    }

    const masterConn = connectMasterDB();
    const College = getCollegeModel(masterConn);

    const college = await College.findOne({ collegeCode, status: "active" });

    if (!college) return res.status(404).json({ message: "College not found" });

    const collegeConn = getCollegeDB(college.dbName);

    let user =
        await getCollegeUserModel(collegeConn).findOne({ loginId }) ||
        await getStudentModel(collegeConn).findOne({ email: loginId });

    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = crypto.randomInt(100000, 999999).toString();

    user.resetPasswordOTP = otp;
    user.resetPasswordOTPExpiry = Date.now() + 10 * 60 * 1000;  //👉 “Set the OTP expiry time to 10 minutes from the current moment.”

    await user.save({ validateBeforeSave: false });

    let userEmail,userName;
    if (user.role === "student") {
        userEmail = user.email;
        userName = user.studentName;
    } else if (["admin", "canteen", "librarian"].includes(user.role)) {
        userEmail = college.officialEmail;
        userName = college.collegeName;
    }

    // 7️⃣ Send credentials email
    await sendMail({
        to: userEmail,
        subject: "Smart-Campus System - Login Credentials",
        html: buildForgotPasswordOtpTemplate(userName, otp),
    });

    res.status(200).json(new ApiResponse(200, null, "OTP sent successfully"));
});






// forget password  otp verify and change password and save 
export const forgotPasswordVerifyOTP = asyncHandler(async (req, res) => {

    const { collegeCode, loginId, otp, newPassword } = req.body;

    const masterConn = connectMasterDB();
    const College = getCollegeModel(masterConn);

    const college = await College.findOne({ collegeCode, status: "active" });
    if (!college) throw new ApiError(404, "College not found");

    const collegeConn = getCollegeDB(college.dbName);

    let user =
        await getCollegeUserModel(collegeConn).findOne({ loginId }) ||
        await getStudentModel(collegeConn).findOne({ email: loginId });

    if (!user) res.status(400).json({message:"User not found"})
    if (user.resetPasswordOTP !== otp) res.status(400).json({message:"Incorrect OTP"})
    if (user.resetPasswordOTPExpiry < Date.now()) res.status(400).json({message:"expired OTP"})
    

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordOTP = null;
    user.resetPasswordOTPExpiry = null;

    await user.save();

    res.status(200).json(new ApiResponse(200, null, "Password reset successful"));
});
