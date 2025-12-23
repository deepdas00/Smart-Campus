import express from "express";
import { registerStudent } from "../controllers/collegeStudent.controller.js";
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

// // Protected student-only APIs (templates)
// router.get(
//   "/profile",
//   verifyJWT,
//   authorizeRoles("student"),
//   (req, res) => {
//     res.json({ message: "Student profile API (TODO)" });
//   }
// );

// router.get(
//   "/complaints",
//   verifyJWT,
//   authorizeRoles("student"),
//   (req, res) => {
//     res.json({ message: "Student complaints API (TODO)" });
//   }
// );

export default router;
