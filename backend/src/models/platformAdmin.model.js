import mongoose ,{model} from "mongoose";

const platformAdminSchema = new mongoose.Schema(
  {
    loginId: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: true
    },

    name: {
      type: String,
      required: true
    },

    isSuperAdmin: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export const getPlatformAdminModel = (conn) => {
  return conn.models.PlatformAdmin ||
         conn.model("PlatformAdmin", platformAdminSchema);
};
