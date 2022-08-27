const express = require("express");
const {
  accessChat,
  fetchChat,
  createGroup,
  renameGroup,
  addToGroup,
  removeFromGroup,
} = require("../controllers/chatController");
const { protect } = require("../middleware/authmid");

const router = express.Router();

router.post("/", protect, accessChat);
router.get("/", protect, fetchChat);
router.post("/group", protect, createGroup);
router.put("/group/rename", protect, renameGroup);
router.put("/groupRem", protect, removeFromGroup);
router.put("/groupAdd", protect, addToGroup);

module.exports = router;
