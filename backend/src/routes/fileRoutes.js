const express = require("express");
const { uploadFile } = require("../controllers/fileController");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");

const router = express.Router();
router.use(protect);

router.post("/upload", upload.single("file"), uploadFile);

module.exports = router;
