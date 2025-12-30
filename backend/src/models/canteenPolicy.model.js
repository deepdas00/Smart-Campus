import mongoose from "mongoose";

const CanteenPolicySchema = new mongoose.Schema({
  openingTime: {
    type: String, // store as "HH:mm" (e.g. "09:00")
    required: true
  },
  closingTime: {
    type: String, // store as "HH:mm" (e.g. "21:00")
    required: true
  },
  isActive: {
    type: Boolean, // true = canteen open, false = canteen disabled
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "CollegeUser", required: true },
},
  {
    timestamps: true
  });

export const getCanteenPolicyModel = (conn) => {
  if (!conn) {
    throw new Error("❌ Master DB connection is undefined");
  }
  return conn.models.CanteenPolicy || conn.model("CanteenPolicy", CanteenPolicySchema);
};