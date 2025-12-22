import mongoose from "mongoose";

const collegeUserSchema = new mongoose.Schema(
  {
    loginId: {
      type: String,
      required: true,
      unique: true,
    },

    role: {
      type: String,
      enum: ["admin", "librarian", "canteen"],
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    createdBySystem: {
      type: Boolean,
      default: true,
    },

    refreshToken: {
      type: String,
      default: null
    }
  },
  { timestamps: true }
);

export const getCollegeUserModel = (conn) => {
  return (
    conn.models.CollegeUser ||
    conn.model("CollegeUser", collegeUserSchema)
  );
};
