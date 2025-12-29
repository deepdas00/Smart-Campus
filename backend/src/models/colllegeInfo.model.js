import mongoose from "mongoose";

const collegeInfoSchema = new mongoose.Schema(
  {
    collegeCode: {
      type: String,
      unique: true,
      required: true,
      uppercase: true,
      index: true
    },

    collegeName: {
      type: String,
      required: true,
      trim: true
    },

    officialEmail: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    registrationNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    address: {
      type: String,
      required: true,
      trim: true
    },

    NAAC: {
      type: String,
      default: null
    },

    contactPersonName: {
      type: String,
      required: true,
      trim: true
    },

    contactNumber: {
      type: String,
      required: true,
      trim: true
    },

    principalName: {
      type: String,
      required: true,
      trim: true
    },

    logo: {
      type: String, // Cloudinary URL
      default: null
    },
    description:{
      type: String,
      default: ""
    },
    departmentName: [
      {
        type: String,
        required: true,
        trim: true
      }
    ]
  },
  { timestamps: true }
);

export const getCollegeInfoModel = (conn) => {
  return conn.models.CollegeInfo ||
         conn.model("CollegeInfo", collegeInfoSchema);
};
