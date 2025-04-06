const express = require("express");
const router = express.Router();

const { registerUser } = require("../controllers/userController");
const { sendMessage } = require("../controllers/messageController");
const { createPost, addComment } = require("../controllers/postsController");
const { sendFriendRequest } = require("../controllers/friendsController");

// Route: POST /api/register
router.post("/register", registerUser);
router.post("/sendMessage", sendMessage);
router.post("/createPost", createPost);
router.post("/addComment", addComment);
router.post("/sendFriendRequest", sendFriendRequest);

module.exports = router;
