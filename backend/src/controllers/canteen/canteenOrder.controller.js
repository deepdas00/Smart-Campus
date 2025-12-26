import { connectMasterDB, getCollegeDB } from "../../db/db.index.js";
import { getCollegeModel } from "../../models/college.model.js";
import { getCanteenFoodModel } from "../../models/canteenFood.model.js";
import { getCanteenOrderModel } from "../../models/canteenOrder.model.js";
import { ApiError } from "../../utils/apiError.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { generateTransactionCode } from "../../utils/generateTransactionCode.js";


//order placing by student
export const placeOrder = asyncHandler(async (req, res) => {




// input from FRONTEND
    // {
    //     "items": [
    //         {
    //             "foodId": "64fa....",
    //             "quantity": 2
    //         },
    //         {
    //             "foodId": "64fb....",
    //             "quantity": 1
    //         }
    //     ]
    // }

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
        status: "active"
    });

    if (!college) {
        throw new ApiError(404, "College not found");
    }

    const collegeConn = getCollegeDB(college.dbName);
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
            throw new ApiError(
                400,
                `Insufficient quantity for ${food.name}`
            );
        }

        const itemTotal = food.price * item.quantity;
        totalAmount += itemTotal;

        orderItems.push({
            foodId: food._id,
            name: food.name,
            price: food.price,
            quantity: item.quantity
        });
    }


    //generateTransactionCode
    const transactionCode = await generateTransactionCode(collegeCode,"C",Order)

    //  console.log(transactionCode);
     
    // 3️⃣ Create order (NO PAYMENT YET)
    const order = await Order.create({
        studentId: userId,
        items: orderItems,
        totalAmount,
        paymentStatus: "pending",
        orderStatus: "order_received",
        transactionCode
    });

    res.status(201).json(
        new ApiResponse(
            201,
            {
                orderId: order._id,
                totalAmount,
                transactionCode
            },
            "Order placed successfully"
        )
    );
});


//order serving by canteen staff
export const serveOrder = asyncHandler(async (req, res) => {

  const { orderId, collegeCode } = req.body;

  if (!orderId || !collegeCode) {
    throw new ApiError(400, "Invalid QR data");
  }

  // Resolve college DB
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

  res.status(200).json(
    new ApiResponse(
      200,
      null,
      "Order served successfully"
    )
  );
});

// Dashbord will show this orders
export const getCanteenDashboardOrders = asyncHandler(async (req, res) => {

  const { collegeCode } = req.user;
  const { range = "daily" } = req.query;

  // 1️⃣ Decide start date
  const now = new Date();
  let startDate;

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
    status: "active"
  });

  if (!college) {
    throw new ApiError(404, "College not found");
  }

  const collegeConn = getCollegeDB(college.dbName);
  const Order = getCanteenOrderModel(collegeConn);

  // 3️⃣ Fetch filtered orders
  const orders = await Order.find({
    paymentStatus: "paid",
    createdAt: { $gte: startDate }
  })
    .sort({ createdAt: -1 })
    .select("items totalAmount orderStatus createdAt");

  // 4️⃣ Response
  res.status(200).json(
    new ApiResponse(
      200,
      orders,
      `Canteen dashboard (${range}) data fetched`
    )
  );
});


//Fetched single order
export const fetchedSingleOrder = asyncHandler(async (req, res) => {
  const { collegeCode } = req.user;
  const { orderId } = req.body;

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

  // 3️⃣ Fetch filtered orders
  const orders = await Order.findOne(orderId)
    .select("items totalAmount orderStatus createdAt paymentStatus razorpayPaymentId");

  // 4️⃣ Response
  res.status(200).json(
    new ApiResponse(
      200,
      orders,
      `Order fetched successfully`
    )
  );



})

