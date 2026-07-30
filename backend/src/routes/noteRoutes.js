const express = require("express");
const { updateNote, togglePinNote, deleteNote } = require("../controllers/noteController");
const { protect } = require("../middleware/auth");

const router = express.Router();
router.use(protect);

router.patch("/:id", updateNote);
router.patch("/:id/pin", togglePinNote);
router.delete("/:id", deleteNote);

module.exports = router;
