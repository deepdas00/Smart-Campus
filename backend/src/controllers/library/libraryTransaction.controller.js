import QRCode from "qrcode";
import { connectMasterDB, getCollegeDB } from "../../db/db.index.js";
import { getCollegeModel } from "../../models/college.model.js";
import { getLibraryBookModel } from "../../models/libraryBook.model.js";
import { getLibraryTransactionModel } from "../../models/libraryTransaction.model.js";
import { ApiError } from "../../utils/apiError.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { getLibraryPolicyModel } from "../../models/libraryPolicy.model.js";
import { generateTransactionCode } from "../../utils/generateTransactionCode.js";

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

  if (book.availableCopies <= 0) throw new ApiError(400, "Book not available");

  //generateTransactionCode
  const transactionCode = await generateTransactionCode(
    collegeCode,
    "L",
    Transaction
  );
  // console.log(transactionCode);

  // Create transaction
  const transaction = await Transaction.create({
    studentId: userId,
    bookId,
    transactionCode,
  });

  // Generate QR
  const qrData = JSON.stringify({
    transactionId: transaction._id,
    transactionCode: transaction.transactionCode,
    collegeCode,
  });

  const qrCode = await QRCode.toDataURL(qrData);

  transaction.qrCode = qrCode;
  await transaction.save({ validateBeforeSave: false });

  res
    .status(201)
    .json(new ApiResponse(201, transaction, "Book ordered successfully"));
});

export const issueBook = asyncHandler(async (req, res) => {
  const { transactionId, collegeCode } = req.body;

  const masterConn = connectMasterDB();
  const College = getCollegeModel(masterConn);
  const college = await College.findOne({ collegeCode, status: "active" });
  if (!college) throw new ApiError(404, "College not found");

  const collegeConn = getCollegeDB(college.dbName);
  const Student = getStudentModel(collegeConn);
  const Transaction = getLibraryTransactionModel(collegeConn);
  const Book = getLibraryBookModel(collegeConn);
  const Policy = getLibraryPolicyModel(collegeConn);

  const transaction = await Transaction.findById(transactionId);
  if (!transaction) throw new ApiError(404, "Transaction not found");

  if (transaction.transactionStatus !== "pending")
    throw new ApiError(400, "Invalid transaction state");

  const student = await Student.findById(transaction.studentId);

  // Load policy
  const policy = await Policy.findOne();

  if (student.issuedBooks.length >= policy.maxBooksAllowed) {
    throw new ApiError(400, "Book limit exceeded");
  }

  const book = await Book.findById(transaction.bookId);
  if (!book || book.availableCopies <= 0)
    throw new ApiError(400, "Book not available");

  // Issue book
  transaction.transactionStatus = "issued";
  transaction.issueDate = new Date();
  transaction.dueDate = new Date(
    Date.now() + policy.returnPeriodDays * (24 * 60 * 60 * 1000)
  );
  transaction.expiresAt = null; // prevents auto delelte from db after 24h

  student.issuedBooks.push(transaction._id);
  await student.save({ validateBeforeSave: false });

  book.availableCopies -= 1;

  await book.save({ validateBeforeSave: false });
  await transaction.save({ validateBeforeSave: false });

  res
    .status(200)
    .json(new ApiResponse(200, transaction, "Book issued successfully"));
});

//studetnt click on returnorder

/*export const prepareReturn = asyncHandler(async (req, res) => {

  const { transactionId } = req.body;
  const { collegeCode, userId } = req.user;

  const masterConn = connectMasterDB();
  const College = getCollegeModel(masterConn);
  const college = await College.findOne({ collegeCode, status: "active" });
  if (!college) throw new ApiError(404, "College not found");

  const collegeConn = getCollegeDB(college.dbName);

  const Transaction = getLibraryTransactionModel(collegeConn);
  const transaction = await Transaction.findById(transactionId);
  if (!transaction) throw new ApiError(404, "Transaction not found");

  if (transaction.studentId.toString() !== userId.toString())
    throw new ApiError(403, "Unauthorized");

  if (transaction.transactionStatus !== "issued")
    throw new ApiError(400, "Invalid return state");

  res.status(200).json(
    new ApiResponse(200, transaction, "transaction fetched(if paymentStatus unpaid then call payment api")
  );
});*/

