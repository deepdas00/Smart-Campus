import QRCode from "qrcode";
import { connectMasterDB, getCollegeDB } from "../../db/db.index.js";
import { getCollegeModel } from "../../models/college.model.js";
import { getLibraryBookModel } from "../../models/libraryBook.model.js";
import { getLibraryTransactionModel } from "../../models/libraryTransaction.model.js";
import { ApiError } from "../../utils/apiError.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const orderBook = asyncHandler(async (req, res) => {

  const { bookId } = req.body;
  const { collegeCode, userId } = req.user;

  if (!bookId) throw new ApiError(400, "Book ID required");

  // Resolve DB
  const masterConn = connectMasterDB();
  const College = getCollegeModel(masterConn);
  const college = await College.findOne({ collegeCode, status: "active" });
  if (!college) throw new ApiError(404, "College not found");

  const collegeConn = getCollegeDB(college.dbName);
  const Book = getLibraryBookModel(collegeConn);
  const Transaction = getLibraryTransactionModel(collegeConn);

  const book = await Book.findById(bookId);
  if (!book || !book.isActive) throw new ApiError(404, "Book not found");

  if (book.availableCopies <= 0)
    throw new ApiError(400, "Book not available");

  // Create transaction
  const transaction = await Transaction.create({
    studentId: userId,
    bookId
  });

  // Generate QR
  const qrData = JSON.stringify({
    transactionId: transaction._id,
    collegeCode
  });

  const qrCode = await QRCode.toDataURL(qrData);

  transaction.qrCode = qrCode;
  await transaction.save({ validateBeforeSave: false });

  res.status(201).json(
    new ApiResponse(201, transaction, "Book ordered successfully")
  );
});
