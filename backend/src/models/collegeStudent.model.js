
import mongoose, { Schema } from "mongoose";

const collegeStudentSchema = new Schema(
  {
    // =======================
    // 🧾 Identity & Admission
    // =======================

    fullName: {
      type: String,
      required: true,
      trim: true
    },

    rollNo: {
      type: String,
      required: true,
    },

    registrationNo: {
      type: String,
    },



    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true
    },
    
    dob: {
      type: Date,
      required: true
    },

    profilePhoto: String,

    admissionYear: {
      type: Number,
      required: true
    },

    bloodGroup:{
      type: String
    },

    nationality:{
      type: String
    },

    lastQualification:{
      board: String,
      examName: String,
      percentage: String
    },

    ABC_Id: String,

    disability: String,
    // =======================
    // 📞 Contact Information
    // =======================
    email: {
      type: String,
      required: true,
      lowercase: true
    },

    phone: {
      type: String,
      required: true,
    },

    alternatePhone: String,

    address: {
      line1: String,
      city: String,
      state: String,
      pincode: String
    },

    emergencyContact: {
      name: String,
      relation: String,
      phone: String
    },

    // =======================
    // 👨‍👩‍👦 Guardian Info
    // =======================
    fatherName: String,
    motherName: String,
    guardianName: String,
    guardianPhone: String,

    // =======================
    // 🏫 Academic Structure
    // =======================
    department: {
      type: Schema.Types.ObjectId,
      ref: "CollegeDepartment",
      required: true
    },

    // =======================
    // 🔐 Authentication
    // =======================
    loginId: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
      select: false
    },

    role: {
      type: String,
      default: "student"
    },

    isActive: {
      type: Boolean,
      default: true
    },

    resetPasswordOTP: {
      type: String,
      default: null
    },

    resetPasswordOTPExpiry: {
      type: Date,
      default: null
    },


    // =======================
    // 📚 Library & Campus
    // =======================
    issuedBooks: [
      {
        type: Schema.Types.ObjectId,
        ref: "LibraryTransaction"
      }
    ],

    // =======================
    // 🧬 System Metadata
    // =======================
    collegeCode: {
      type: String,
      required: true,
      index: true
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "CollegeUser"
    }

  },
  { timestamps: true }
);



collegeStudentSchema.index({ rollNo: 1, collegeCode: 1 }, { unique: true });
collegeStudentSchema.index({ email: 1, collegeCode: 1 }, { unique: true });
collegeStudentSchema.index({ phone: 1, collegeCode: 1 }, { unique: true });


export const getCollegeStudentModel = (conn) => {
  return (
    conn.models.CollegeStudent ||
    conn.model("CollegeStudent", collegeStudentSchema)
  );
};
