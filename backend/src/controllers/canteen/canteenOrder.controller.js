import { connectMasterDB, getCollegeDB } from "../../db/db.index.js";
import { getCollegeModel } from "../../models/college.model.js";
import { getCanteenFoodModel } from "../../models/canteenFood.model.js";
import { getCanteenOrderModel } from "../../models/canteenOrder.model.js";
import { ApiError } from "../../utils/apiError.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

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

    // 3️⃣ Create order (NO PAYMENT YET)
    const order = await Order.create({
        studentId: userId,
        items: orderItems,
        totalAmount,
        paymentStatus: "pending",
        orderStatus: "order_received"
    });

    res.status(201).json(
        new ApiResponse(
            201,
            {
                orderId: order._id,
                totalAmount
            },
            "Order placed successfully"
        )
    );
});