// mam scan the qr
export const finalizeReturn = asyncHandler(async (req, res) => {
  const { transactionId } = req.body;
  const { collegeCode } = req.user;

  const masterConn = connectMasterDB();
  const College = getCollegeModel(masterConn);
  const college = await College.findOne({ collegeCode, status: "active" });
  if (!college) throw new ApiError(404, "College not found");

  const collegeConn = getCollegeDB(college.dbName);

  const Transaction = getLibraryTransactionModel(collegeConn);
  const Policy = getLibraryPolicyModel(collegeConn);
  const Book = getLibraryBookModel(collegeConn);
  const Student = getStudentModel(collegeConn);

  const transaction = await Transaction.findById(transactionId);
  if (!transaction) throw new ApiError(404, "Transaction not found");

  const policy = await Policy.findOne();

  const today = new Date();
  let fine = 0;

  if (transaction.paymentStatus === "none") {
    if (today > transaction.dueDate) {
      const overdueDays = Math.ceil(
        (today - transaction.dueDate) / (1000 * 60 * 60 * 24)
      );
      fine = overdueDays * policy.finePerDay;
      if (fine > policy.maxFine) {
        fine = policy.maxFine;
      }
    }

    transaction.fineAmount = fine;
    transaction.paymentStatus = fine > 0 ? "pending" : "paid";
    await transaction.save({ validateBeforeSave: false });
  }

  if (transaction.paymentStatus === "pending")
    throw new ApiError(400, "Fine not paid");

  if (transaction.transactionStatus !== "issued")
    throw new ApiError(400, "Invalid return state");

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        transaction,
        "Payment done or completed fetched successfully"
      )
    );
});

//mam click on return

export const returnBook = asyncHandler(async (req, res) => {
  const { transactionId } = req.body;
  const { collegeCode } = req.user;

  const masterConn = connectMasterDB();
  const College = getCollegeModel(masterConn);
  const college = await College.findOne({ collegeCode, status: "active" });
  if (!college) throw new ApiError(404, "College not found");

  const collegeConn = getCollegeDB(college.dbName);

  const Transaction = getLibraryTransactionModel(collegeConn);
  const Policy = getLibraryPolicyModel(collegeConn);
  const Book = getLibraryBookModel(collegeConn);
  const Student = getStudentModel(collegeConn);

  const transaction = await Transaction.findById(transactionId);
  if (!transaction) throw new ApiError(404, "Transaction not found");

  const book = await Book.findById(transaction.bookId);
  const student = await Student.findById(transaction.studentId);

  // Restore stock
  book.availableCopies += 1;

  // Remove from student's issued list
  student.issuedBooks = student.issuedBooks.filter(
    (id) => id.toString() !== transaction._id.toString()
  );

  transaction.transactionStatus = "returned";
  transaction.returnDate = new Date();

  await book.save({ validateBeforeSave: false });
  await student.save({ validateBeforeSave: false });
  await transaction.save({ validateBeforeSave: false });

  
});

// to see any library transaction single
export const fetchlibraryTransactionDetails = asyncHandler(async (req, res) => {
  const { transactionId } = req.params;
  const { collegeCode } = req.user;

  const masterConn = connectMasterDB();
  const College = getCollegeModel(masterConn);
  const college = await College.findOne({ collegeCode, status: "active" });
  if (!college) throw new ApiError(404, "College not found");

  const collegeConn = getCollegeDB(college.dbName);

  const Transaction = getLibraryTransactionModel(collegeConn);
  const transaction = await Transaction.findById(transactionId).populate({
    path: "bookId",
    select: "title author shelf transactionId",
  });
  console.log("The transaction is", transaction);

  res
    .status(200)
    .json(new ApiResponse(200, transaction, "Transaction fetched"));
});

export const getStudentLibraryHistory = asyncHandler(async (req, res) => {

  const { collegeCode, userId } = req.user;

  const masterConn = connectMasterDB();
  const College = getCollegeModel(masterConn);
  const college = await College.findOne({ collegeCode, status: "active" });
  if (!college) throw new ApiError(404, "College not found");

  const collegeConn = getCollegeDB(college.dbName);
  const Transaction = getLibraryTransactionModel(collegeConn);
  getLibraryBookModel(collegeConn);

  const history = await Transaction.find({ studentId: userId })
    .populate({ path: "bookId", select: "title author coverImage " })
    .sort({ createdAt: -1 });

    
  res
    .status(200)
    .json(new ApiResponse(200, history, "Library history fetched"));
});

export const getAllLibraryTransactions = asyncHandler(async (req, res) => {
  const { collegeCode } = req.user;

  const masterConn = connectMasterDB();
  const College = getCollegeModel(masterConn);
  const college = await College.findOne({ collegeCode, status: "active" });
  if (!college) throw new ApiError(404, "College not found");

  const collegeConn = getCollegeDB(college.dbName);
  const Transaction = getLibraryTransactionModel(collegeConn);

  const LibraryBooks = getLibraryBookModel(collegeConn);

  const transactions = await Transaction.find()
    .populate({
      path: "bookId",
      model: LibraryBooks,
      select: "title author coverImage",
    })
    .populate({ path: "studentId", select: "studentName email rollNo " })
    .sort({ createdAt: -1 });

  res
    .status(200)
    .json(
      new ApiResponse(200, transactions, "All library transactions fetched")
    );
});
