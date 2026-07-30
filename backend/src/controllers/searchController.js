const Workspace = require("../models/Workspace");
const Board = require("../models/Board");
const Note = require("../models/Note");
const Task = require("../models/Task");

// GET /api/search?q=&workspaceId=
const search = async (req, res, next) => {
  try {
    const { q, workspaceId } = req.query;
    if (!q || q.trim().length === 0) {
      return res.json({ boards: [], notes: [], tasks: [] });
    }

    const myWorkspaces = await Workspace.find({ "members.user": req.user._id }).select("_id");
    const myWorkspaceIds = myWorkspaces.map((w) => w._id);
    const scope = workspaceId ? [workspaceId] : myWorkspaceIds;

    const regex = new RegExp(q, "i");

    const [boards, notes, tasks] = await Promise.all([
      Board.find({ workspace: { $in: scope }, name: regex }).limit(10),
      Note.find({ workspace: { $in: scope }, $or: [{ title: regex }, { contentMarkdown: regex }] }).limit(10),
      Task.find({ workspace: { $in: scope }, $or: [{ title: regex }, { labels: regex }] }).limit(10),
    ]);

    res.json({ boards, notes, tasks });
  } catch (err) {
    next(err);
  }
};

module.exports = { search };
