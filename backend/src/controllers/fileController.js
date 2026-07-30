const Task = require("../models/Task");
const Note = require("../models/Note");
const Workspace = require("../models/Workspace");
const { requireMember } = require("../utils/permissions");

// POST /api/files/upload  (multipart form-data: file, ownerType, ownerId, workspaceId)
const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file was uploaded" });

    const { ownerType, ownerId, workspaceId } = req.body;
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) return res.status(404).json({ message: "Workspace not found" });
    requireMember(workspace, req.user._id);

    const fileMeta = {
      filename: req.file.originalname,
      url: `/uploads/${req.file.filename}`,
      sizeBytes: req.file.size,
    };

    if (ownerType === "task") {
      const task = await Task.findById(ownerId);
      if (!task) return res.status(404).json({ message: "Task not found" });
      task.attachments.push(fileMeta);
      await task.save();
    } else if (ownerType === "note") {
      const note = await Note.findById(ownerId);
      if (!note) return res.status(404).json({ message: "Note not found" });
      note.attachments.push(fileMeta);
      await note.save();
    }

    workspace.storageUsedBytes += req.file.size;
    await workspace.save();

    res.status(201).json({ file: fileMeta });
  } catch (err) {
    next(err);
  }
};

module.exports = { uploadFile };
