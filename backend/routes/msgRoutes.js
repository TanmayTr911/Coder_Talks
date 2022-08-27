const express = require("express");
const { allMessages, sendMessage } = require("../controllers/msgController");
const { protect } = require("../middleware/authmid");

const router = express.Router();

router.get("/:chatId", protect, allMessages);
router.post("/", protect, sendMessage);

module.exports = router;
