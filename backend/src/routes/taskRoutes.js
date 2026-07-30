const express = require("express");
const { updateTask, deleteTask, addComment } = require("../controllers/taskController");
const { protect } = require("../middleware/auth");

const router = express.Router();
router.use(protect);

router.patch("/:id", updateTask);
router.delete("/:id", deleteTask);
router.post("/:id/comments", addComment);

module.exports = router;
