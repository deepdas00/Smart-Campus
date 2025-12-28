import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    reportCode: {
      type: String,
      unique: true,
      required: true
    },
    building:{
      type:String
    },
    room:{
      type:String
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true
    },
 
    category: {
      type: String,
      enum: ["researchandlab", "housinganddorms", "groundandpublic"],
      required: true
    },

    priority:{
      type: String,
      enum:["standard","medium","urgent"]
    },

    image: {
      type: String
    },

    location: {
      type: String
    },

    status: {
      type: String,
      enum: ["submitted", "viewed", "in_progress", "resolved", "rejected", "closed"],
      default: "submitted"
    },

    adminNote: {
      type: String
    },

    rating: {
      type: Number,
      min: 1,
      max: 5
    }
  },
  { timestamps: true }
);

export const getReportModel = (conn) => {
  return conn.models.Report || conn.model("Report", reportSchema);
};
