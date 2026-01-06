import express from "express";
import { registerCollege, updateCollegeDetails, updateCollegeStatus } from "../controllers/college.controller.js";
import { getAllColleges, getAllCollegesFullDetails } from "../controllers/collegeDataFetch.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/authorize.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { createOrUpdateCollegeInfo, getCollegeFullInfo, getCollegeLimitedInfo } from "../controllers/collegeInfo.controller.js";
import { addGalleryImage, deleteGalleryImage, getGalleryImages } from "../controllers/collegeGallery.controller.js";
import { createNotification, deleteNotification, getNotifications, updateNotification } from "../controllers/collegeNotification.controller.js";
import { getAdminDashboardStatistics } from "../controllers/collegeOverView.controller.js";


const router = express.Router();


/*================================
college for product admin
==================================*/

// College Registration for (ADMIN OFFICIAL)
router.route("/register")
    .post(
        verifyJWT,
        authorizeRoles("platformAdmin"),
        registerCollege
    );


//fetch all college full data for ADMIN OFFICIAL Use
router.route("/fetchCollgeData")
    .get(
        verifyJWT,
        authorizeRoles("platformAdmin"),
        getAllCollegesFullDetails
    );


//inActive or active ADMIN OFFICIAL
router.route("/satusUpdate")
    .post(
        verifyJWT,
        authorizeRoles("platformAdmin"),
        updateCollegeStatus
    );


//clg details update ADMIN OFFICIAL
router.route("/update")
    .post(
        verifyJWT,
        authorizeRoles("platformAdmin"),
        updateCollegeDetails
    );







/*================================
        college Info
==================================*/
   
// Admin only
router.post(
    "/info/createOrUpdate",
    verifyJWT,
    authorizeRoles("admin"),
    upload.single("logo"),
    createOrUpdateCollegeInfo
);

// public department fetch
// router.get(
//     "/departments/:collegeCode",
//     getDepartments
// );

//get full information of college admin
router.get(
    "/info-full",
    verifyJWT,
    authorizeRoles("admin"),
    getCollegeFullInfo
)

//get limited information of student and staff
router.get(
    "/info-limit",
    verifyJWT,
    authorizeRoles("student","staff", "admin", "librarian", "canteen","teacher"),
    getCollegeLimitedInfo
)


// Internal / frontend usage public 
router.route("/data").get(getAllColleges);






/*================================
        college Gellery
==================================*/



// Admin & staff upload
router.post(
  "/gallery",
  verifyJWT,
  authorizeRoles("admin"),
  upload.single("image"),
  addGalleryImage
);

// All logged users view
router.get(
  "/gallery",
  verifyJWT,
  getGalleryImages
);

// Admin delete
router.delete(
  "/gallery/:imageId",
  verifyJWT,
  authorizeRoles("admin"),
  deleteGalleryImage
);

/*================================
        college Notification
==================================*/
// Admin create Notification
router.post(
  "/notifications",
  verifyJWT,
  authorizeRoles("admin"),
  upload.single("image"),
  createNotification
);

// Everyone can fetch notifiction
router.get(
  "/notifications",
  verifyJWT,
  getNotifications
);

// Admin update notification
router.patch(
  "/notifications/:notificationId",
  verifyJWT,
  authorizeRoles("admin"),
  upload.single("image"),
  updateNotification
);

// Admin delete notification
router.delete(
  "/notifications/:notificationId",
  verifyJWT,
  authorizeRoles("admin"),
  deleteNotification
);


/*================================
        college overview
==================================*/
// college will get overview stas by admin
// GET /api/v1/college/admin/statistics?range=weekly
router.get(
  "/admin/statistics",
  verifyJWT,
  authorizeRoles("admin"),
  getAdminDashboardStatistics
);



export default router;


