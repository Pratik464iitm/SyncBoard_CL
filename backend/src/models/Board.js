const mongoose = require("mongoose");

const boardSchema = new mongoose.Schema(
  {
    workspace: { type: mongoose.Schema.Types.ObjectId, ref: "Workspace", required: true },
    name: { type: String, required: true, trim: true },
    color: { type: String, default: "#4C6FFF" },
    columns: {
      type: [String],
      default: ["To Do", "In Progress", "In Review", "Done"],
    },
    isArchived: { type: Boolean, default: false },
    isFavorite: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Board", boardSchema);
