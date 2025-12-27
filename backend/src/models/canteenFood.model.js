import mongoose from "mongoose";

export const canteenFoodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      trim: true
    },

    image: {
      type: String, // Cloudinary URL
      required: true
    },

    price: {
      type: Number,
      required: true,
      min: 0
    },

    quantityAvailable: {
      type: Number,
      required: true,
      min: 0
    },

    isAvailable: {
      type: Boolean,
      default: true
    },

    category: {
      type: String,
      enum: ["snacks", "meal", "drink", "sweet"],
      required: true
    },

    foodType: {
      type: String,
      enum: ["veg", "non-veg"],
      required: true
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CollegeUser" // canteen staff/admin
    }
  },
  {
    timestamps: true
  }
);

export const getCanteenFoodModel = (conn) => {
  return conn.models.CanteenFood ||
    conn.model("CanteenFood", canteenFoodSchema);
};


