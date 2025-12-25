import mongoose from "mongoose";

export const libraryBookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    author: {
      type: String,
      required: true
    },

    category: {
      type: String,
      required: true
    },

    rating: {
      type: Number,
      default: 0
    },

    totalCopies: {
      type: Number,
      required: true,
      min: 1
    },

    availableCopies: {
      type: Number,
      required: true
    },

    shelf: {
      type: String,
      required: true
    },

    isbn: {
      type: String,
      unique: true,
      sparse: true
    },

    publisher: String,

    publishedYear: Number,

    coverImage: {
      type: String,
      required: true  
    },

    description: String,

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export const getLibraryBookModel = (conn) => {
  return conn.models.LibraryBook || conn.model("LibraryBook", libraryBookSchema);
};
