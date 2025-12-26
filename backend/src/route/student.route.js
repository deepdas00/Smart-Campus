import express from "express";
import { currentStudent, registerStudent } from "../controllers/collegeStudent.controller.js";
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

// Protected student-only APIs (templates)
router.get(
  "/profile",
  verifyJWT,
  authorizeRoles("student"),
  currentStudent
);


export default router;
