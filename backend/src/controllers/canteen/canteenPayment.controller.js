
import crypto from "crypto";
import { getRazorpayInstance } from "../../utils/razorpay.js";
import { connectMasterDB, getCollegeDB } from "../../db/db.index.js";
import { getCollegeModel } from "../../models/college.model.js";
import { getCanteenOrderModel } from "../../models/canteenOrder.model.js";
import { ApiError } from "../../utils/apiError.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const createRazorpayOrder = asyncHandler(async (req, res) => {

  const { orderId } = req.params;
  const { collegeCode, userId } = req.user;

  // 1️⃣ Resolve college DB
  const masterConn = connectMasterDB();
  const College = getCollegeModel(masterConn);

  const college = await College.findOne({
    collegeCode,
    status: "active"
  });

  if (!college) {
    throw new ApiError(404, "College not found");
  }

  const collegeConn = getCollegeDB(college.dbName);
  const Order = getCanteenOrderModel(collegeConn);

  // 2️⃣ Fetch order
  const order = await Order.findById(orderId);

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  // 3️⃣ Ownership check (VERY IMPORTANT)
  if (order.studentId.toString() !== userId.toString()) {
    throw new ApiError(403, "Not authorized to pay for this order");
  }

  // 4️⃣ Check payment status
  if (order.paymentStatus === "paid") {
    throw new ApiError(400, "Order already paid");
  }

  // 5️⃣ Create Razorpay order
  const razorpayOrder = await getRazorpayInstance.orders.create({
    amount: order.totalAmount * 100, // paise
    currency: "INR",
    receipt: `canteen_${order._id}`
  });

  // 6️⃣ Save Razorpay order ID
  order.razorpayOrderId = razorpayOrder.id;
  await order.save({ validateBeforeSave: false });

  // 7️⃣ Send data to frontend
  res.status(200).json(
    new ApiResponse(
      200,
      {
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        key: process.env.RAZORPAY_KEY_ID
      },
      "Razorpay order created"
    )
  );
});

export const verifyPayment = asyncHandler(async (req, res) => {

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature
  } = req.body;

  const { collegeCode, userId } = req.user;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    throw new ApiError(400, "Payment verification data missing");
  }

  // 1️⃣ Generate signature on backend
  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  // 2️⃣ Compare signatures
  if (generatedSignature !== razorpay_signature) {
    throw new ApiError(400, "Invalid payment signature");
  }

  // 3️⃣ Resolve college DB
  const masterConn = connectMasterDB();
  const College = getCollegeModel(masterConn);

  const college = await College.findOne({
    collegeCode,
    status: "active"
  });

  if (!college) {
    throw new ApiError(404, "College not found");
  }

  const collegeConn = getCollegeDB(college.dbName);
  const Order = getCanteenOrderModel(collegeConn);

  // 4️⃣ Find order
  const order = await Order.findOne({
    razorpayOrderId: razorpay_order_id
  });

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  // 5️⃣ Ownership check
  if (order.studentId.toString() !== userId.toString()) {
    throw new ApiError(403, "Unauthorized payment verification");
  }

  // 6️⃣ Mark payment successful
  order.paymentStatus = "paid";
  order.razorpayPaymentId = razorpay_payment_id;

  await order.save({ validateBeforeSave: false });

  // 7️⃣ Response
  res.status(200).json(
    new ApiResponse(
      200,
      {
        orderId: order._id,
        paymentStatus: order.paymentStatus
      },
      "Payment verified successfully"
    )
  );
});
