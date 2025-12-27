import express from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { submitCollegeRequest } from "../controllers/collegeRequest/collegeRequest.controller.js";

const router = express.Router();


//public api to send college registration request

router.post(
  "/request",
  upload.array("documents", 5),
  submitCollegeRequest
);

export default router;
