import crypto from "crypto";
import bcrypt from "bcrypt";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/apiError.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { connectMasterDB, getCollegeDB } from "../../db/db.index.js";
import { getCollegeModel } from "../../models/college.model.js";
import { getCollegeUserModel } from "../../models/collegeUser.model.js";
import { getCollegeStudentModel } from "../../models/collegeStudent.model.js"
import { sendMail } from "../../utils/sendMail.js";
import { buildForgotPasswordOtpTemplate } from "../../template/forgotPasswordOtpTemplate.js";
import { getCollegeTeacherModel } from "../../models/collegeTeacher.model.js";

///forget password otp send
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
        await getCollegeStudentModel(collegeConn).findOne({ email: loginId }) ||
        await getCollegeTeacherModel(collegeConn).findOne({ loginId });

    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = crypto.randomInt(100000, 999999).toString();

    user.resetPasswordOTP = otp;
    user.resetPasswordOTPExpiry = Date.now() + 10 * 60 * 1000;  //👉 “Set the OTP expiry time to 10 minutes from the current moment.”

    await user.save({ validateBeforeSave: false });

    let userEmail, userName, mobileNumber;
    if (["student", "teacher"].includes(user.role)) {
        userEmail = user.email;
        userName = user.studentName || user.fullName;
        mobileNumber = user.mobileNo || user.phone;
    } else if (["admin", "canteen", "librarian"].includes(user.role)) {
        userEmail = college.officialEmail;
        userName = college.collegeName;
        mobileNumber = college.contactNumber;
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
        await getCollegeStudentModel(collegeConn).findOne({ email: loginId }) ||
        await getCollegeTeacherModel(collegeConn).findOne({ userId: loginId });


    if (!user) return res.status(400).json({ message: "User not found" })
    if (user.resetPasswordOTP !== otp) return res.status(400).json({ message: "Incorrect OTP" })
    if (user.resetPasswordOTPExpiry < Date.now()) return res.status(400).json({ message: "expired OTP" })


    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordOTP = null;
    user.resetPasswordOTPExpiry = null;

    await user.save({ validateBeforeSave: false });

    res.status(200).json(new ApiResponse(200, null, "Password reset successful"));
});


//changing password, verify old password..
export const verifyOldPassword = asyncHandler(async (req, res) => {
    const { collegeCode, role, userId } = req.user
    const { prevPassword } = req.body



    const masterConn = connectMasterDB();
    const College = getCollegeModel(masterConn);

    const college = await College.findOne({ collegeCode, status: "active" });

    if (!college) return res.status(404).json({ message: "College not found" });

    const collegeConn = getCollegeDB(college.dbName);

    let user;
    if (role === "student") {
        user = await getCollegeStudentModel(collegeConn).findById(userId)
    } else if (role === "teacher") {
        user = await getCollegeTeacherModel(collegeConn).findById(userId)
    } else if (["admin", "canteen", "librarian"].includes(role)) {
        user = await getCollegeUserModel(collegeConn).findById(userId)
    }


    
    
    
    if (!user) return res.status(404).json({ message: "User not found" });
    
    console.log(user.password);
    // 4️⃣ Verify password
    const isMatch = await bcrypt.compare(prevPassword, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: "Wrong Password!!" });
    }

    const otp = crypto.randomInt(100000, 999999).toString();

    user.resetPasswordOTP = otp;
    user.resetPasswordOTPExpiry = Date.now() + 10 * 60 * 1000;  //👉 “Set the OTP expiry time to 10 minutes from the current moment.”

    await user.save({ validateBeforeSave: false });



    return res.status(201).json({ matchCase: `${otp}`, message: "Password Verify Successfully..." })
})

// change with new password
export const changePassword = asyncHandler(async (req, res) => {
    const { collegeCode, role, userId } = req.user
    const { newPassword, matchCase } = req.body


    const masterConn = connectMasterDB();
    const College = getCollegeModel(masterConn);

    const college = await College.findOne({ collegeCode, status: "active" });

    if (!college) return res.status(404).json({ message: "College not found" });

    const collegeConn = getCollegeDB(college.dbName);

    let user;
    if (role === "student") {
        user = await getCollegeStudentModel(collegeConn).findById(userId)
    } else if (role === "teacher") {
        user = await getCollegeTeacherModel(collegeConn).findById(userId)
    } else if (["admin", "canteen", "librarian"].includes(role)) {
        user = await getCollegeUserModel(collegeConn).findById(userId)
    }

    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.resetPasswordOTP !== matchCase) return res.status(400).json({ message: "Verification Faild, Wrong Access!!!!" })
    if (user.resetPasswordOTPExpiry < Date.now()) return res.status(400).json({ message: "Password Changing time Expired" })

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordOTP = null;
    user.resetPasswordOTPExpiry = null;

    await user.save({ validateBeforeSave: false });

    return res.status(201).json({ message: "Password Changed Successfully..." })
})
