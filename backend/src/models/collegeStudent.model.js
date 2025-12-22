
import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { log } from "console";




const collegeStudentSchema = new Schema(
  {
    studentName: String,
    rollNo: { type: String, unique: true },
    mobileNo: {type: String, unique: true},
    email: { type: String, unique: true },
    password: String,
    avatar: String,
    role: {type: String, default: "student"},
    refreshToken: { type: String, select: false , default: null},
  },
  { timestamps: true }
);

export const getStudentModel = (conn) => {  
  if (!conn) {
    throw new Error(`❌ College DB connection is undefined`);
  }
  
  return conn.models.CollegeStudent || conn.model("CollegeStudent", collegeStudentSchema);
};
