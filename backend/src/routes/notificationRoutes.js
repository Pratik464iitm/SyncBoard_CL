const express = require("express");
const { getNotifications, markRead, markAllRead } = require("../controllers/notificationController");
const { protect } = require("../middleware/auth");

const router = express.Router();
router.use(protect);

router.get("/", getNotifications);
router.patch("/:id/read", markRead);
router.patch("/read-all", markAllRead);

module.exports = router;
