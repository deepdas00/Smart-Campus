import { connectMasterDB, getCollegeDB } from "../../db/db.index.js";
import { getCollegeModel } from "../../models/college.model.js";
import { getLibraryBookModel } from "../../models/libraryBook.model.js";
import { uploadOnCloudinary } from "../../utils/cloudinary.js";
import { ApiError } from "../../utils/apiError.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { broadcastViaSocket } from "../../utils/websocketBroadcast.js";

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

  if (rating > 5) {
    res.status(401).json({ message: "rating can not be graterthan 5!!!" })
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



  // 🔄 REAL-TIME UPDATE VIA WEBSOCKET (YOUR WAY)
    broadcastViaSocket(collegeCode, ["student", "admin", "librarian"], {
      event: "bookUpdated",
      book
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
  const { description, publishedYear, publisher, title, author, category, rating, totalCopies, shelf, isbn, availableCopies } = req.body;


  const { collegeCode } = req.user;
  if (rating > 5) {
    res.status(401).json({ message: "rating can not be graterthan 5!!!" })
  }
  const masterConn = connectMasterDB();
  const College = getCollegeModel(masterConn);

  const college = await College.findOne({ collegeCode, status: "active" });
  if (!college) throw new ApiError(404, "College not found");

  const collegeConn = getCollegeDB(college.dbName);
  const LibraryBook = getLibraryBookModel(collegeConn);

  const existingBook = await LibraryBook.findById(bookId);
  if (!existingBook) throw new ApiError(404, "Book not found");




  if (req.file?.path) {
    const imagePath = req.file?.path?.replace(/\\/g, "/");
    console.log(imagePath);

    const uploadResult = await uploadOnCloudinary(imagePath);
    console.log(uploadResult);

    existingBook.coverImage = uploadResult.url
  }

  existingBook.description = description ? description : existingBook.description
  existingBook.publishedYear = publishedYear ? publishedYear : existingBook.publishedYear
  existingBook.publisher = publisher ? publisher : existingBook.publisher
  existingBook.title = title ? title : existingBook.title
  existingBook.author = author ? author : existingBook.author
  existingBook.category = category ? category : existingBook.category
  existingBook.rating = rating ? rating : existingBook.rating
  existingBook.totalCopies = totalCopies ? totalCopies : existingBook.totalCopies
  existingBook.shelf = shelf ? shelf : existingBook.shelf
  existingBook.isbn = isbn ? isbn : existingBook.isbn
  existingBook.availableCopies = availableCopies ? availableCopies : existingBook.availableCopies
  // // 🖼️ If new cover image is provided
  // if (req.file) {
  //   const coverPath = req.file.path.replace(/\\/g, "/");

  //   const uploadedCover = await uploadOnCloudinary(coverPath);
  //   updates.coverImage = uploadedCover.url;
  // }

  // 🔄 Apply updates

  existingBook.save()
  // const updatedBook = await LibraryBook.findByIdAndUpdate(
  //   bookId,
  //   updates,
  //   { new: true }
  // );


  // 🔄 REAL-TIME UPDATE VIA WEBSOCKET (YOUR WAY)
    broadcastViaSocket(collegeCode, ["student", "admin", "librarian"], {
      event: "bookUpdated",
      book
    });


  res.status(200).json(new ApiResponse(200, existingBook, "Book updated"));
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



    // 🔄 REAL-TIME UPDATE VIA WEBSOCKET (YOUR WAY)
    broadcastViaSocket(collegeCode, ["student", "admin", "librarian"], {
      event: "bookDeleted",
      _id:bookId
    });

  res.status(200).json(new ApiResponse(200, null, "Book removed"));
});

