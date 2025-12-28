import express from "express";
import { registerCollege, updateCollegeDetails, updateCollegeStatus } from "../controllers/college.controller.js";
import { getAllColleges, getAllCollegesFullDetails } from "../controllers/collegeDataFetch.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/authorize.middleware.js";


const router = express.Router();

// College Registration for (ADMIN OFFICIAL)
router.route("/register")
    .post(
        verifyJWT,
        authorizeRoles("officialAdmin"),
        registerCollege
    );

    
    //fetch all college full data for ADMIN OFFICIAL Use
    router.route("/fetchCollgeData")
    .get(
        verifyJWT,
        authorizeRoles("officialAdmin"),
        getAllCollegesFullDetails
    );
    
    
    //inActive or active ADMIN OFFICIAL
    router.route("/satusUpdate")
    .post(
        verifyJWT,
        authorizeRoles("officialAdmin"),
        updateCollegeStatus
    );


    //clg details update ADMIN OFFICIAL
    router.route("/update")
    .post(
        verifyJWT,
        authorizeRoles("officialAdmin"),
        updateCollegeDetails
    );
    
    
    // Internal / frontend usage public 
    router.route("/data").get(getAllColleges);


export default router;


