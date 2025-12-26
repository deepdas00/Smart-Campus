import { connectMasterDB, getCollegeDB } from "../../db/db.index.js";
import { getCollegeModel } from "../../models/college.model.js";
import { getLibraryBookModel } from "../../models/libraryBook.model.js";
import { uploadOnCloudinary } from "../../utils/cloudinary.js";
import { ApiError } from "../../utils/apiError.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

/* =========================
   ADD BOOK (Librarian/Admin)
========================= */

export const addBook = asyncHandler(async (req, res) => {

  const { collegeCode } = req.user;

  const {
    title,
    author,
    category,
    rating,
    totalCopies,
    availableCopies,
    shelf,
    isbn,
    publisher,
    publishedYear,
    description
  } = req.body;

  if (!title || !author || !category || !totalCopies || !shelf) {
    throw new ApiError(400, "Required book fields missing");
  }

  const coverPath = req.file?.path?.replace(/\\/g, "/");
  if (!coverPath) throw new ApiError(400, "Book cover image required");

  // Resolve College DB
  const masterConn = connectMasterDB();
  const College = getCollegeModel(masterConn);

  const college = await College.findOne({ collegeCode, status: "active" });
  if (!college) throw new ApiError(404, "College not found");

  const collegeConn = getCollegeDB(college.dbName);
  const LibraryBook = getLibraryBookModel(collegeConn);

  // Upload cover image
  const uploadedCover = await uploadOnCloudinary(coverPath);

  const book = await LibraryBook.create({
    title,
    author,
    category,
    rating,
    totalCopies,
    availableCopies,
    shelf,
    isbn,
    publisher,
    publishedYear,
    coverImage: uploadedCover.url,
    description
  });

  res.status(201).json(new ApiResponse(201, book, "Book added successfully"));
});

//for menu
export const getAllBooks = asyncHandler(async (req, res) => {

  const { collegeCode } = req.user;

  const masterConn = connectMasterDB();
  const College = getCollegeModel(masterConn);

  const college = await College.findOne({ collegeCode, status: "active" });
  if (!college) throw new ApiError(404, "College not found");

  const collegeConn = getCollegeDB(college.dbName);
  const LibraryBook = getLibraryBookModel(collegeConn);

  const books = await LibraryBook.find({ isActive: true });

  res.status(200).json(new ApiResponse(200, books, "Books fetched"));
});

export const updateBook = asyncHandler(async (req, res) => {

  const { bookId } = req.params;
  const updates = req.body;

  const { collegeCode } = req.user;

  const masterConn = connectMasterDB();
  const College = getCollegeModel(masterConn);

  const college = await College.findOne({ collegeCode, status: "active" });
  if (!college) throw new ApiError(404, "College not found");

  const collegeConn = getCollegeDB(college.dbName);
  const LibraryBook = getLibraryBookModel(collegeConn);

  const book = await LibraryBook.findByIdAndUpdate(bookId, updates, { new: true }); //new: true means return updated document(book) not old one

  if (!book) throw new ApiError(404, "Book not found");

  res.status(200).json(new ApiResponse(200, book, "Book updated"));
});


export const deleteBook = asyncHandler(async (req, res) => {

  const { bookId } = req.params;
  const { collegeCode } = req.user;

  const masterConn = connectMasterDB();
  const College = getCollegeModel(masterConn);

  const college = await College.findOne({ collegeCode, status: "active" });
  if (!college) throw new ApiError(404, "College not found");

  const collegeConn = getCollegeDB(college.dbName);
  const LibraryBook = getLibraryBookModel(collegeConn);

  const book = await LibraryBook.findByIdAndUpdate(bookId, { isActive: false });

  if (!book) throw new ApiError(404, "Book not found");

  res.status(200).json(new ApiResponse(200, null, "Book removed"));
});

