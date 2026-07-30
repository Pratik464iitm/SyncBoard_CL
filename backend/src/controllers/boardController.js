const Board = require("../models/Board");
const Task = require("../models/Task");
const Workspace = require("../models/Workspace");
const { requireMember, requireRole } = require("../utils/permissions");

// GET /api/workspaces/:workspaceId/boards
const getBoards = async (req, res, next) => {
  try {
    const workspace = await Workspace.findById(req.params.workspaceId);
    if (!workspace) return res.status(404).json({ message: "Workspace not found" });
    requireMember(workspace, req.user._id);

    const boards = await Board.find({ workspace: workspace._id }).sort({
      isFavorite: -1,
      createdAt: -1,
    });
    res.json({ boards });
  } catch (err) {
    next(err);
  }
};

// POST /api/workspaces/:workspaceId/boards
const createBoard = async (req, res, next) => {
  try {
    const workspace = await Workspace.findById(req.params.workspaceId);
    if (!workspace) return res.status(404).json({ message: "Workspace not found" });
    requireRole(workspace, req.user._id, "editor");

    const { name, color, columns } = req.body;
    if (!name) return res.status(400).json({ message: "Board name is required" });

    const board = await Board.create({
      workspace: workspace._id,
      name,
      color: color || "#4C6FFF",
      columns: columns && columns.length ? columns : undefined,
      createdBy: req.user._id,
    });

    res.status(201).json({ board });
  } catch (err) {
    next(err);
  }
};

const findBoardWithAccess = async (boardId, userId) => {
  const board = await Board.findById(boardId);
  if (!board) {
    const err = new Error("Board not found");
    err.statusCode = 404;
    throw err;
  }
  const workspace = await Workspace.findById(board.workspace);
  requireMember(workspace, userId);
  return { board, workspace };
};

// GET /api/boards/:id
const getBoard = async (req, res, next) => {
  try {
    const { board } = await findBoardWithAccess(req.params.id, req.user._id);
    res.json({ board });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/boards/:id
const updateBoard = async (req, res, next) => {
  try {
    const { board, workspace } = await findBoardWithAccess(req.params.id, req.user._id);
    requireRole(workspace, req.user._id, "editor");

    const { name, color, columns, isFavorite } = req.body;
    if (name !== undefined) board.name = name;
    if (color !== undefined) board.color = color;
    if (columns !== undefined) board.columns = columns;
    if (isFavorite !== undefined) board.isFavorite = isFavorite;
    await board.save();

    res.json({ board });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/boards/:id/archive
const toggleArchiveBoard = async (req, res, next) => {
  try {
    const { board, workspace } = await findBoardWithAccess(req.params.id, req.user._id);
    requireRole(workspace, req.user._id, "editor");

    board.isArchived = !board.isArchived;
    await board.save();
    res.json({ board });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/boards/:id
const deleteBoard = async (req, res, next) => {
  try {
    const { board, workspace } = await findBoardWithAccess(req.params.id, req.user._id);
    requireRole(workspace, req.user._id, "admin");

    await Task.deleteMany({ board: board._id });
    await board.deleteOne();

    res.json({ message: "Board deleted" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getBoards,
  createBoard,
  getBoard,
  updateBoard,
  toggleArchiveBoard,
  deleteBoard,
  findBoardWithAccess,
};
