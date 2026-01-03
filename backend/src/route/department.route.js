import express from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/authorize.middleware.js"
import { createDepartment, fetchAllDepartments, toggleDepartmentStatus, updateDepartment } from "../controllers/collegeDepartment.controller.js";

const router = express.Router();



router.post(
    "/set",
    verifyJWT,
    authorizeRoles("admin"),
    createDepartment
)



router.post(
    "/update/:departmentId",
    verifyJWT,
    authorizeRoles("admin"),
    updateDepartment
)


router.post(
    "/status/:departmentId",
    verifyJWT,
    authorizeRoles("admin"),
    toggleDepartmentStatus
)

router.get(
    "/all",
    verifyJWT,
    authorizeRoles("admin","student","teacher"),
    fetchAllDepartments
)











export default router