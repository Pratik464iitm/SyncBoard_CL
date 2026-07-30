const express = require("express");
const {
  getBoard,
  updateBoard,
  toggleArchiveBoard,
  deleteBoard,
} = require("../controllers/boardController");
const { getTasks, createTask } = require("../controllers/taskController");
const { protect } = require("../middleware/auth");

const router = express.Router();
router.use(protect);

router.get("/:id", getBoard);
router.patch("/:id", updateBoard);
router.patch("/:id/archive", toggleArchiveBoard);
router.delete("/:id", deleteBoard);

router.get("/:boardId/tasks", getTasks);
router.post("/:boardId/tasks", createTask);

module.exports = router;
