import mongoose from "mongoose";

export const canteenOrderSchema = new mongoose.Schema(
    {
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CollegeStudent",
            required: true
        },

        items: [
            {
                foodId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "CanteenFood",
                    required: true
                },
                name: String,
                price: Number,
                quantity: Number
            }
        ],
        transactionCode: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
        totalAmount: {
            type: Number,
            required: true
        },

        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "failed"],
            default: "pending"
        },
        razorpayOrderId: {
            type: String
        },

        razorpayPaymentId: {
            type: String
        },

        orderStatus: {
            type: String,
            enum: [
                "order_received",
                "preparing",
                "ready",
                "served",
            ],
            default: "order_received"
        },

        orderType: {
            type: String,
            enum: ["online", "offline"],
            default: "online"
        },

        qrCode: {
            type: String // generated after payment
        }
    },
    {
        timestamps: true
    }
);

export const getCanteenOrderModel = (conn) => {
    return conn.models.CanteenOrder ||
        conn.model("CanteenOrder", canteenOrderSchema);
};
