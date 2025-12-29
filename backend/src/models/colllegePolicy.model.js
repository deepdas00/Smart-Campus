import mongoose from "mongoose";

const collegePolicySchema = new mongoose.Schema(
  {
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

export const getCollegePolicyModel = (conn) => {
  return conn.models.CollegePolicy ||
         conn.model("CollegePolicy", collegePolicySchema);
};
