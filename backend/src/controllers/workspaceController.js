const Workspace = require("../models/Workspace");
const Board = require("../models/Board");
const Task = require("../models/Task");
const Note = require("../models/Note");
const { requireMember, requireRole } = require("../utils/permissions");

// GET /api/workspaces
const getWorkspaces = async (req, res, next) => {
  try {
    const workspaces = await Workspace.find({ "members.user": req.user._id })
      .populate("members.user", "name email avatarUrl")
      .sort({ updatedAt: -1 });
    res.json({ workspaces });
  } catch (err) {
    next(err);
  }
};

// POST /api/workspaces
const createWorkspace = async (req, res, next) => {
  try {
    const { name, description, color } = req.body;
    if (!name) return res.status(400).json({ message: "Workspace name is required" });

    const workspace = await Workspace.create({
      name,
      description: description || "",
      color: color || "#4C6FFF",
      owner: req.user._id,
      members: [{ user: req.user._id, role: "owner" }],
    });

    res.status(201).json({ workspace });
  } catch (err) {
    next(err);
  }
};

// GET /api/workspaces/:id
const getWorkspace = async (req, res, next) => {
  try {
    const workspace = await Workspace.findById(req.params.id).populate(
      "members.user",
      "name email avatarUrl"
    );
    if (!workspace) return res.status(404).json({ message: "Workspace not found" });
    requireMember(workspace, req.user._id);
    res.json({ workspace });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/workspaces/:id
const updateWorkspace = async (req, res, next) => {
  try {
    const workspace = await Workspace.findById(req.params.id);
    if (!workspace) return res.status(404).json({ message: "Workspace not found" });
    requireRole(workspace, req.user._id, "admin");

    const { name, description, color } = req.body;
    if (name !== undefined) workspace.name = name;
    if (description !== undefined) workspace.description = description;
    if (color !== undefined) workspace.color = color;
    await workspace.save();

    res.json({ workspace });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/workspaces/:id
const deleteWorkspace = async (req, res, next) => {
  try {
    const workspace = await Workspace.findById(req.params.id);
    if (!workspace) return res.status(404).json({ message: "Workspace not found" });
    requireRole(workspace, req.user._id, "owner");

    const boards = await Board.find({ workspace: workspace._id });
    const boardIds = boards.map((b) => b._id);
    await Task.deleteMany({ board: { $in: boardIds } });
    await Board.deleteMany({ workspace: workspace._id });
    await Note.deleteMany({ workspace: workspace._id });
    await workspace.deleteOne();

    res.json({ message: "Workspace deleted" });
  } catch (err) {
    next(err);
  }
};

// GET /api/workspaces/:id/stats
const getWorkspaceStats = async (req, res, next) => {
  try {
    const workspace = await Workspace.findById(req.params.id);
    if (!workspace) return res.status(404).json({ message: "Workspace not found" });
    requireMember(workspace, req.user._id);

    const boards = await Board.find({ workspace: workspace._id, isArchived: false });
    const boardIds = boards.map((b) => b._id);
    const totalTasks = await Task.countDocuments({ board: { $in: boardIds } });
    const completedTasks = await Task.countDocuments({ board: { $in: boardIds }, status: "Done" });

    res.json({
      stats: {
        totalBoards: boards.length,
        totalTasks,
        completedTasks,
        totalMembers: workspace.members.length,
        storageUsedBytes: workspace.storageUsedBytes,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getWorkspaces,
  createWorkspace,
  getWorkspace,
  updateWorkspace,
  deleteWorkspace,
  getWorkspaceStats,
};
