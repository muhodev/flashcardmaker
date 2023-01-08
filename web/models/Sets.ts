import mongoose from "mongoose";

const SetsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      reuired: true,
    },
    description: {
      type: String,
    },
    owner: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
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

export default mongoose.models.Set || mongoose.model("Set", SetsSchema);
