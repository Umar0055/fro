const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const auth = require('../middleware/auth');

// Get comments for a post
router.get('/post/:postId', async (req, res, next) => {
  try {
    const comments = await Comment.find({ post: req.params.postId }).populate('user', 'username avatar');
    res.json(comments);
  } catch (err) {
    next(err);
  }
});

// Create a comment
router.post('/', auth, async (req, res, next) => {
  try {
    const { postId, content } = req.body;
    const comment = new Comment({
      post: postId,
      user: req.user._id,
      content,
    });
    await comment.save();
    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
});

// Vote on a comment
router.post('/:id/vote', auth, async (req, res, next) => {
  try {
    const { value } = req.body; // value can be 1 or -1
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    comment.votes += value;
    await comment.save();
    res.json(comment);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
