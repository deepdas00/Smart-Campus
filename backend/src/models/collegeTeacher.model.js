import mongoose, { Schema } from "mongoose";

const collegeteacherSchema = new Schema(
  {
    // =======================
    // 🧾 Identity Information
    // =======================
    teacherCode: {
      type: String,
      required: true,
      unique: true,
      index: true
    },

    employeeId: {
      type: String,
      required: true,
      unique: true
    },

    fullName: {
      type: String,
      required: true,
      trim: true
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true
    },

    dob: Date,

    profilePhoto: {
      type: String   // Cloudinary URL
    },

    // =======================
    // 📞 Contact Information
    // =======================
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },

    phone: {
      type: String,
      required: true
    },

    alternatePhone: String,

    address: {
      line1: String,
      city: String,
      state: String,
      pincode: String
    },

    // =======================
    // 🎓 Professional Info
    // =======================
    department: {
      type: Schema.Types.ObjectId,
      ref: "CollegeDepartment",
    },

    designation: {
      type: String,
      required: true
    },

    qualification: String,

    specialization: [String],

    experienceYears: {
      type: Number,
    },

    joiningDate: {
      type: Date,
      required: true
    },

    employmentType: {
      type: String,
      enum: ["permanent", "guest", "contract"],
      default: "permanent"
    },

    // =======================
    // 🔐 Authentication
    // =======================
    loginId: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: true,
      select: false
    },

    role: {
      type: String,
      default: "teacher"
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
    // 📚 Academic Responsibilities
    // =======================
    subjects: [
      {
        type: Schema.Types.ObjectId,
        ref: "Subject"
      }
    ],

    // =======================
    // 💰 Payroll & HR
    // =======================
    salary: {
      base: Number,
      allowances: Number,
      deductions: Number,
      net: Number
    },

    bankDetails: {
      accountNo: String,
      ifsc: String,
      bankName: String
    },

    // =======================
    // 📊 Activity & Performance
    // =======================

    totalLeaves: {
      type: Number,
      default: 0
    },

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
  {
    timestamps: true
  }
);

export const getCollegeTeacherModel = (conn) => {
  return (
    conn.models.CollegeTeacher ||
    conn.model("CollegeTeacher", collegeteacherSchema)
  );
};
