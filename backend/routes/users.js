const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');

// Get my profile
router.get('/me', auth, async (req, res) => {
  res.json(req.user);
});

// Update profile (avatar & bio)
router.put('/me', auth, async (req, res) => {
  const { avatar, bio } = req.body;
  try {
    const updated = await User.findByIdAndUpdate(req.user._id, { avatar, bio }, { new: true }).select('-passwordHash');
    res.json(updated);
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get profile by username (with posts and comments)
router.get('/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select('-passwordHash');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const posts = await Post.find({ userId: user._id }).sort({ createdAt: -1 }).limit(50);
    const comments = await Comment.find({ userId: user._id }).sort({ createdAt: -1 }).limit(50);

    res.json({ user, posts, comments });
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

