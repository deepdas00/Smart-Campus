
import crypto from "crypto";
import { connectMasterDB, getCollegeDB } from "../../db/db.index.js";
import { getCollegeModel } from "../../models/college.model.js";
import { getLibraryTransactionModel } from "../../models/libraryTransaction.model.js";
import { ApiError } from "../../utils/apiError.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { createRazorpayOrderUtil, verifyRazorpayPaymentUtil } from "../../utils/razorpayPayment.js";



export const library_createRazorpayOrder = asyncHandler(async (req, res) => {

    const { transactionId } = req.params;
    const { collegeCode, userId } = req.user;

    const masterConn = connectMasterDB();
    const College = getCollegeModel(masterConn);
    const college = await College.findOne({ collegeCode, status: "active" });
    if (!college) throw new ApiError(404, "College not found");

    const collegeConn = getCollegeDB(college.dbName);
    const Transaction = getLibraryTransactionModel(collegeConn);

    const transaction = await Transaction.findById(transactionId);
    if (!transaction) throw new ApiError(404, "Transaction not found");

    if (transaction.studentId.toString() !== userId.toString())
        throw new ApiError(403, "Unauthorized");

    if (transaction.fineAmount <= 0)
        throw new ApiError(400, "No fine required");

    if (transaction.paymentStatus === "paid")
        throw new ApiError(400, "Fine already paid");

    // Create Razorpay order
    const paymentData = await createRazorpayOrderUtil({
        amount: transaction.fineAmount,
        receipt: `library_tx_${transaction._id}`,
        saveOrderIdFn: async (orderId) => {
            transaction.razorpayOrderId = orderId;
            await transaction.save({ validateBeforeSave: false });
        }
    });

    res.status(200).json(new ApiResponse(200, paymentData, "Razorpay order created"));

});

export const library_verifyPayment = asyncHandler(async (req, res) => {

    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
    } = req.body;

    await verifyRazorpayPaymentUtil({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
    }); // it will return true then only later part will work..otherwise directly will throw the eror

    const { collegeCode } = req.user;

    const masterConn = connectMasterDB();
    const College = getCollegeModel(masterConn);
    const college = await College.findOne({ collegeCode, status: "active" });
    if (!college) throw new ApiError(404, "College not found");

    const collegeConn = getCollegeDB(college.dbName);
    const Transaction = getLibraryTransactionModel(collegeConn);

    const transaction = await Transaction.findOne({
        razorpayOrderId: razorpay_order_id
    });

    if (!transaction) throw new ApiError(404, "Transaction not found");

    transaction.paymentStatus = "paid";
    transaction.razorpayPaymentId = razorpay_payment_id;

    await transaction.save({ validateBeforeSave: false });

    res.status(200).json(
        new ApiResponse(200, null, "Fine payment verified successfully")
    );
});
