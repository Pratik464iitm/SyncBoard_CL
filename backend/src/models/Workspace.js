const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    role: { type: String, enum: ["owner", "admin", "editor", "viewer"], default: "editor" },
    joinedAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const workspaceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    color: { type: String, default: "#4C6FFF" },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    members: [memberSchema],
    storageUsedBytes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

workspaceSchema.methods.getMemberRole = function (userId) {
  const member = this.members.find((m) => m.user.toString() === userId.toString());
  return member ? member.role : null;
};

module.exports = mongoose.model("Workspace", workspaceSchema);
