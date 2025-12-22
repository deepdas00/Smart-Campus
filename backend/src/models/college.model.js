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

    dbName: {
      type: String,
      required: true,
      
    },

    status: {
      type: String,
      enum: ["pending", "active"],
      default: "pending",
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
