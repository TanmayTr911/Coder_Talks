const express = require("express");
const { regUser, logUser, allUser } = require("../controllers/userController");
const { protect } = require("../middleware/authmid");

const router = express.Router();

router.post("/", regUser);
router.post("/login", logUser);
router.get("/", protect, allUser);

module.exports = router;
