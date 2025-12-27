import express from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/authorize.middleware.js"
import { upload } from "../middlewares/multer.middleware.js"
import { canteenIsActive, canteenSatusFetch, fetchedSingleOrder, getCanteenDashboardOrders, getMyCanteenOrderHistory, placeOrder, serveOrder } from "../controllers/canteen/canteenOrder.controller.js";
import { canteen_createRazorpayOrder, canteen_verifyPayment } from "../controllers/canteen/canteenPayment.controller.js";
import { addFood, deleteFood, getAllFoods, updateFood } from "../controllers/canteen/canteenFood.controller.js";
import { setCanteenPolicy } from "../controllers/canteen/canteenPolicy.controller.js";

const router = express.Router();




/*------Policy set and update------*/
router.post(
  "/policy",
  verifyJWT,
  authorizeRoles("admin"),
  setCanteenPolicy
);

router.post(
  "/isActive",
  verifyJWT,
  authorizeRoles("admin","canteen"),
  canteenIsActive
);

router.get(
  "/canteenStatus",
  verifyJWT,
  authorizeRoles("admin","canteen","student"),
  canteenSatusFetch
)


/* ---------- FOOD ---------- */

// Canteen only
router.post(
  "/foods",
  verifyJWT, // authentication
  authorizeRoles("canteen", "admin"), //authorization
  upload.single("image"),
  addFood
)

router.patch(
  "/foods/:foodId",
  verifyJWT,
  authorizeRoles("canteen", "admin"),
  upload.single("image"), // handle the 'image' field
  updateFood
);

// Student + Staff
router.get(
  "/foods",
  verifyJWT,
  authorizeRoles("student", "canteen", "admin"),
  getAllFoods
);

//Delete Food
router.delete(
  "/food/:foodId",
  verifyJWT,
  authorizeRoles("admin", 'canteen'),
  deleteFood
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
  canteen_createRazorpayOrder
);

// Verify payment
router.post(
  "/orders/verify-payment",
  verifyJWT,
  authorizeRoles("student"),
  canteen_verifyPayment
);

//order serve through qr
router.post(
  "/orders/serve",
  verifyJWT,
  authorizeRoles("canteen"),
  serveOrder
);


//order Dashboard
router.get(
  "/orders/dashboard",
  verifyJWT,
  authorizeRoles("canteen", "admin"),
  getCanteenDashboardOrders            //fetch(`/canteen/orders/dashboard?range=${selectedRange}`)  selectedRange = ["daily" || "weekly" || "monthly"]
);

// Student → My Order History
router.get(
  "/orders/my-history",
  verifyJWT,
  authorizeRoles("student"),
  getMyCanteenOrderHistory
);


// Single order fetched by qr
router.get(
  "/orders/details/:orderId",
  verifyJWT,
  authorizeRoles("student", "canteen"),
  fetchedSingleOrder,
);

export default router;






