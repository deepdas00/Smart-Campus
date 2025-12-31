import { connectMasterDB, getCollegeDB } from "../../db/db.index.js";
import { getCollegeModel } from "../../models/college.model.js";
import { getReportModel } from "../../models/report.model.js";
import { uploadOnCloudinary } from "../../utils/cloudinary.js";
import { ApiError } from "../../utils/apiError.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { generateTransactionCode } from "../../utils/generateTransactionCode.js";
import { getStudentModel } from "../../models/collegeStudent.model.js";

/* =========================
   CREATE REPORT (Student)
========================= */

export const createReport = asyncHandler(async (req, res) => {

    const { collegeCode, userId } = req.user;
    const { building, room, title, description, zone, category,  priority } = req.body;


    if (!title || !description || !category) {
        return res.status(400).json({ message: "Required fields missing" });
    }

    // Resolve college
    const masterConn = connectMasterDB();
    const College = getCollegeModel(masterConn);

    const college = await College.findOne({ collegeCode, status: "active" });
    if (!college) return res.status(404).json({ message: "College not found" });

    const collegeConn = getCollegeDB(college.dbName);
    const Report = getReportModel(collegeConn);

    // Upload images

    let imageUrl;
    console.log(req.file);
    
    if (req.file?.path) {
        const coverPath = req.file?.path.replace(/\\/g, "/");
        try {
            imageUrl = await uploadOnCloudinary(coverPath);
            console.log("IMGAAAGAGGA", imageUrl);
            
        } catch (err) {
            return res.status(500).json({ message: "Failed to upload book cover image" });
        }

    }


    const transactionCode = await generateTransactionCode(collegeCode, "RPT", Report);






    console.log("TRARARARA", transactionCode);
    

    const report = await Report.create({
        transactionCode : transactionCode,
        studentId: userId,
        title,
        description,
        category,
        image: imageUrl?.url,
        priority,
        building,
        room,
        zone
    });

    

    res.status(201).json(
        new ApiResponse(201, report, "Report submitted successfully")
    );
});


/* =========================
   STUDENT REPORT LIST
========================= */

export const getMyReports = asyncHandler(async (req, res) => {

    const { collegeCode, userId } = req.body || req.user;

    const masterConn = connectMasterDB();
    const College = getCollegeModel(masterConn);

    const college = await College.findOne({ collegeCode, status: "active" });
    if (!college) throw new ApiError(404, "College not found");

    const collegeConn = getCollegeDB(college.dbName);
    const Report = getReportModel(collegeConn);

    const Student = getStudentModel(collegeConn)
    const reports = await Report.find({ studentId: userId })
    .populate({path : "studentId", select : "-password -refreshToken -isActive -resetPasswordOTP -resetPasswordOTP"})
    .sort({ createdAt: -1 });

    res.status(200).json(
        new ApiResponse(200, reports, "Reports fetched successfully")
    );
});



/* =========================
   STUDENT REPORT LIST
========================= */
export const getMySingleReport = asyncHandler(async(req,res)=>{
     const { collegeCode, reportId } = req.body;


     console.log(reportId);
     console.log(reportId, collegeCode);
     

    const masterConn = connectMasterDB();
    const College = getCollegeModel(masterConn);

    const college = await College.findOne({ collegeCode, status: "active" });
    if (!college) throw new ApiError(404, "College not found");

    const collegeConn = getCollegeDB(college.dbName);
    const Report = getReportModel(collegeConn);

    const Student = getStudentModel(collegeConn)

    const report = await Report.find({ _id : reportId }).populate({path : "studentId", select : "studentName rollNo mobileNo avatar"})

    console.log(report);
    

    // const student = await Student.findById(report.studentId)
    // .select("studentName rollNo mobileNo avatar")

    // console.log(student);
    

    res.status(200).json(
        new ApiResponse(200, report, "Reports fetched successfully")
    );
    

})
/* =========================
ADMIN REPORT LIST (FOR INDEX)
========================= */

export const getAllReports = asyncHandler(async (req, res) => {

    const { collegeCode } = req.user;
    
    const { range = "daily" } = req.params;

    // 1️⃣ Decide start date
    const now = new Date();
    let startDate;
    console.log(range);

    switch (range) {
        case "daily":
            startDate = new Date(now.setHours(0, 0, 0, 0));
            break;

        case "weekly":
            startDate = new Date();
            startDate.setDate(startDate.getDate() - 7);
            break;

        case "monthly":
            startDate = new Date();
            startDate.setDate(startDate.getDate() - 30);
            break;

        default:
            throw new ApiError(400, "Invalid range value");
    }



    const masterConn = connectMasterDB();
    const College = getCollegeModel(masterConn);

    const college = await College.findOne({ collegeCode, status: "active" });
    if (!college) throw new ApiError(404, "College not found");

    const collegeConn = getCollegeDB(college.dbName);
    const Report = getReportModel(collegeConn);
    const Student = getStudentModel(collegeConn);
    
    const reports = await Report.find({
        createdAt: { $gte: startDate }
    })
    .sort({ createdAt: -1 })
    .populate({ path: "studentId", select: "studentName rollNo mobileNo avatar" })

    res.status(200).json(
        new ApiResponse(200, {reports, collegeCode}, "All reports fetched")
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

    console.log(report.status);



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
