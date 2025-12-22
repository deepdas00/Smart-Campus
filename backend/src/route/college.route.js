import express from "express";
import { registerCollege } from "../controllers/collegeRegistration.controller.js";
import { getAllColleges } from "../controllers/collegeDataFetch.controller.js";


const router = express.Router();

// Public (request-based registration)
router.route("/register").post(registerCollege);

// Internal / frontend usage
router.route("/data").post(getAllColleges);

export default router;


