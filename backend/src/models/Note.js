const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    workspace: { type: mongoose.Schema.Types.ObjectId, ref: "Workspace", required: true },
    title: { type: String, default: "Untitled Note", trim: true },
    contentMarkdown: { type: String, default: "" },
    isPinned: { type: Boolean, default: false },
    attachments: [
      {
        filename: String,
        url: String,
        sizeBytes: Number,
      },
    ],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Note", noteSchema);
