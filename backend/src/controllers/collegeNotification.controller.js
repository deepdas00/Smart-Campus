import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { connectMasterDB, getCollegeDB } from "../db/db.index.js";
import { getCollegeModel } from "../models/college.model.js";
import { getCollegeNotificationModel } from "../models/collegeNotification.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

/* =========================
   CREATE NOTIFICATION
========================= */

export const createNotification = asyncHandler(async (req, res) => {

  const { collegeCode } = req.user;
  const { category, title, description, expireAt } = req.body;

  if (!category || !title || !description) {
    throw new ApiError(400, "Required fields missing");
  }

  const masterConn = connectMasterDB();
  const College = getCollegeModel(masterConn);

  const college = await College.findOne({ collegeCode, status: "active" });
  if (!college) throw new ApiError(404, "College not found");

  const collegeConn = getCollegeDB(college.dbName);
  const Notification = getCollegeNotificationModel(collegeConn);

  let picUrl = null;
  const picPath = req.file?.path?.replace(/\\/g, "/");

  if (picPath) {
    const uploadResult = await uploadOnCloudinary(picPath);
    picUrl = uploadResult.url;
  }

  const notification = await Notification.create({
    category,
    title,
    description,
    pic: picUrl,
    expireAt: expireAt || null
  });

  res.status(201).json(
    new ApiResponse(201, notification, "Notification created successfully")
  );
});


/* =========================
   FETCH NOTIFICATIONS
========================= */

export const getNotifications = asyncHandler(async (req, res) => {

  const { collegeCode } = req.user;
  const { category } = req.query;

  const masterConn = connectMasterDB();
  const College = getCollegeModel(masterConn);

  const college = await College.findOne({ collegeCode, status: "active" });
  if (!college) throw new ApiError(404, "College not found");

  const collegeConn = getCollegeDB(college.dbName);
  const Notification = getCollegeNotificationModel(collegeConn);

  const filter = {};
  if (category) filter.category = category;

  const notifications = await Notification
    .find(filter)
    .sort({ createdAt: -1 });

  res.status(200).json(
    new ApiResponse(200, notifications, "Notifications fetched successfully")
  );
});


/* =========================
   UPDATE NOTIFICATION
========================= */

export const updateNotification = asyncHandler(async (req, res) => {

  const { collegeCode } = req.user;
  const { notificationId } = req.params;

  const updates = req.body;

  const masterConn = connectMasterDB();
  const College = getCollegeModel(masterConn);

  const college = await College.findOne({ collegeCode, status: "active" });
  if (!college) throw new ApiError(404, "College not found");

  const collegeConn = getCollegeDB(college.dbName);
  const Notification = getCollegeNotificationModel(collegeConn);

  if (req.file) {
    const picPath = req.file.path.replace(/\\/g, "/");
    const uploadResult = await uploadOnCloudinary(picPath);
    updates.pic = uploadResult.url;
  }

  const updated = await Notification.findByIdAndUpdate(
    notificationId,
    updates,
    { new: true, runValidators: true }
  );

  if (!updated) throw new ApiError(404, "Notification not found");

  res.status(200).json(
    new ApiResponse(200, updated, "Notification updated successfully")
  );
});


/* =========================
   DELETE NOTIFICATION
========================= */

export const deleteNotification = asyncHandler(async (req, res) => {

  const { collegeCode } = req.user;
  const { notificationId } = req.params;

  const masterConn = connectMasterDB();
  const College = getCollegeModel(masterConn);

  const college = await College.findOne({ collegeCode, status: "active" });
  if (!college) throw new ApiError(404, "College not found");

  const collegeConn = getCollegeDB(college.dbName);
  const Notification = getCollegeNotificationModel(collegeConn);

  const deleted = await Notification.findByIdAndDelete(notificationId);

  if (!deleted) throw new ApiError(404, "Notification not found");

  res.status(200).json(
    new ApiResponse(200, null, "Notification deleted successfully")
  );
});
