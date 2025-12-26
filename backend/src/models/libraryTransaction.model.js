import mongoose from "mongoose";

const libraryTransactionSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "CollegeStudent", required: true },
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: "LibraryBook", required: true },
    transactionCode: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
    transactionStatus: {
      type: String,
      enum: ["pending", "issued", "returned"],
      default: "pending"
    },

    paymentStatus: {
      type: String,
      enum: ["none", "pending", "paid"],
      default: "none"
    },
    razorpayOrderId: {
      type: String
    },
    razorpayPaymentId: {
      type: String
    },
    issueDate: Date,
    dueDate: Date,
    returnDate: Date,

    fineAmount: { type: Number, default: 0 },

    qrCode: String
  },
  { timestamps: true }
);

export const getLibraryTransactionModel = (conn) => {
  return conn.models.LibraryTransaction ||
    conn.model("LibraryTransaction", libraryTransactionSchema);
};
