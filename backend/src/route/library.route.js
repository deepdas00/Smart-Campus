import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/authorize.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

import {
  addBook,
  getAllBooks,
  updateBook,
  deleteBook
} from "../controllers/library/libraryBook.controller.js";

import { fetchlibraryTransactionDetails, 
  finalizeReturn, 
  getAllLibraryTransactions, 
  getStudentLibraryHistory, 
  issueBook, 
  notifyReturnReminders, 
  orderBook, 
  returnBook
} from "../controllers/library/libraryTransaction.controller.js";
import { library_createRazorpayOrder, library_verifyPayment } from "../controllers/library/libraryPayment.controller.js";
import { setLibraryPolicy } from "../controllers/library/libraryPolicy.controller.js";

const router = express.Router();

/* ===============================
   📚 BOOK MANAGEMENT ROUTES
================================ */

/*Policy set and update */
router.post(
  "/policy",
  verifyJWT,
  authorizeRoles("admin","librarian"),
  setLibraryPolicy
);

/* ➕ Add new book (Librarian / Admin) */
router.post(
  "/books",
  verifyJWT,
  authorizeRoles("librarian", "admin"),
  upload.single("coverImage"),
  addBook
);

/* 📖 Get all books (Student / Librarian / Admin) */
router.get(
  "/books",
  verifyJWT,
  authorizeRoles("student", "librarian", "admin"),
  getAllBooks
);

/* ✏️ Update book (Librarian / Admin) */
router.patch(
  "/books/:bookId",
  verifyJWT,
  authorizeRoles("librarian", "admin"),
  upload.single("coverImage"),
  updateBook
);

/* 🗑️ Delete book — soft delete (Admin only) */
router.delete(
  "/books/:bookId",
  verifyJWT,
  authorizeRoles("admin", "librarian"),
  deleteBook
);


/* Order Book - (student) */
router.post(
  "/order",
  verifyJWT,
  authorizeRoles("student"),
  orderBook
);

/* Issue Book - (librarian / admin) */
router.get(
  "/issue/:transactionId",
  verifyJWT,
  authorizeRoles("librarian", "admin"),
  issueBook
);

// /* Prepare Return - ( student ) */
// router.post(
//   "/return/prepare",
//   verifyJWT,
//   authorizeRoles("student"),
//   prepareReturn
// );
// fetch one transaction details (student/Librarian/Admin) 

router.get(
  "/transactions/:transactionId",
  verifyJWT,
  authorizeRoles("librarian", "admin", "student"),
  fetchlibraryTransactionDetails
);

//razorpay payment for library fine
router.patch(
  "/return/pay/:transactionId",
  verifyJWT,
  authorizeRoles("student"),
  library_createRazorpayOrder
);
// payment verification
router.post(
  "/return/verify",
  verifyJWT,
  authorizeRoles("student"),
  library_verifyPayment
);

//  return finalize state ( SCAN QR ) by librariyan 
router.get(
  "/return/finalize/:transactionId",
  verifyJWT,
  authorizeRoles("librarian", "admin"),
  finalizeReturn
);

// final return ( RETURN CLICKED ) by librariyan 
router.post(
  "/return",
  verifyJWT,
  authorizeRoles("librarian", "admin"),
  returnBook
);



/*Fetch student book history  */   //for current student

router.get(
  "/my/history",
  verifyJWT,
  authorizeRoles("student"),
  getStudentLibraryHistory
);

// Librarian/Admin
router.get(
  "/transactions",
  verifyJWT,
  authorizeRoles("librarian", "admin"),
  getAllLibraryTransactions
);



// notify-return-reminders for student 
router.get(
  "/notify-return-reminders",
  verifyJWT,
  authorizeRoles("librarian", "admin"),
  notifyReturnReminders
);


export default router;
