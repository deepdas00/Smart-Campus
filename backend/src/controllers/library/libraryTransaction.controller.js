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
import { getCollegeStudentModel } from "../../models/collegeStudent.model.js";
import { sendMail } from "../../utils/sendMail.js";
import { buildBookReturnReminderTemplate } from "../../template/buildBookReturnReminderTemplate.js";
import { getCollegeInfoModel } from "../../models/colllegeInfo.model.js";
import { sendNotification } from "../../utils/sendNotification.js";
import { broadcastViaSocket } from "../../utils/websocketBroadcast.js";

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
  const Student = getCollegeStudentModel(collegeConn)

  const student = await Student.findById(userId);

  if (!student) return res.status(400).json({ message: "Student not finnd" })
  const book = await Book.findById(bookId);
  if (!book || !book.isActive) throw new ApiError(404, "Book not found");

  if (book.availableCopies <= 0) throw new ApiError(400, "Book not available");

  //generateTransactionCode
  const transactionCode = await generateTransactionCode(
    collegeCode,
    "L",
    Transaction
  );

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


  sendNotification(
    collegeConn,
    student.fcmToken,
    "Library Update 📖",
    "Your Order placed successfully!"
  );

  // 🔄 REAL-TIME UPDATE VIA WEBSOCKET (YOUR WAY)
    broadcastViaSocket(collegeCode, ["student", "admin", "librarian"], {
      event: "libTransactionUpdated",
      transaction
    });


  res
    .status(201)
    .json(new ApiResponse(201, transaction, "Book ordered successfully"));
});

export const issueBook = asyncHandler(async (req, res) => {
  const { transactionId } = req.params;
  const { collegeCode } = req.user;

  const masterConn = connectMasterDB();
  const College = getCollegeModel(masterConn);
  const college = await College.findOne({ collegeCode, status: "active" });
  if (!college) throw new ApiError(404, "College not found");

  const collegeConn = getCollegeDB(college.dbName);
  const Student = getCollegeStudentModel(collegeConn);
  const Transaction = getLibraryTransactionModel(collegeConn);


  const Book = getLibraryBookModel(collegeConn);
  const Policy = getLibraryPolicyModel(collegeConn);

  const transaction = await Transaction.findById(transactionId)
    .populate({ path: "bookId", select: "title author coverImage shelf" })
    .populate({ path: "studentId", select: "fullName" });
  if (!transaction) throw new ApiError(404, "Transaction not found");

  if (transaction.transactionStatus === "issued")
    return res.status(400).json({ message: "Book is already issued" });

  if (transaction.transactionStatus === "returned")
    return res.status(400).json({ message: "Book is already returned" });

  const student = await Student.findById(transaction.studentId);

  // Load policy
  const policy = await Policy.findOne();

  if (student.issuedBooks.length >= policy.maxBooksAllowed) {
    return res.status(400).json({ message: `Student have already issued ${policy.maxBooksAllowed} books` })
  }

  const book = await Book.findById(transaction.bookId);
  if (!book || book.availableCopies <= 0)
    return res.status(400).json({ message: "Book not available" })





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

  const responseTransaction = await Transaction.findById(transactionId)
    .populate({
      path: "studentId",
      select: "studentName rollNo mobileNo avatar",
    })
    .populate({
      path: "bookId",
      select: "coverImage isbn shelf author title",
    });

  // 🔄 REAL-TIME UPDATE VIA WEBSOCKET (YOUR WAY)
  broadcastViaSocket(collegeCode, ["student", "admin", "librarian"], {
    event: "bookUpdated",
    book
  });

    // 🔄 REAL-TIME UPDATE VIA WEBSOCKET (YOUR WAY)
    broadcastViaSocket(collegeCode, ["student", "admin", "librarian"], {
      event: "libTransactionUpdated",
      transaction
    });

  res
    .status(200)
    .json(
      new ApiResponse(200, responseTransaction, "Book issued successfully")
    );
});

