const Task = require("../models/Task");
const Notification = require("../models/Notification");
const { findBoardWithAccess } = require("./boardController");
const { requireMember } = require("../utils/permissions");
const { notifyUser } = require("../sockets");

// GET /api/boards/:boardId/tasks
const getTasks = async (req, res, next) => {
  try {
    const { board } = await findBoardWithAccess(req.params.boardId, req.user._id);
    const tasks = await Task.find({ board: board._id })
      .populate("assignees", "name email avatarUrl")
      .populate("createdBy", "name email avatarUrl")
      .sort({ createdAt: 1 });
    res.json({ tasks });
  } catch (err) {
    next(err);
  }
};

// POST /api/boards/:boardId/tasks
const createTask = async (req, res, next) => {
  try {
    const { board, workspace } = await findBoardWithAccess(req.params.boardId, req.user._id);
    const { title, description, priority, labels, assignees, dueDate, status } = req.body;

    if (!title) return res.status(400).json({ message: "Task title is required" });

    const task = await Task.create({
      board: board._id,
      workspace: workspace._id,
      title,
      description: description || "",
      status: status || board.columns[0],
      priority: priority || "Medium",
      labels: labels || [],
      assignees: assignees || [],
      dueDate: dueDate || null,
      createdBy: req.user._id,
      activityLog: [{ message: `${req.user.name} created this task` }],
    });

    const io = req.app.get("io");

    if (assignees && assignees.length) {
      const notifs = await Notification.insertMany(
        assignees
          .filter((a) => a.toString() !== req.user._id.toString())
          .map((userId) => ({
            user: userId,
            type: "task_assigned",
            message: `${req.user.name} assigned you to "${task.title}"`,
            relatedWorkspace: workspace._id,
            relatedBoard: board._id,
            relatedTask: task._id,
          }))
      );
      notifs.forEach((n) => notifyUser(io, n.user, n));
    }

    const populated = await task.populate("assignees", "name email avatarUrl");
    io.to(`board:${board._id}`).emit("task:created", populated);

    res.status(201).json({ task: populated });
  } catch (err) {
    next(err);
  }
};

const findTaskWithAccess = async (taskId, userId) => {
  const task = await Task.findById(taskId);
  if (!task) {
    const err = new Error("Task not found");
    err.statusCode = 404;
    throw err;
  }
  const { requireMember: rm } = require("../utils/permissions");
  const Workspace = require("../models/Workspace");
  const workspace = await Workspace.findById(task.workspace);
  rm(workspace, userId);
  return { task, workspace };
};

// PATCH /api/tasks/:id
const updateTask = async (req, res, next) => {
  try {
    const { task, workspace } = await findTaskWithAccess(req.params.id, req.user._id);
    const { title, description, status, priority, labels, assignees, dueDate } = req.body;

    const prevStatus = task.status;

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (priority !== undefined) task.priority = priority;
    if (labels !== undefined) task.labels = labels;
    if (dueDate !== undefined) task.dueDate = dueDate;

    if (status !== undefined && status !== prevStatus) {
      task.status = status;
      task.activityLog.push({
        message: `${req.user.name} moved this from "${prevStatus}" to "${status}"`,
      });
      if (status.toLowerCase() === "done") {
        await Notification.create({
          user: task.createdBy,
          type: "task_completed",
          message: `"${task.title}" was marked complete`,
          relatedWorkspace: task.workspace,
          relatedBoard: task.board,
          relatedTask: task._id,
        });
      }
    }

    if (assignees !== undefined) {
      const newlyAssigned = assignees.filter((a) => !task.assignees.map((x) => x.toString()).includes(a));
      task.assignees = assignees;
      if (newlyAssigned.length) {
        await Notification.insertMany(
          newlyAssigned
            .filter((a) => a.toString() !== req.user._id.toString())
            .map((userId) => ({
              user: userId,
              type: "task_assigned",
              message: `${req.user.name} assigned you to "${task.title}"`,
              relatedWorkspace: task.workspace,
              relatedBoard: task.board,
              relatedTask: task._id,
            }))
        );
      }
    }

    await task.save();
    const populated = await task.populate("assignees", "name email avatarUrl");

    const io = req.app.get("io");
    io.to(`board:${task.board}`).emit("task:updated", populated);

    res.json({ task: populated });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/tasks/:id
const deleteTask = async (req, res, next) => {
  try {
    const { task } = await findTaskWithAccess(req.params.id, req.user._id);
    await task.deleteOne();

    const io = req.app.get("io");
    io.to(`board:${task.board}`).emit("task:deleted", { id: task._id });

    res.json({ message: "Task deleted", id: task._id });
  } catch (err) {
    next(err);
  }
};

// POST /api/tasks/:id/comments
const addComment = async (req, res, next) => {
  try {
    const { task } = await findTaskWithAccess(req.params.id, req.user._id);
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: "Comment text is required" });

    task.comments.push({ author: req.user._id, text });
    await task.save();
    const populated = await task.populate("comments.author", "name email avatarUrl");

    // Simple @mention detection -> notify mentioned users by name match against assignees
    const mentioned = task.assignees.filter((a) => text.includes("@"));
    if (mentioned.length) {
      await Notification.insertMany(
        mentioned
          .filter((a) => a.toString() !== req.user._id.toString())
          .map((userId) => ({
            user: userId,
            type: "mention",
            message: `${req.user.name} mentioned you on "${task.title}"`,
            relatedWorkspace: task.workspace,
            relatedBoard: task.board,
            relatedTask: task._id,
          }))
      );
    }

    const io = req.app.get("io");
    io.to(`board:${task.board}`).emit("task:commented", populated);

    res.status(201).json({ task: populated });
  } catch (err) {
    next(err);
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask, addComment, findTaskWithAccess };
