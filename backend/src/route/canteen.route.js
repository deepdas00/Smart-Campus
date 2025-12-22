import express from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/authorize.middleware.js"
import { upload } from "../middlewares/multer.middleware.js"
import { placeOrder } from "../controllers/canteen/canteenOrder.controller.js";
import { createRazorpayOrder, verifyPayment } from "../controllers/canteen/canteenPayment.controller.js";

const router = express.Router();

/* ---------- FOOD ---------- */

// Student + Staff
router.get(
    "/foods",
    verifyJWT,
    authorizeRoles("student", "canteen", "admin"),
    (req, res) => {
        res.json({ message: "List foods (TODO)" });
    }
);

// Canteen only
router.post(
    "/foods",
    verifyJWT,
    authorizeRoles("canteen", "admin"),
    upload.single("image"),
    (req, res) => {
        res.json({ message: "Add food (TODO)" });
    }
);

/* ---------- ORDERS ---------- */

// Student
router.post(
    "/orders",
    verifyJWT,
    authorizeRoles("student"),
    placeOrder

);

// // Canteen
// router.patch(
//     "/orders/:id/status",
//     verifyJWT,
//     authorizeRoles("canteen"),
//     (req, res) => {
//         res.json({ message: "Update order status (TODO)" });
//     }
// );

// Student → Create Razorpay order
router.post(
  "/orders/:orderId/pay",
  verifyJWT,
  authorizeRoles("student"),
  createRazorpayOrder
);

// Verify payment
router.post(
  "/orders/verify-payment",
  verifyJWT,
  authorizeRoles("student"),
  verifyPayment
);


export default router;






