import mongoose from "mongoose";

const collegeDepartmentSchema = new mongoose.Schema({
  departmentName: {
    type: String,
    required: true,
    trim: true
  },

  shortCode: {
    type: String,
    required: true,
    uppercase: true
  },

  isActive: {
    type: Boolean,
    default: true
  }

}, { timestamps: true });

collegeDepartmentSchema.index({ departmentName: 1 }, { unique: true });

export const getCollegeDepartmentModel = (conn) => {
  return conn.models.CollegeDepartment ||
         conn.model("CollegeDepartment", collegeDepartmentSchema);
};
