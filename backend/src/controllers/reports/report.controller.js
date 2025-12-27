import { connectMasterDB, getCollegeDB } from "../../db/db.index.js";
import { getCollegeModel } from "../../models/college.model.js";
import { getReportModel } from "../../models/report.model.js";
import { uploadOnCloudinary } from "../../utils/cloudinary.js";
import { ApiError } from "../../utils/apiError.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { generateTransactionCode } from "../../utils/generateTransactionCode.js";

/* =========================
   CREATE REPORT (Student)
========================= */

export const createReport = asyncHandler(async (req, res) => {

    const { collegeCode, userId } = req.user;
    const { title, description, category, location } = req.body;

    if (!title || !description || !category) {
        throw new ApiError(400, "Required fields missing");
    }

    // Resolve college
    const masterConn = connectMasterDB();
    const College = getCollegeModel(masterConn);

    const college = await College.findOne({ collegeCode, status: "active" });
    if (!college) throw new ApiError(404, "College not found");

    const collegeConn = getCollegeDB(college.dbName);
    const Report = getReportModel(collegeConn);

    // Upload images

    const coverPath = req.file?.path?.replace(/\\/g, "/");
    if (!coverPath) throw new ApiError(400, "Book cover image required");
    const imageUrl = await uploadOnCloudinary(coverPath);





    const reportCode = await generateTransactionCode(collegeCode, "RPT", Report);

    const report = await Report.create({
        reportCode,
        studentId: userId,
        title,
        description,
        category,
        location,
        image: imageUrl
    });

    res.status(201).json(
        new ApiResponse(201, report, "Report submitted successfully")
    );
});


/* =========================
   STUDENT REPORT LIST
========================= */

export const getMyReports = asyncHandler(async (req, res) => {

    const { collegeCode, userId } = req.user;

    const masterConn = connectMasterDB();
    const College = getCollegeModel(masterConn);

    const college = await College.findOne({ collegeCode, status: "active" });
    if (!college) throw new ApiError(404, "College not found");

    const collegeConn = getCollegeDB(college.dbName);
    const Report = getReportModel(collegeConn);

    const reports = await Report.find({ studentId: userId }).sort({ createdAt: -1 });

    res.status(200).json(
        new ApiResponse(200, reports, "Reports fetched successfully")
    );
});


/* =========================
   ADMIN REPORT LIST (FOR INDEX)
========================= */

export const getAllReports = asyncHandler(async (req, res) => {

    const { collegeCode } = req.user;

    const masterConn = connectMasterDB();
    const College = getCollegeModel(masterConn);

    const college = await College.findOne({ collegeCode, status: "active" });
    if (!college) throw new ApiError(404, "College not found");

    const collegeConn = getCollegeDB(college.dbName);
    const Report = getReportModel(collegeConn);

    const reports = await Report.find().sort({ createdAt: -1 });

    res.status(200).json(
        new ApiResponse(200, reports, "All reports fetched")
    );
});


/* =========================
   ADMIN UPDATE STATUS
========================= */

export const updateReportStatus = asyncHandler(async (req, res) => {

    const { reportId } = req.params;
    const { status, adminNote, assignedAdmin } = req.body;
    const { collegeCode } = req.user;

    const allowedStatus = ["viewed", "in_progress", "resolved", "rejected"];

    if (!allowedStatus.includes(status)) {
        throw new ApiError(400, "Invalid status value");
    }

    const masterConn = connectMasterDB();
    const College = getCollegeModel(masterConn);

    const college = await College.findOne({ collegeCode, status: "active" });
    if (!college) throw new ApiError(404, "College not found");

    const collegeConn = getCollegeDB(college.dbName);
    const Report = getReportModel(collegeConn);

    const report = await Report.findById(reportId);
    if (!report) throw new ApiError(404, "Report not found");

    report.status = status;
    if (adminNote) report.adminNote = adminNote;
    if (assignedAdmin) report.assignedAdmin = assignedAdmin;

    console.log(report.status);//////////////////////////////////////////////////////////////////////////////////////for testing
    
    

    await report.save();

    res.status(200).json(
        new ApiResponse(200, report, "Report updated successfully")
    );
});


/* =========================
   STUDENT SUBMIT RATING
========================= */

export const submitRating = asyncHandler(async (req, res) => {

    const { reportId } = req.params;
    const { rating } = req.body;
    const { collegeCode, userId } = req.user;

    if (!rating || rating < 1 || rating > 5) {
        throw new ApiError(400, "Invalid rating");
    }

    const masterConn = connectMasterDB();
    const College = getCollegeModel(masterConn);

    const college = await College.findOne({ collegeCode, status: "active" });
    if (!college) throw new ApiError(404, "College not found");

    const collegeConn = getCollegeDB(college.dbName);
    const Report = getReportModel(collegeConn);

    const report = await Report.findOne({ _id: reportId, studentId: userId });

    if (!report) throw new ApiError(404, "Report not found");

    if (report.status !== "resolved") {
        throw new ApiError(400, "Report not yet resolved");
    }

    report.rating = rating;
    report.status = "closed";

    await report.save();

    res.status(200).json(
        new ApiResponse(200, report, "Thank you for your feedback")
    );
});
