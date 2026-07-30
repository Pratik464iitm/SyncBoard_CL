const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: ["task_assigned", "mention", "workspace_invite", "task_completed", "file_uploaded", "comment"],
      required: true,
    },
    message: { type: String, required: true },
    relatedWorkspace: { type: mongoose.Schema.Types.ObjectId, ref: "Workspace" },
    relatedBoard: { type: mongoose.Schema.Types.ObjectId, ref: "Board" },
    relatedTask: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
    relatedNote: { type: mongoose.Schema.Types.ObjectId, ref: "Note" },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
