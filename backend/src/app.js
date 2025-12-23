import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"


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





app.use("/api/v1/users/student", studentRouter) 
//   /register, /profile, /complaints

app.use("/api/v1/users/college", collegeRouter);
//   /register, /data

app.use("/api/v1/auth", authRouter);
//   /student/login, /staff/login, /refresh, /logout

app.use("/api/v1/admin", adminRouter);
//

app.use("/api/v1/library", libraryRouter);
//

app.use("/api/v1/canteen", canteenRouter);
//addFood, updateFood, getAllFoods, placeOrder, createRazorpayOrder, verifyPayment, serveOrder

app.use("/api/v1/app/administration", adminOfficialRoute);
//







export { app }