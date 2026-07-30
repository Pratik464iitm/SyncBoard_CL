const Note = require("../models/Note");
const Workspace = require("../models/Workspace");
const { requireMember, requireRole } = require("../utils/permissions");

const getWorkspaceWithAccess = async (workspaceId, userId) => {
  const workspace = await Workspace.findById(workspaceId);
  if (!workspace) {
    const err = new Error("Workspace not found");
    err.statusCode = 404;
    throw err;
  }
  requireMember(workspace, userId);
  return workspace;
};

// GET /api/workspaces/:workspaceId/notes
const getNotes = async (req, res, next) => {
  try {
    const workspace = await getWorkspaceWithAccess(req.params.workspaceId, req.user._id);
    const notes = await Note.find({ workspace: workspace._id })
      .populate("createdBy", "name email avatarUrl")
      .sort({ isPinned: -1, updatedAt: -1 });
    res.json({ notes });
  } catch (err) {
    next(err);
  }
};

// POST /api/workspaces/:workspaceId/notes
const createNote = async (req, res, next) => {
  try {
    const workspace = await getWorkspaceWithAccess(req.params.workspaceId, req.user._id);
    requireRole(workspace, req.user._id, "editor");

    const note = await Note.create({
      workspace: workspace._id,
      title: req.body.title || "Untitled Note",
      contentMarkdown: req.body.contentMarkdown || "",
      createdBy: req.user._id,
    });

    res.status(201).json({ note });
  } catch (err) {
    next(err);
  }
};

const findNoteWithAccess = async (noteId, userId) => {
  const note = await Note.findById(noteId);
  if (!note) {
    const err = new Error("Note not found");
    err.statusCode = 404;
    throw err;
  }
  const workspace = await Workspace.findById(note.workspace);
  requireMember(workspace, userId);
  return { note, workspace };
};

// PATCH /api/notes/:id
const updateNote = async (req, res, next) => {
  try {
    const { note } = await findNoteWithAccess(req.params.id, req.user._id);
    const { title, contentMarkdown } = req.body;
    if (title !== undefined) note.title = title;
    if (contentMarkdown !== undefined) note.contentMarkdown = contentMarkdown;
    await note.save();

    const io = req.app.get("io");
    io.to(`workspace:${note.workspace}`).emit("note:updated", note);

    res.json({ note });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/notes/:id/pin
const togglePinNote = async (req, res, next) => {
  try {
    const { note } = await findNoteWithAccess(req.params.id, req.user._id);
    note.isPinned = !note.isPinned;
    await note.save();
    res.json({ note });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/notes/:id
const deleteNote = async (req, res, next) => {
  try {
    const { note } = await findNoteWithAccess(req.params.id, req.user._id);
    await note.deleteOne();

    const io = req.app.get("io");
    io.to(`workspace:${note.workspace}`).emit("note:deleted", { id: note._id });

    res.json({ message: "Note deleted", id: note._id });
  } catch (err) {
    next(err);
  }
};

module.exports = { getNotes, createNote, updateNote, togglePinNote, deleteNote, findNoteWithAccess };
