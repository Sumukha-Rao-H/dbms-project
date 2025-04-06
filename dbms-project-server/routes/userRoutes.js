const express = require("express");
const router = express.Router();

const { registerUser } = require("../controllers/userController");
const { sendMessage, getChatMessages } = require("../controllers/messageController");
const { createPost, addComment, getFriendsPosts, getPostComments } = require("../controllers/postsController");
const { sendFriendRequest, updateFriend, getFriends } = require("../controllers/friendsController");

router.post("/register", registerUser);

router.post("/sendFriendRequest", sendFriendRequest);
router.post("/updateFriend", updateFriend);
router.get("/getFriends", getFriends);

router.post("/sendMessage", sendMessage);
router.get("/getChatMessages", getChatMessages);

router.post("/createPost", createPost);
router.post("/addComment", addComment);
router.get("/getFriendsPosts", getFriendsPosts);
router.get("/getPostComments", getPostComments);

module.exports = router;
