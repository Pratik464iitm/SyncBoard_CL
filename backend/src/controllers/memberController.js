const Workspace = require("../models/Workspace");
const User = require("../models/User");
const Notification = require("../models/Notification");
const { requireMember, requireRole, getMember } = require("../utils/permissions");
const { notifyUser } = require("../sockets");

// POST /api/workspaces/:id/invite  { email, role }
const inviteMember = async (req, res, next) => {
  try {
    const workspace = await Workspace.findById(req.params.id);
    if (!workspace) return res.status(404).json({ message: "Workspace not found" });
    requireRole(workspace, req.user._id, "admin");

    const { email, role } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required to invite someone" });

    const invitee = await User.findOne({ email: email.toLowerCase() });
    if (!invitee) {
      return res.status(404).json({
        message: "No SyncBoard account found for that email. Ask them to register first.",
      });
    }

    if (getMember(workspace, invitee._id)) {
      return res.status(409).json({ message: "This person is already a member of the workspace" });
    }

    workspace.members.push({ user: invitee._id, role: role || "editor" });
    await workspace.save();

    const notification = await Notification.create({
      user: invitee._id,
      type: "workspace_invite",
      message: `${req.user.name} added you to workspace "${workspace.name}"`,
      relatedWorkspace: workspace._id,
    });

    const io = req.app.get("io");
    notifyUser(io, invitee._id, notification);

    const populated = await workspace.populate("members.user", "name email avatarUrl");
    res.status(201).json({ workspace: populated });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/workspaces/:id/members/:memberId  { role }
const updateMemberRole = async (req, res, next) => {
  try {
    const workspace = await Workspace.findById(req.params.id);
    if (!workspace) return res.status(404).json({ message: "Workspace not found" });
    requireRole(workspace, req.user._id, "admin");

    const member = workspace.members.id(req.params.memberId);
    if (!member) return res.status(404).json({ message: "Member not found" });
    if (member.role === "owner") {
      return res.status(400).json({ message: "Cannot change the owner's role" });
    }

    member.role = req.body.role;
    await workspace.save();
    res.json({ workspace });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/workspaces/:id/members/:memberId
const removeMember = async (req, res, next) => {
  try {
    const workspace = await Workspace.findById(req.params.id);
    if (!workspace) return res.status(404).json({ message: "Workspace not found" });
    requireRole(workspace, req.user._id, "admin");

    const member = workspace.members.id(req.params.memberId);
    if (!member) return res.status(404).json({ message: "Member not found" });
    if (member.role === "owner") {
      return res.status(400).json({ message: "Cannot remove the workspace owner" });
    }

    member.deleteOne();
    await workspace.save();
    res.json({ message: "Member removed", workspace });
  } catch (err) {
    next(err);
  }
};

// POST /api/workspaces/:id/leave
const leaveWorkspace = async (req, res, next) => {
  try {
    const workspace = await Workspace.findById(req.params.id);
    if (!workspace) return res.status(404).json({ message: "Workspace not found" });
    const member = requireMember(workspace, req.user._id);

    if (member.role === "owner") {
      return res.status(400).json({ message: "Transfer ownership before leaving this workspace" });
    }

    member.deleteOne();
    await workspace.save();
    res.json({ message: "You left the workspace" });
  } catch (err) {
    next(err);
  }
};

module.exports = { inviteMember, updateMemberRole, removeMember, leaveWorkspace };
