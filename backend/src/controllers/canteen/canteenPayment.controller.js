
import crypto from "crypto";
import { createRazorpayOrderUtil, getRazorpayInstance, verifyRazorpayPaymentUtil } from "../../utils/razorpayPayment.js";
import { connectMasterDB, getCollegeDB } from "../../db/db.index.js";
import { getCollegeModel } from "../../models/college.model.js";
import { getCanteenOrderModel } from "../../models/canteenOrder.model.js";
import { ApiError } from "../../utils/apiError.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { getCanteenFoodModel } from "../../models/canteenFood.model.js";
import QRCode from "qrcode";
// import { log } from "console";


export const canteen_createRazorpayOrder = asyncHandler(async (req, res) => {

  const { orderId } = req.params;
  const { collegeCode, userId } = req.user;

  console.log(collegeCode, userId, orderId);
  

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

  console.log("ORDRERRRRRR", order);
  

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

console.log(order._id);

  // 5️⃣ Create Razorpay order
  const paymentData = await createRazorpayOrderUtil({
    amount: order.totalAmount,
    receipt: `canteen_${order._id}`,
    saveOrderIdFn: async (orderId) => {
      order.razorpayOrderId = orderId;
      await order.save({ validateBeforeSave: false });
    }
  });


  // console.log("PAYMENT OF RAZORRRRR",razorpayOrder);/
  
  // 7️⃣ Send data to frontend
  res.status(200).json(new ApiResponse(200, paymentData, "Razorpay order created"));

});

export const canteen_verifyPayment = asyncHandler(async (req, res) => {

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature
  } = req.body;

  await verifyRazorpayPaymentUtil({
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature
  }); //it will return true then only farther code will be run

  const { collegeCode, userId } = req.user;

  // if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
  //   throw new ApiError(400, "Payment verification data missing");
  // }

  // // 1️⃣ Generate signature on backend
  // const generatedSignature = crypto
  //   .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
  //   .update(`${razorpay_order_id}|${razorpay_payment_id}`)
  //   .digest("hex");

  // // 2️⃣ Compare signatures
  // if (generatedSignature !== razorpay_signature) {
  //   throw new ApiError(400, "Invalid payment signature");
  // }

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
  const Food = getCanteenFoodModel(collegeConn);

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

  // 5️⃣ Prevent double payment
  if (order.paymentStatus === "paid") {
    throw new ApiError(400, "Order already paid");
  }

  // 6️⃣ Mark payment successful
  order.paymentStatus = "paid";
  order.razorpayPaymentId = razorpay_payment_id;

  await order.save({ validateBeforeSave: false });

  // 7️⃣ 🔥 REDUCE STOCK (VERY IMPORTANT)
  for (const item of order.items) {
    const food = await Food.findById(item.foodId);

    if (food) {
      food.quantityAvailable -= item.quantity;

      if (food.quantityAvailable <= 0) {
        food.quantityAvailable = 0;
        food.isAvailable = false;
      }

      await food.save({ validateBeforeSave: false });
    }
  }


  // 8️⃣ Generate QR code
  const qrPayload = JSON.stringify({
    orderId: order._id,
    transactionId: order.transactionCode,
    collegeCode
  });

  const qrCodeBase64 = await QRCode.toDataURL(qrPayload);

  // 9️⃣ Save QR code in order
  order.qrCode = qrCodeBase64;
  await order.save({ validateBeforeSave: false });





  // 8️⃣ Response
  res.status(200).json(
    new ApiResponse(
      200,
      {
        orderId: order._id,
        transactionCode:order.transactionCode,
        orderStatus: order.orderStatus,
        createdAt:order.createdAt,
        totalAmount:order.totalAmount,
        paymentStatus: order.paymentStatus,
        razorpayPaymentId: order.razorpayPaymentId,
        qrCode: order.qrCode,


      },
      "Payment verified successfully"
    )
  );
});
