import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    reportCode: {
      type: String,
      unique: true,
      required: true
    },
    building:{
      type:String,
      default: ""
    },
    room:{
      type:String,
      default: ""
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
    zone:{
      type: String,
      default: ""
    },

    priority:{
      type: String,
      enum:["standard","medium","urgent"]
    },

    image: {
      type: String,
      default: ""
    },

    // location: {
    //   type: String
    // },

    status: {
      type: String,
      enum: ["submitted", "viewed", "in_progress", "resolved", "rejected", "closed"],
      default: "submitted"
    },

    adminNote: {
      type: String,
      default: ""
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
