const { Op } = require("sequelize");
const { Post, Comment, Friend } = require("../db");

// Create a new post
const createPost = async (req, res) => {
  try {
    const { uid, imageUrl } = req.body;

    if (!uid || !imageUrl) {
      return res.status(400).json({ message: "uid and imageUrl are required" });
    }

    const newPost = await Post.create({ uid, imageUrl });
    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Server error while creating post" });
  }
};

const addComment = async (req, res) => {
  try {
    const { pid, uid, comment } = req.body;

    if (!pid || !uid || !comment) {
      return res
        .status(400)
        .json({ message: "pid, uid and comment are required" });
    }
    const newComment = await Comment.create({ pid, uid, comment });
    res.status(201).json(newComment);
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Server error while adding comment" });
  }
};

const getFriendsPosts = async (req, res) => {
  const uid = parseInt(req.query.uid, 10);

  if (isNaN(uid)) {
    return res.status(400).json({ message: "Valid numeric UID is required in query." });
  }

  if (!uid) {
    return res.status(400).json({ message: "User UID is required in query." });
  }

  try {
    // Get accepted friends
    const friends = await Friend.findAll({
      where: {
        status: "accepted",
        [Op.or]: [{ user1uid: uid }, { user2uid: uid }],
      },
    });

    // Extract only the friend's uid (not self)
    const friendUids = friends.map((f) =>
      f.user1uid === uid ? f.user2uid : f.user1uid
    );

    // Fetch posts by friends
    const friendPosts = await Post.findAll({
      where: {
        uid: {
          [Op.in]: friendUids,
        },
      },
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({ posts: friendPosts });
  } catch (error) {
    console.error("Error fetching friends' posts:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching friends' posts" });
  }
};

module.exports = {
  createPost,
  addComment,
  getFriendsPosts,
};
