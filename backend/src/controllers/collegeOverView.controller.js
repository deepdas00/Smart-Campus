import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { connectMasterDB, getCollegeDB } from "../db/db.index.js";
import { getCollegeModel } from "../models/college.model.js";
import { getLibraryTransactionModel } from "../models/libraryTransaction.model.js";
import { getCanteenOrderModel } from "../models/canteenOrder.model.js";
import { getReportModel } from "../models/report.model.js";
import { getStudentModel } from "../models/collegeStudent.model.js";


export const getAdminDashboardStatistics = asyncHandler(async (req, res) => {

    const { collegeCode } = req.user;
    const { range = "daily" } = req.query;

    const now = new Date();
    let startDate;

    if (range === "daily") {
        startDate = new Date();
        startDate.setHours(0, 0, 0, 0);
    }

    else if (range === "weekly") {
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);
        startDate.setHours(0, 0, 0, 0);
    }

    else if (range === "monthly") {
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);
        startDate.setHours(0, 0, 0, 0);
    }
    else {
        throw new ApiError(400, "Invalid range");
    }

    // Resolve College DB
    const masterConn = connectMasterDB();
    const College = getCollegeModel(masterConn);
    const college = await College.findOne({ collegeCode, status: "active" });
    if (!college) throw new ApiError(404, "College not found");

    const collegeConn = getCollegeDB(college.dbName);

    const LibraryTransaction = getLibraryTransactionModel(collegeConn);
    const CanteenOrder = getCanteenOrderModel(collegeConn);
    const Complaint = getReportModel(collegeConn);
    const Student = getStudentModel(collegeConn);




    // 📚 Library Issued and Returned Count
    const libraryTransactions = await LibraryTransaction.find({
        transactionStatus: { $in: ["issued", "returned"] },
        createdAt: { $gte: startDate }
    });

    const libraryIssueMap = {};
    let totalLibraryIssued = 0;

    libraryTransactions.forEach(tx => {
        totalLibraryIssued++;

        const created = new Date(tx.createdAt);
        let label;

        if (range === "daily") {
            const hour = created.getHours().toString().padStart(2, "0");
            label = `${hour}:00`;
        } else {
            const y = created.getFullYear();
            const m = (created.getMonth() + 1).toString().padStart(2, "0");
            const d = created.getDate().toString().padStart(2, "0");
            label = `${y}-${m}-${d}`;
        }

        libraryIssueMap[label] = (libraryIssueMap[label] || 0) + 1;
    });

    const libraryIssueGraphData = Object.entries(libraryIssueMap)
        .map(([label, count]) => ({ label, count }))
        .sort((a, b) => a.label.localeCompare(b.label));




    // 🍽 Canteen Revenue
    const paidOrders = await CanteenOrder.find({
        paymentStatus: "paid",
        createdAt: { $gte: startDate }
    });

    let totalCanteenRevenue = 0;
    const revenueMap = {};

    paidOrders.forEach(order => {
        totalCanteenRevenue += order.totalAmount;

        let label;

        const created = new Date(order.createdAt);

        if (range === "daily") {
            const hour = created.getHours().toString().padStart(2, "0");
            label = `${hour}:00`;
        } else {
            const y = created.getFullYear();
            const m = (created.getMonth() + 1).toString().padStart(2, "0");
            const d = created.getDate().toString().padStart(2, "0");
            label = `${y}-${m}-${d}`;
        }

        revenueMap[label] = (revenueMap[label] || 0) + order.totalAmount;
    });

    const canteenRevenueGraphData = Object.entries(revenueMap)
        .map(([label, amount]) => ({ label, amount }))
        .sort((a, b) => a.label.localeCompare(b.label));





    // 🧾 Reports Summary
    const totalReports = await Complaint.countDocuments();

    const resolvedReports = await Complaint.countDocuments({
        status: { $in: ["resolved", "closed"] }
    });

 

    // 👨‍🎓 Active Students
    const activeStudentsCount = await Student.countDocuments({ isActive: true });
    const rating = await Complaint.find({ status: "closed" }).select("rating")



    res.status(200).json(
        new ApiResponse(
            200,
            {   
                range,
                libraryIssueGraphData,
                totalCanteenRevenue,
                canteenRevenueGraphData,
                totalReports,
                resolvedReports,
                rating,
                activeStudentsCount
            },
            "Admin dashboard statistics fetched successfully"
        )
    );
});
