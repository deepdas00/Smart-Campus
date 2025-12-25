import express from "express";
import {  currentStudent, studentLogin } from "../controllers/collegeStudent.controller.js";
import { currentStaff, staffLogin } from "../controllers/collegeStaff.controller.js";
import { refreshAccessToken } from "../controllers/refreshAccessToken.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getStudentModel } from "../models/collegeStudent.model.js";
import { connectMasterDB, getCollegeDB } from "../db/db.index.js";
import jwt from "jsonwebtoken";
import { connect } from "mongoose";
import { getCollegeModel } from "../models/college.model.js";
import { ApiResponse } from "../utils/apiResponse.js";

const router = express.Router();


//Current user find 
router.get("/student/me", verifyJWT, currentStudent);

//Current staff
router.get("/staff/me", verifyJWT, currentStaff);

// LOGIN
router.post("/student/login", studentLogin);
router.post("/staff/login", staffLogin);

// REFRESH TOKEN
router.post("/refresh", refreshAccessToken);

// LOGOUT (future)
 // router.post("/logout", verifyJWT, logout);





export default router;
