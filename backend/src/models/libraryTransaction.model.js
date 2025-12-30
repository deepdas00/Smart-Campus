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

    razorpayOrderId: String,
    razorpayPaymentId: String,

    issueDate: Date,
    dueDate: Date,
    returnDate: Date,

    fineAmount: { type: Number, default: 0 },

    qrCode: String,

    // ⏳ AUTO DELETE FIELD
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() +  24 * 60 * 60 * 1000)
    }
  },
  { timestamps: true }
);

// 🧹 TTL INDEX
libraryTransactionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const getLibraryTransactionModel = (conn) => {
  return conn.models.LibraryTransaction ||
    conn.model("LibraryTransaction", libraryTransactionSchema);
};
