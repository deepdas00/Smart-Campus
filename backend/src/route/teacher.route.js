import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/authorize.middleware.js";
import { fetchAllTeachers, registerTeacher, singleTeacher, toggleTeacherStatus, updateTeacher } from "../controllers/collegeTeacher.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = express.Router();

//teacher Registration
router.post(
    "/registration",
    verifyJWT,
    authorizeRoles("admin"),
    upload.single("profilePhoto"),
    registerTeacher
)

router.post(
    "/update/:teacherId",
    verifyJWT,
    authorizeRoles("admin"),
    updateTeacher
)

router.get(
    "/:teacherId",
    verifyJWT,
    authorizeRoles("admin","teacher"),
    singleTeacher
)


router.get(
    "/all",
    verifyJWT,
    authorizeRoles("admin"),
    fetchAllTeachers
)


router.post(
    "/status/:teacherId",
    verifyJWT,
    authorizeRoles("admin","teacher"),
    toggleTeacherStatus
)












export default router;
