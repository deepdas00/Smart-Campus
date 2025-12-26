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
  orderBook, 
  returnBook
} from "../controllers/library/libraryTransaction.controller.js";
import { library_createRazorpayOrder, library_verifyPayment } from "../controllers/library/libraryPayment.controller.js";

const router = express.Router();

/* ===============================
   📚 BOOK MANAGEMENT ROUTES
================================ */

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
router.post(
  "/issue",
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
router.post(
  "/return/finalize",
  verifyJWT,
  authorizeRoles("librarian", "admin"),
  finalizeReturn
);

// final return ( RETURN CLICKED ) by librariyan 
router.post(
  "/return/finalize",
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


export default router;
