const { Op } = require("sequelize");
const { Post, Comment, Friend, User } = require("../db");

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
    return res
      .status(400)
      .json({ message: "Valid numeric UID is required in query." });
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

    // Attach name using separate query
    const postsWithNames = await Promise.all(
      friendPosts.map(async (post) => {
        const user = await User.findOne({
          where: { uid: post.uid },
          attributes: ["name"],
        });

        return {
          ...post.toJSON(),
          name: user ? user.name : null,
        };
      })
    );

    return res.status(200).json({ posts: postsWithNames });
  } catch (error) {
    console.error("Error fetching friends' posts:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching friends' posts" });
  }
};

const getPostComments = async (req, res) => {
  const pid = parseInt(req.query.pid, 10);

  if (isNaN(pid)) {
    return res
      .status(400)
      .json({ message: "Valid numeric PID is required in query." });
  }

  try {
    // Get all comments for the post
    const comments = await Comment.findAll({
      where: { pid },
      order: [["createdAt", "ASC"]],
    });

    // For each comment, get the user name using a separate query
    const commentsWithUserNames = await Promise.all(
      comments.map(async (comment) => {
        const user = await User.findOne({
          where: { uid: comment.uid },
          attributes: ["name"],
        });

        return {
          ...comment.toJSON(),
          name: user ? user.name : null,
        };
      })
    );

    res.status(200).json({ comments: commentsWithUserNames });
  } catch (error) {
    console.error("Error fetching post comments:", error);
    res.status(500).json({ message: "Server error while fetching comments." });
  }
};

module.exports = {
  createPost,
  addComment,
  getFriendsPosts,
  getPostComments,
};
