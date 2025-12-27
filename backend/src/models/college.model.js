import mongoose, { Schema } from "mongoose";

const collegeSchema = new Schema(
  {
    collegeCode: {
      type: String,
      unique: true,
      required: true,
      uppercase: true,
    },

    collegeName: {
      type: String,
      required: true,
    },
    officialEmail: {
      type: String,
      required: true,
      unique: true
    },
    registrationNumber: {
      type: String,
      required: true,
      unique: true
    },
    address: {
      type: String,
      required: true
    },

    contactPersonName: {
      type: String,
      required: true
    },
    contactNumber: {
      type: String,
      required: true
    },
    dbName: {
      type: String,
      required: true,

    },
    documents: [
      {
        type: String   // Cloudinary URLs
      }
    ],

    status: {
      type: String,
      enum: ["inActive", "active"],
      default: "inActive",
    },
  },
  { timestamps: true }
);

// IMPORTANT: model must be attached to given connection
export const getCollegeModel = (conn) => {
  if (!conn) {
    throw new Error("❌ Master DB connection is undefined");
  }
  return conn.models.College || conn.model("College", collegeSchema);
};

