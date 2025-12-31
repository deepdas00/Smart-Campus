
import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { log } from "console";
import { stringify } from "querystring";
import { type } from "os";




const collegeStudentSchema = new Schema(
  {
    studentName: String,
    rollNo:
    {
      type: String,
      unique: true
    },
    mobileNo:
    {
      type: String,
      unique: true
    },
    email:
    {
      type: String,
      unique: true
    },
    password: String,
    avatar: String,
    role:
    {
      type: String,
      default: "student"
    },
    department: {
      type: String,
      required: true
    },
    admissionYear: {
      type: Number,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true
    },
    issuedBooks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "LibraryTransaction"
      }
    ],
    resetPasswordOTP: {
      type: String,
      default: null
    },

    resetPasswordOTPExpiry: {
      type: Date,
      default: null
    },

    refreshToken: { type: String, default: null },
  },
  { timestamps: true }
);

export const getStudentModel = (conn) => {
  if (!conn) {
    throw new Error(`❌ College DB connection is undefined`);
  }

  return conn.models.CollegeStudent || conn.model("CollegeStudent", collegeStudentSchema);
};
