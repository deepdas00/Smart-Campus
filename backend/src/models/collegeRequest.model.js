import mongoose from "mongoose";

const collegeRequestSchema = new mongoose.Schema(
  {

   collegeCode: {
      type: String,
      unique: true,
      required: true,
      uppercase: true,
    },
    
    collegeName: {
      type: String,
      required: true
    },

    officialEmail: {
      type: String,
      required: true,
      unique: true
    },

    contactPersonName: {
      type: String,
      required: true
    },

    contactNumber: {
      type: String,
      required: true
    },

    address: {
      type: String,
      required: true
    },

    principalName: {
      type: String,
      required: true
    },

    documents: [
      {
        type: String   // Cloudinary URLs
      }
    ],


  },
  { timestamps: true }
);

export const getCollegeRequestModel = (conn) => {
  return conn.models.CollegeRequest ||
         conn.model("CollegeRequest", collegeRequestSchema);
};
