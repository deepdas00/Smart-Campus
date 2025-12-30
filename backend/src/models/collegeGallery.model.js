import mongoose from "mongoose";

const collegeGallerySchema = new mongoose.Schema(
  {
    image: {
      type: String,          // Cloudinary URL
      required: true,
      trim: true
    },

    description: {
      type: String,
      trim: true,
      default: ""
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CollegeUser",    // admin / staff
      required: true
    }
  },
  { timestamps: true }
);

export const getCollegeGalleryModel = (conn) => {
  return conn.models.CollegeGallery ||
         conn.model("CollegeGallery", collegeGallerySchema);
};
