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
import { orderBook } from "../controllers/library/libraryTransaction.controller.js";

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
  authorizeRoles("admin"),
  deleteBook
);
/* Order Book - (student) */
router.post(
  "/order",
  verifyJWT,
  authorizeRoles("student"),
  orderBook
);

export default router;
