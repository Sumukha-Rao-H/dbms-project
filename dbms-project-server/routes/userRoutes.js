const express = require("express");
const router = express.Router();

const { registerUser } = require("../controllers/userController");
const { sendMessage } = require("../controllers/messageController");
const { createPost, addComment } = require("../controllers/postsController");

// Route: POST /api/register
router.post("/register", registerUser);
router.post("/sendMessage", sendMessage);
router.post("/createPost", createPost);
router.post("/addComment", addComment);

module.exports = router;
