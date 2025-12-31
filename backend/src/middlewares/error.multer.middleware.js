import multer from "multer";
import { ApiError } from "../utils/apiError.js";

export const globalErrorHandler = (err, req, res, next) => {

  // 🎯 Catch Multer errors globally
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      err = new ApiError(400, "File size must be less than 3 MB");
    } else {
      err = new ApiError(400, err.message);
    }
  }

  // 🧪 Custom file filter error
  if (err.message === "Only image files are allowed") {
    err = new ApiError(400, err.message);
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({ statusCode, message });
};
