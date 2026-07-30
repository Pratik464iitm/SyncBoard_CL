const express = require("express");
const {
  getWorkspaces,
  createWorkspace,
  getWorkspace,
  updateWorkspace,
  deleteWorkspace,
  getWorkspaceStats,
} = require("../controllers/workspaceController");
const { inviteMember, updateMemberRole, removeMember, leaveWorkspace } = require("../controllers/memberController");
const { getBoards, createBoard } = require("../controllers/boardController");
const { getNotes, createNote } = require("../controllers/noteController");
const { protect } = require("../middleware/auth");

const router = express.Router();
router.use(protect);

router.get("/", getWorkspaces);
router.post("/", createWorkspace);
router.get("/:id", getWorkspace);
router.patch("/:id", updateWorkspace);
router.delete("/:id", deleteWorkspace);
router.get("/:id/stats", getWorkspaceStats);

router.post("/:id/invite", inviteMember);
router.patch("/:id/members/:memberId", updateMemberRole);
router.delete("/:id/members/:memberId", removeMember);
router.post("/:id/leave", leaveWorkspace);

router.get("/:workspaceId/boards", getBoards);
router.post("/:workspaceId/boards", createBoard);

router.get("/:workspaceId/notes", getNotes);
router.post("/:workspaceId/notes", createNote);

module.exports = router;
