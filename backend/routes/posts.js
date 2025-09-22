const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Post = require('../models/Post');
const Vote = require('../models/Vote');
const { applyReputationOnVote } = require('../utils/reputation');

// Create post
router.post('/', auth, async (req, res) => {
  const { title, content, tags } = req.body;
  if (!title) return res.status(400).json({ message: 'Title required' });
  try {
    const post = new Post({ title, content: content || '', tags: tags || [], userId: req.user._id });
    await post.save();
    res.json(post);
  } catch (err) {
    console.error('Create post error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get feed (paginated)
router.get('/', async (req, res) => {
  const { page = 1, limit = 10, tag } = req.query;
  const filter = {};
  if (tag) filter.tags = tag;
  try {
    const posts = await Post.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate('userId', 'username avatar');

    res.json(posts);
  } catch (err) {
    console.error('Get feed error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single post
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('userId', 'username avatar');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) {
    console.error('Get post error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update post
router.put('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Not found' });
    if (!post.userId.equals(req.user._id)) return res.status(403).json({ message: 'Forbidden' });

    const { title, content, tags } = req.body;
    if (title !== undefined) post.title = title;
    if (content !== undefined) post.content = content;
    if (tags !== undefined) post.tags = tags;

    await post.save();
    res.json(post);
  } catch (err) {
    console.error('Update post error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete post
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Not found' });
    if (!post.userId.equals(req.user._id)) return res.status(403).json({ message: 'Forbidden' });

    await post.remove();
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('Delete post error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Vote on post
router.post('/:id/vote', auth, async (req, res) => {
  const { value } = req.body; // 1 or -1
  if (![1, -1].includes(value)) return res.status(400).json({ message: 'Invalid vote' });
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    // find existing vote (unique per user-target)
    let vote = await Vote.findOne({ userId: req.user._id, targetId: post._id, targetType: 'Post' });
    if (vote) {
      if (vote.value === value) {
        // undo - remove vote
        await vote.remove();
      } else {
        vote.value = value;
        await vote.save();
      }
    } else {
      vote = new Vote({ userId: req.user._id, targetId: post._id, targetType: 'Post', value });
      await vote.save();
    }

    // rebuild post.votes from Vote collection
    const votes = await Vote.find({ targetId: post._id, targetType: 'Post' });
    post.votes = votes.map(v => ({ userId: v.userId, value: v.value }));
    await post.save();

    // apply reputation rules
    await applyReputationOnVote({ targetType: 'Post', targetOwnerId: post.userId, voteValue: value, votingUserId: req.user._id });

    res.json({ message: 'Voted', votes: post.votes });
  } catch (err) {
    console.error('Post vote error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
