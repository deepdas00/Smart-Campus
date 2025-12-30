import express from "express";
import { allStudentFetch, currentStudent, registerStudent } from "../controllers/collegeStudent.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/authorize.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

// Registration (public)
router.post(
  "/register",
  upload.single("avatar"),
  registerStudent
);

// one student details fetch
router.get(
  "/profile",
  verifyJWT,
  authorizeRoles("student","admin"),
  currentStudent
);


// all students details fetch
router.get(
  "/allStudent",
  verifyJWT,
  authorizeRoles("admin"),
  allStudentFetch
)

export default router;
