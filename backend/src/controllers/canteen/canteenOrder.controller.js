import { connectMasterDB, getCollegeDB } from "../../db/db.index.js";
import { getCollegeModel } from "../../models/college.model.js";
import { getCanteenFoodModel } from "../../models/canteenFood.model.js";
import { getCanteenOrderModel } from "../../models/canteenOrder.model.js";
import { ApiError } from "../../utils/apiError.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { generateTransactionCode } from "../../utils/generateTransactionCode.js";
import { getCanteenPolicyModel } from "../../models/canteenPolicy.model.js";
import { getStudentModel } from "../../models/collegeStudent.model.js";

//order placing by student
export const placeOrder = asyncHandler(async (req, res) => {
  const { items } = req.body;
  const { userId, collegeCode } = req.user;

  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new ApiError(400, "Order items are required");
  }

  // 1️⃣ Resolve college DB
  const masterConn = connectMasterDB();
  const College = getCollegeModel(masterConn);

  const college = await College.findOne({
    collegeCode,
    status: "active",
  });

  if (!college) {
    throw new ApiError(404, "College not found");
  }

  const collegeConn = getCollegeDB(college.dbName);

  const CanteenPolicyModel = getCanteenPolicyModel(collegeConn);
  const canteenPolicy = await CanteenPolicyModel.findOne();
  const canteenStatus = canteenPolicy.isActive;
  if (!canteenStatus) {
    res.status(401).json({ message: "Canteen Is Offline!!" });
  }

  const Food = getCanteenFoodModel(collegeConn);
  const Order = getCanteenOrderModel(collegeConn);

  let orderItems = [];
  let totalAmount = 0;

  // 2️⃣ Validate each food item
  for (const item of items) {
    const food = await Food.findById(item.foodId);

    if (!food || !food.isAvailable) {
      throw new ApiError(400, "Food item not available");
    }

    if (food.quantityAvailable < item.quantity) {
      return res.status(400).json({message:`Insufficient quantity for ${food.name}`})
    }

    const itemTotal = food.price * item.quantity;
    totalAmount += itemTotal;

    orderItems.push({
      foodId: food._id,
      name: food.name,
      price: food.price,
      quantity: item.quantity,
    });
  }

  //generateTransactionCode
  const transactionCode = await generateTransactionCode(
    collegeCode,
    "C",
    Order
  );

  //  console.log(transactionCode);

  // 3️⃣ Create order (NO PAYMENT YET)
  const order = await Order.create({
    studentId: userId,
    items: orderItems,
    totalAmount,
    paymentStatus: "pending",
    orderStatus: "order_received",
    transactionCode,
  });

  res.status(201).json(
    new ApiResponse(
      201,
      {
        orderId: order._id,
        totalAmount,
        transactionCode,
      },
      "Order placed successfully"
    )
  );
});

//order serving by canteen staff
export const serveOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.body;
  const { collegeCode } = req.user;

  if (!orderId || !collegeCode) {
    throw new ApiError(400, "Invalid QR data");
  }

  // Resolve college DB
  const masterConn = connectMasterDB();
  const College = getCollegeModel(masterConn);

  const college = await College.findOne({
    collegeCode,
    status: "active",
  });

  if (!college) {
    throw new ApiError(404, "College not found");
  }

  const collegeConn = getCollegeDB(college.dbName);

  const CanteenPolicyModel = getCanteenPolicyModel(collegeConn);
  const canteenPolicy = await CanteenPolicyModel.findOne();
  const canteenStatus = canteenPolicy.isActive;
  if (!canteenStatus) {
    return res.status(401).json({ message: "Canteen Is Offline!!" });
  }

  const Order = getCanteenOrderModel(collegeConn);

  const order = await Order.findById(orderId);

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  // Ensure payment done
  if (order.paymentStatus !== "paid") {
    throw new ApiError(400, "Order not paid");
  }

  // Prevent double serve
  if (order.orderStatus === "served") {
    throw new ApiError(400, "Order already served");
  }

  // Mark served
  order.orderStatus = "served";
  await order.save({ validateBeforeSave: false });

  res.status(200).json(new ApiResponse(200, null, "Order served successfully"));
});

// Dashbord will show this orders
export const getCanteenDashboardOrders = asyncHandler(async (req, res) => {
  const { collegeCode } = req.user;
  const { range = "daily" } = req.query;

  // 1️⃣ Decide start date
  const now = new Date();
  let startDate;
 console.log( range );
 
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

  // 2️⃣ Resolve college DB
  const masterConn = connectMasterDB();
  const College = getCollegeModel(masterConn);

  const college = await College.findOne({
    collegeCode,
    status: "active",
  });

  if (!college) {
    throw new ApiError(404, "College not found");
  }

  const collegeConn = getCollegeDB(college.dbName);
  getStudentModel(collegeConn);

  const Order = getCanteenOrderModel(collegeConn);

  // 3️⃣ Fetch filtered orders
  const orders = await Order.find({
    paymentStatus: "paid",
    createdAt: { $gte: startDate },
  })
    .sort({ createdAt: -1 })
    .populate({ path: "studentId", select: "studentName rollNo mobileNo" })
    .select(
      "_id items transactionCode totalAmount orderStatus createdAt paymentStatus razorpayPaymentId"
    );
    console.log(orders);
    

  // 4️⃣ Response
  res
    .status(200)
    .json(
      new ApiResponse(200, orders, `Canteen dashboard (${range}) data fetched`)
    );
});

