import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { connectMasterDB, getCollegeDB } from "../db/db.index.js";
import { getCollegeModel } from "../models/college.model.js";
import { getCollegeGalleryModel } from "../models/collegeGallery.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { broadcastToStudents } from "../utils/notificationBroadcast.js";
import { broadcastViaSocket } from "../utils/websocketBroadcast.js";

/* ===========================
   ADD IMAGE TO GALLERY
=========================== */

export const addGalleryImage = asyncHandler(async (req, res) => {

  const { collegeCode, userId } = req.user;
  const { description } = req.body;

  const imagePath = req.file?.path?.replace(/\\/g, "/");
  if (!imagePath) throw new ApiError(400, "Image file is required");

  // Resolve college
  const masterConn = connectMasterDB();
  const College = getCollegeModel(masterConn);

  const college = await College.findOne({ collegeCode, status: "active" });
  if (!college) throw new ApiError(404, "College not found");

  const collegeConn = getCollegeDB(college.dbName);
  const Gallery = getCollegeGalleryModel(collegeConn);

  // Upload to Cloudinary
  const uploadResult = await uploadOnCloudinary(imagePath);

  const image = await Gallery.create({
    image: uploadResult.url,
    description,
    uploadedBy: userId
  });

  // 🔄 REAL-TIME UPDATE VIA WEBSOCKET (YOUR WAY)
  broadcastViaSocket(collegeCode,  ["student","admin","canteen","teacher","librarian"], {
    event: "galleryUpdated",
    newImage: {
      _id: image._id,
      image: image.image,
      description: image.description,
      uploadedBy: userId,
      createdAt: image.createdAt
    }
  });

  // 🔔 Notify all students
  await broadcastToStudents(
    collegeConn,
    "📸 New Gallery Photo",
    "A new photo has been added to the college gallery"
  );


  res.status(201).json(
    new ApiResponse(201, image, "Gallery image added successfully")
  );
});


/* ===========================
   FETCH GALLERY
=========================== */

export const getGalleryImages = asyncHandler(async (req, res) => {

  const { collegeCode } = req.user;

  const masterConn = connectMasterDB();
  const College = getCollegeModel(masterConn);

  const college = await College.findOne({ collegeCode, status: "active" });
  if (!college) throw new ApiError(404, "College not found");

  const collegeConn = getCollegeDB(college.dbName);
  const Gallery = getCollegeGalleryModel(collegeConn);

  const images = await Gallery.find().sort({ createdAt: -1 });

  res.status(200).json(
    new ApiResponse(200, images, "Gallery images fetched successfully")
  );
});


/* ===========================
   DELETE IMAGE
=========================== */

export const deleteGalleryImage = asyncHandler(async (req, res) => {

  const { collegeCode } = req.user;
  const { imageId } = req.params;

  const masterConn = connectMasterDB();
  const College = getCollegeModel(masterConn);

  const college = await College.findOne({ collegeCode, status: "active" });
  if (!college) throw new ApiError(404, "College not found");

  const collegeConn = getCollegeDB(college.dbName);
  const Gallery = getCollegeGalleryModel(collegeConn);

  const image = await Gallery.findByIdAndDelete(imageId);

  broadcastViaSocket(collegeCode,  ["student","admin","canteen","teacher","librarian"], {
    event: "galleryDeleted",
    newImage: {
      _id: image._id,
    }
  });
  
  if (!image) throw new ApiError(404, "Gallery image not found");

  res.status(200).json(
    new ApiResponse(200, null, "Gallery image deleted successfully")
  );
});
