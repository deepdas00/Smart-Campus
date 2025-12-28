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
import reportRouter from "./route/report.route.js";
import registerCollege from "./route/collegeRequest.route.js";
import { platformAdminLogin } from "./controllers/platformAdmin/platformAuth.controller.js";
import { forgotPasswordSendOTP, forgotPasswordVerifyOTP } from "./controllers/auth/password.controller.js";




// -p = pending


app.post("/api/v1/platform/admin/login", platformAdminLogin);
app.post("/api/v1/college/forgot-password", forgotPasswordSendOTP);
app.post("/api/v1/college/reset-password", forgotPasswordVerifyOTP);
// app.post("/api/v1/college/change-password", verifyJWT, changePassword);/////////////////////////////////////////pending

app.use("/api/v1/users/student", studentRouter) 
// POST   /api/v1/users/student/register        // Public: student registration with avatar upload
// GET    /api/v1/users/student/profile         // Protected: fetch student profile (JWT + role check)

// PATCH  /api/v1/users/student/profile   -p      // Protected: update student profile
// DELETE /api/v1/users/student/profile   -p      // Protected: delete/deactivate student account
// GET    /api/v1/users/student/courses   -p      // Protected: list enrolled courses
// GET    /api/v1/users/student/library   -p      // Protected: view borrowed books/fines



app.use("/api/v1/public/registerCollege",registerCollege);


//POST /api/v1/public/registerCollege/request      //public api to send college registration request////////////////////////////////////////////////////



app.use("/api/v1/college", collegeRouter);
// POST   /api/v1/college/register           //ADMIN PLATFORM can only register a college////////////////////////////////
// POST   /api/v1/college/fetchCollgeData    //ADMIN PLATFORM can only view all college FULL DATA////////////////////////////////////
// POST    /api/v1/college/satusUpdate       //ADMIN PLATFORM can Active or InActive college using BTN//////////////////////////////////////////
// POST    /api/v1/college/update            //ADMIN PLATFORM can update changes of college///////////////////////////////////////////////////////////////
// GET    /api/v1/college/data               //(public api)for DropDown     ////////////////////////////////////////////////////////////////////////


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
/*
# ===================== LIBRARY MODULE API =====================

# ---------- POLICY ----------
POST    /api/v1/library/policy                         # Set / Update library policy (admin)

# ---------- BOOK MANAGEMENT ----------
POST    /api/v1/library/books                          # Add new book (librarian, admin)
GET     /api/v1/library/books                          # Get all books (student, librarian, admin)
PATCH   /api/v1/library/books/:bookId                  # Update book (librarian, admin)
DELETE  /api/v1/library/books/:bookId                  # Delete book (admin, librarian)

# ---------- TRANSACTIONS / CIRCULATION ----------
POST    /api/v1/library/order                          # Order book (student)
POST    /api/v1/library/issue                          # Issue book (librarian, admin)

GET     /api/v1/library/transactions/:transactionId    # Fetch single transaction (student, librarian, admin)
GET     /api/v1/library/transactions                   # Get all transactions (librarian, admin)

# ---------- RETURN & PAYMENT ----------
PATCH   /api/v1/library/return/pay/:transactionId      # Create Razorpay order for fine (student) ////////////////////////////////////////////
POST    /api/v1/library/return/verify                  # Verify fine payment (student)////////////////////////////////////////////////////////

POST    /api/v1/library/return/finalize                # Finalize return via QR scan (librarian, admin)///////////////////////////////////////
POST    /api/v1/library/return/                        #  return by clicking on return btn (librarian, admin)///////////////////////////////////////

# ---------- STUDENT HISTORY ----------
GET     /api/v1/library/my/history                     # Get current student library history

# ============================================================
*/

app.use("/api/v1/canteen", canteenRouter);
/*
# ===================== CANTEEN MODULE API =====================

# ---------- POLICY ----------
POST    /api/v1/canteen/policy                 # Set / Update canteen policy (admin)
GET    /api/v1/canteen/canteenStatus           # To fetch Canteen Status///////////////////////////////////////////////////////////
POST    /api/v1/canteen/isActive               # To set Canteen Status ////////////////////////////////////////////////////////////////
GET     /api/v1/canteen/fetchpolicy            # To fetch policy details

# ---------- FOOD ----------
POST    /api/v1/canteen/foods                  # Add food (canteen, admin)
PATCH   /api/v1/canteen/foods/:foodId          # Update food (canteen, admin)
GET     /api/v1/canteen/foods                  # Get all foods (student, canteen, admin)
DELETE  /api/v1/canteen/food/:foodId           # Permanently delete food (admin)

# ---------- ORDERS ----------
POST    /api/v1/canteen/orders                 # Place order (student)
POST    /api/v1/canteen/orders/:orderId/pay    # Create Razorpay order (student)
POST    /api/v1/canteen/orders/verify-payment  # Verify payment (student)
POST    /api/v1/canteen/orders/serve           # Serve order via QR (canteen)  //form qr we get data     //////////////////////////////////////////////////////
GET     /api/v1/canteen/orders/dashboard       # Dashboard orders (canteen, admin)
#         Query: ?range=daily|weekly|monthly
GET     /api/v1/canteen/orders/my-history      # Get one student's order history///////////////////////////////////////////////////
GET     /api/v1/canteen/orders/details         # Get single order detals for qr submitting (order id) ///////////////////////////////////////////////////
    
# =============================================================
*/

app.use("/api/v1/app/administration", adminOfficialRoute);
//



app.use("/api/v1/reports", reportRouter);
/*
# ===================== REPORT MODULE API =====================

# ---------- STUDENT ----------
POST    /api/v1/reports/createreport            # Create a new report with image (student)
GET     /api/v1/reports/getMyReports            # Get all reports created by logged-in student
POST    /api/v1/reports/:reportId/rate          # Submit rating after report resolved (student)

# ---------- ADMIN ----------
GET     /api/v1/reports/                        # Get all reports (admin)
PATCH   /api/v1/reports/:reportId/status        # Update report status (admin)
#         Status: pending | in-progress | resolved | rejected

# =============================================================
*/





export { app }