//Fetched single order
export const fetchedSingleOrder = asyncHandler(async (req, res) => {
  const { collegeCode } = req.user;
  const { orderId } = req.params;

  // console.log("ID", orderId);

  // 1️⃣ Resolve college DB
  const masterConn = connectMasterDB();
  const College = getCollegeModel(masterConn);

  const college = await College.findOne({
    collegeCode,
    status: "active",
  });

  if (!college) {
    throw new ApiError(404, "College not found");
  }

  const collegeConn = getCollegeDB(college.dbName);
  // 🔥 Register dependent models on this connection
  getStudentModel(collegeConn);
  const Order = getCanteenOrderModel(collegeConn);

  // console.log(Order);
  // 3️⃣ Fetch filtered orders
  const order = await Order.findById(orderId)
    .populate("studentId", "studentName rollNo mobileNo")
    .select(
      "_id items transactionCode qrCode totalAmount orderStatus createdAt paymentStatus razorpayPaymentId"
    );





  // 4️⃣ Response
  res
    .status(200)
    .json(new ApiResponse(200, order, `Order fetched successfully`));
});

// Get logged-in student's order history
export const getMyCanteenOrderHistory = asyncHandler(async (req, res) => {
  const { userId, collegeCode } = req.user;

  // 1️⃣ Resolve college DB
  const masterConn = connectMasterDB();
  const College = getCollegeModel(masterConn);

  const college = await College.findOne({
    collegeCode,
    status: "active",
  });

  if (!college) {
    throw new ApiError(404, "College not found");
  }

  const collegeConn = getCollegeDB(college.dbName);
  const Order = getCanteenOrderModel(collegeConn);

  // 2️⃣ Fetch student's orders
  const orders = await Order.find({ studentId: userId })
    .sort({ createdAt: -1 })
    .select(
      "_id transactionCode qrCode items totalAmount paymentStatus createdAt orderStatus createdAt razorpayPaymentId"
    );

  // 3️⃣ Response
  res
    .status(200)
    .json(
      new ApiResponse(200, orders, "Student order history fetched successfully")
    );
});

// to set online and offline status (toggle btn)
export const canteenIsActive = asyncHandler(async (req, res) => {
  const { isActive } = req.body; ///true or false
  const { collegeCode } = req.user;

  // 1️⃣ Resolve college DB
  const masterConn = connectMasterDB();
  const College = getCollegeModel(masterConn);

  const college = await College.findOne({
    collegeCode,
    status: "active",
  });

  if (!college) {
    throw new ApiError(404, "College not found");
  }

  const collegeConn = getCollegeDB(college.dbName);
  const CanteenPolicyModel = getCanteenPolicyModel(collegeConn);

  const canteenPolicy = await CanteenPolicyModel.findOne();

  canteenPolicy.isActive = isActive;

  await canteenPolicy.save({ validateBeforeSave: false });

  res
    .status(200)
    .json(
      new ApiResponse(200, isActive, "Canteen Status fetched successfully")
    );
});

// export const canteenSatusFetch = asyncHandler(async (req, res) => {

//   const { collegeCode } = req.user;

//   const canteenPolicy = await CanteenPolcyModel.findOne();

//   if (!canteenPolicy) {
//     throw new ApiError(404, "Canteen policy not found");
//   }

//   canteenPolicy.isActive = isActive;

//   console.log(canteenPolicy.isActive);

//   await canteenPolicy.save({ validateBeforeSave: false });

//   res
//     .status(200)
//     .json(
//       new ApiResponse(200, isActive, "Canteen Status fetched successfully")
//     );
// });

export const canteenSatusFetch = asyncHandler(async (req, res) => {
  const { collegeCode } = req.user;

  // 1️⃣ Resolve college DB
  const masterConn = connectMasterDB();
  const College = getCollegeModel(masterConn);

  const college = await College.findOne({
    collegeCode,
    status: "active",
  });

  if (!college) {
    throw new ApiError(404, "College not found");
  }

  const collegeConn = getCollegeDB(college.dbName);
  const CanteenPolicyModel = getCanteenPolicyModel(collegeConn);

  const canteenPolicy = await CanteenPolicyModel.findOne();

  const canteenStatus = canteenPolicy.isActive;

  res
    .status(200)
    .json(
      new ApiResponse(200, canteenStatus, "Canteen Status fetched successfully")
    );
});
