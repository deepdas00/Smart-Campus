import express from "express";
import { studentLogin } from "../controllers/collegeStudent.controller.js";
import { staffLogin } from "../controllers/collegeStaff.controller.js";
import { refreshAccessToken } from "../controllers/refreshAccessToken.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

// LOGIN
router.post("/student/login", studentLogin);
router.post("/staff/login", staffLogin);

// REFRESH TOKEN
router.post("/refresh", refreshAccessToken);

// LOGOUT (future)
 // router.post("/logout", verifyJWT, logout);

export default router;
