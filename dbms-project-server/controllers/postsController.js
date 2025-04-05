const { Post, Comment } = require('../db');

// Create a new post
const createPost = async (req, res) => {
  try {
    const { uid, imageUrl } = req.body;

    if (!uid || !imageUrl) {
      return res.status(400).json({ message: 'uid and imageUrl are required' });
    }

    const newPost = await Post.create({ uid, imageUrl });
    res.status(201).json(newPost);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Server error while creating post' });
  }
};

const addComment = async (req, res) => {
  try {
    const { pid, uid, comment } = req.body;

    if (!pid || !uid || !comment) {
      return res.status(400).json({ message: 'pid, uid and comment are required' });
    }

    // const post = await Post.findByPk(pid);
    // if (!post) {
    //   return res.status(404).json({ message: 'Post not found' });
    // }

    const newComment = await Comment.create({ pid, uid, comment });
    res.status(201).json(newComment);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Server error while adding comment' });
  }
};

module.exports = {
  createPost,
  addComment,
};
