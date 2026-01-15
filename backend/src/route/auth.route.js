import express from "express";
import {  currentStudent, studentLogin } from "../controllers/collegeStudent.controller.js";
import { currentStaff, staffLogin } from "../controllers/collegeStaff.controller.js";
import { refreshAccessToken } from "../controllers/refreshAccessToken.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { logoutUser } from "../controllers/logout.controller.js";
import { teacherLogin } from "../controllers/collegeTeacher.controller.js";
import { changePassword, verifyOldPassword } from "../controllers/auth/password.controller.js";
import { removeFcmToken, saveFcmToken } from "../controllers/auth/fcmTokenSave.controller.js";

const router = express.Router();



//Current staff
router.get("/staff/me", verifyJWT, currentStaff);
router.get("/student/me", verifyJWT, currentStudent);




// LOGIN
router.post("/student/login", studentLogin);
router.post("/staff/login", staffLogin);
router.post("/teacher/login", teacherLogin);


//fcm-toen-save for notification
router.post("/save-fcm-token",verifyJWT, saveFcmToken);
router.post("/delete-fcm-token",verifyJWT, removeFcmToken);


// REFRESH TOKEN
router.post("/refresh", refreshAccessToken);
// LOGOUT (future)
 router.post("/logout", verifyJWT, logoutUser);


//CHANGE PASSWORD
//verifyold password
router.post(
    "/reset-password-verify",
    verifyJWT,
    verifyOldPassword
)
//change with new pass
router.post(
    "/reset-password-new",
    verifyJWT,
    changePassword
)



export default router;
