import mongoose from "mongoose";

const UsersSchema = new mongoose.Schema(
  {
    displayName: {
      type: String,
    },
    role: {
      type: String,
      default: "user",
    },
    email: {
      type: String,
    },
    uuid: {
      type: String,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.User || mongoose.model("User", UsersSchema);