// mam scan the qr
export const finalizeReturn = asyncHandler(async (req, res) => {
  const { transactionId } = req.params;
  const { collegeCode } = req.user;



  const masterConn = connectMasterDB();
  const College = getCollegeModel(masterConn);
  const college = await College.findOne({ collegeCode, status: "active" });
  if (!college) throw new ApiError(404, "College not found");

  const collegeConn = getCollegeDB(college.dbName);

  const Transaction = getLibraryTransactionModel(collegeConn);
  const Policy = getLibraryPolicyModel(collegeConn);
  const Book = getLibraryBookModel(collegeConn);
  const Student = getCollegeStudentModel(collegeConn);

  const transaction = await Transaction.findById(transactionId)
    .populate({ path: "bookId", select: "title author coverImage shelf" })
    .populate({ path: "studentId", select: "fullName" })


  if (!transaction) throw new ApiError(404, "Transaction not found");

  if (transaction.transactionStatus === "pending") {
    return res.status(400).json({ message: "Order is not issued" })
  }

  if (transaction.transactionStatus === "returned")
    return res.status(400).json({ message: "Book Already returned" })


  const policy = await Policy.findOne();

  const today = new Date();
  let fine = 0;

  if (transaction.paymentStatus === "none") {


    const today = new Date();

    const graceDeadline = new Date(transaction.dueDate);
    graceDeadline.setDate(graceDeadline.getDate() + 1);  // ⏳ +1 day grace

    if (today > graceDeadline) {
      const overdueDays = Math.ceil(
        (today - graceDeadline) / (1000 * 60 * 60 * 24)
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
    return res.status(400).json({ message: "!!OVERDUE: Pay the fine first!!" })


  // 🔄 REAL-TIME UPDATE VIA WEBSOCKET (YOUR WAY)
    broadcastViaSocket(collegeCode, ["student", "admin", "librarian"], {
      event: "libTransactionUpdated",
      transaction
    });

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
  const Student = getCollegeStudentModel(collegeConn);

  const transaction = await Transaction.findById(transactionId)
    .populate({ path: "bookId", select: "title author coverImage shelf" })
    .populate({ path: "studentId", select: "fullName" });

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


    // 🔄 REAL-TIME UPDATE VIA WEBSOCKET (YOUR WAY)
    broadcastViaSocket(collegeCode, ["student", "admin", "librarian"], {
      event: "libTransactionUpdated",
      transaction
    });

    // 🔄 REAL-TIME UPDATE VIA WEBSOCKET (YOUR WAY)
    broadcastViaSocket(collegeCode, ["student", "admin", "librarian"], {
      event: "studentUpdated",
      transaction
    });



  // 🔄 REAL-TIME UPDATE VIA WEBSOCKET (YOUR WAY)
    broadcastViaSocket(collegeCode, ["student", "admin", "librarian"], {
      event: "bookUpdated",
      book
    });



  res.status(200).json({ message: `#${transaction.transactionCode} book return succesfully` })
});

// to see any library transaction
export const fetchlibraryTransactionDetails = asyncHandler(async (req, res) => {
  const { transactionId } = req.params;
  const { collegeCode } = req.user;

  const masterConn = connectMasterDB();
  const College = getCollegeModel(masterConn);
  const college = await College.findOne({ collegeCode, status: "active" });
  if (!college) throw new ApiError(404, "College not found");

  const collegeConn = getCollegeDB(college.dbName);
  const Student = getCollegeStudentModel(collegeConn);
  const LibraryBooks = getLibraryBookModel(collegeConn);
  const Transaction = getLibraryTransactionModel(collegeConn);
  const transaction = await Transaction.findById(transactionId)
    .populate({
      path: "bookId",
      select: "title author shelf transactionId coverImage",
    })
    .populate({
      path: "studentId",
      select: "fullName rollNo mobileNo profilePhoto",
    });



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
  const Student = getCollegeStudentModel(collegeConn);

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
  const Student = getCollegeStudentModel(collegeConn);




  const transactions = await Transaction.find()
    .populate({
      path: "bookId",
      model: LibraryBooks,
      select: "title author coverImage coverImage",
    })
    .populate({ path: "studentId", select: "fullName email rollNo" })
    .sort({ createdAt: -1 });



  res
    .status(200)
    .json(
      new ApiResponse(200, transactions, "All library transactions fetched")
    );
});


export const notifyReturnReminders = asyncHandler(async (req, res) => {
  const { collegeCode } = req.user;

  const masterConn = connectMasterDB();
  const College = getCollegeModel(masterConn);
  const college = await College.findOne({ collegeCode, status: "active" });
  if (!college) throw new ApiError(404, "College not found");

  const collegeConn = getCollegeDB(college.dbName);
  const LibraryTransaction = getLibraryTransactionModel(collegeConn);
  const Student = getCollegeStudentModel(collegeConn);
  const Book = getLibraryBookModel(collegeConn)
  const LibraryPolicy = getLibraryPolicyModel(collegeConn)

  const libraryPolicy = await LibraryPolicy.findOne()
  const fineAmount = libraryPolicy.finePerDay


  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const issuedBooks = await LibraryTransaction.find({
    transactionStatus: "issued"
  });

  let notifiedCount = 0;

  for (const tx of issuedBooks) {

    const returnDate = new Date(tx.dueDate);
    returnDate.setHours(0, 0, 0, 0);

    const book = await Book.findById(tx.bookId)
    const bookTitle = book.title


    const diffDays = Math.ceil((returnDate - today) / (1000 * 60 * 60 * 24));

    if (diffDays === 1 || diffDays === 2) {

      const student = await Student.findById(tx.studentId);

      if (student?.email) {
        await sendMail({
          to: student.email,
          subject: "Smart Campus - Book Return Reminder",
          html: buildBookReturnReminderTemplate(
            student.studentName,
            book.title,
            diffDays,
            returnDate.toDateString(),
            college.collegeName,
            fineAmount
          )
        });
        notifiedCount++;
      }
    }
  }

  res.status(200).json(
    new ApiResponse(200, { notifiedCount }, "Return reminders sent")
  );
});
