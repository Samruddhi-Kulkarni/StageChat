
const express = require("express");
const {
    allMessage,
  sendMessage,
} = require("../controllers/messageControllers");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.route("/:chatId").get(protect, allMessage);
router.route("/").post(protect, sendMessage);

module.exports = router;