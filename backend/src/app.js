import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken"


const app = express();




app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))



app.use(express.json({limit: "16kb"})) // to take input from .json
app.use(express.urlencoded({extended: true, limit:"16kb"}))  // to take input form diffrent types of url
app.use(express.static("public"))
app.use(cookieParser())




import studentRouter from "./route/student.route.js"
import collegeRouter from "./route/college.route.js";
import authRouter from "./route/auth.route.js"
import adminRouter from "./route/admin.route.js"
import libraryRouter from "./route/library.route.js"
import canteenRouter from "./route/canteen.route.js"
import adminOfficialRoute from "./route/adminOfficial.route.js"




// -p = pending

app.use("/api/v1/users/student", studentRouter) 
// POST   /api/v1/users/student/register        // Public: student registration with avatar upload
// GET    /api/v1/users/student/profile         // Protected: fetch student profile (JWT + role check)

// PATCH  /api/v1/users/student/profile   -p      // Protected: update student profile
// DELETE /api/v1/users/student/profile   -p      // Protected: delete/deactivate student account
// GET    /api/v1/users/student/courses   -p      // Protected: list enrolled courses
// GET    /api/v1/users/student/library   -p      // Protected: view borrowed books/fines


app.use("/api/v1/college", collegeRouter);
// POST   /api/v1/college/register   (have to make it secure after making adminOfficial )  
// GET    /api/v1/college/data       (public api)     


app.use("/api/v1/auth", authRouter);
// POST /api/v1/auth/student/login 
// POST /api/v1/auth/student/me     {Whole details of student}
// POST /api/v1/auth/staff/login 
// POST /api/v1/auth/refresh 
// POST /api/v1/auth/logout
// POST /api/v1/auth/change-password  -p
// POST /api/v1/auth/forgot-password  -p
// POST /api/v1/auth/reset-password/:token -p

app.use("/api/v1/admin", adminRouter);
//

app.use("/api/v1/library", libraryRouter);
// POST   /api/v1/library/books   //BOOK ADD
// GET    /api/v1/library/books   //BOOK ALL FETCHED
// PATCH  /api/v1/library/books/:bookId  //SINGLE BOOK UPDATE
// DELETE /api/v1/library/books/:bookId   //DELETE ONE BOOK
// POST   /api/v1/library/order   // ORDER A BOOK {STUDENT}



app.use("/api/v1/canteen", canteenRouter);
/* ---------- FOOD ---------- */

// POST   /api/v1/canteen/foods              // Add food (canteen, admin only)
// PATCH  /api/v1/canteen/foods/:foodId      // Update food (canteen, admin only)
// GET    /api/v1/canteen/foods              // Get all foods (student, canteen, admin)
// DELETE    /api/v1/canteen//food/:foodId              // Get all foods (student, canteen, admin)


/* ---------- ORDERS ---------- */

// POST   /api/v1/canteen/orders             // Place order (student only)
// PATCH  /api/v1/canteen/orders/:id/status  // Update order status (canteen only) [TODO]
// POST   /api/v1/canteen/orders/:orderId/pay // Create Razorpay order (student only)
// POST   /api/v1/canteen/orders/verify-payment // Verify payment (student only)
// POST   /api/v1/canteen/orders/serve       // Serve order via QR (canteen only)
// GET    /api/v1/canteen/orders/dashboard   // Get dashboard orders (canteen, admin) 
//      !-> fetch(`/canteen/orders/dashboard?range=${selectedRange}`)  selectedRange = ["daily" || "weekly" || "monthly"]


app.use("/api/v1/app/administration", adminOfficialRoute);
//







export { app }