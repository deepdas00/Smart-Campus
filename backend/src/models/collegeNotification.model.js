import mongoose from "mongoose";

const collegeNotificationSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ["event", "academic", "security", "holiday", "other"],
      required: true,
      index: true
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true,
      trim: true
    },

    pic: {
      type: String,   // Cloudinary URL
      default: null
    },

    expireAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

// ⏳ Auto-delete expired notifications
collegeNotificationSchema.index(
  { expireAt: 1 },
  { expireAfterSeconds: 0 }
);

export const getCollegeNotificationModel = (conn) => {
  return conn.models.CollegeNotification ||
         conn.model("CollegeNotification", collegeNotificationSchema);
};
