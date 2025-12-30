import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/authorize.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

import {
  createReport,
  getMyReports,
  getAllReports,
  updateReportStatus,
  submitRating
} from "../controllers/reports/report.controller.js";

const router = express.Router();

// Student
router.post(
  "/createreport",
  verifyJWT,
  authorizeRoles("student"),
  upload.single("image"),
  createReport
);

router.get(
  "/getMyReports",
  verifyJWT,
  authorizeRoles("student","admin"),
  getMyReports
);

router.post(
  "/:reportId/rate",
  verifyJWT,
  authorizeRoles("student"),
  submitRating
);

// Admin
router.get(
  "/:range/all",
  verifyJWT,
  authorizeRoles("admin"),
  getAllReports
);

router.patch(
  "/:reportId/status",
  verifyJWT,
  authorizeRoles("admin"),
  updateReportStatus
);

export default router;
