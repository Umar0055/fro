import express from 'express';
const router = express.Router();
import auth from '../middleware/auth.js';
import Comment from '../models/Comment.js';
import User from '../models/User.js';
import POINTS from '../utils/calcScore.js';

// POST /api/comments/  (create comment)
router.post('/', auth, async (req, res) => {
  const { postId, content } = req.body;
  try {
    if (!postId || !content) return res.status(400).json({ msg: 'Missing fields' });
    const comment = new Comment({ postId, content, userId: req.user._id });
    await comment.save();
    res.json(comment);
  } catch (err) {
    console.error('Create comment error:', err.message);
    res.status(500).send('Server error');
  }
});

// POST /api/comments/:id/vote
router.post('/:id/vote', auth, async (req, res) => {
  const { value } = req.body;
  if (![1, -1].includes(value)) return res.status(400).json({ msg: 'Invalid vote value' });
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ msg: 'Comment not found' });

    const existing = comment.votes.find(v => String(v.userId) === String(req.user._id));
    if (existing) {
      if (existing.value === value) {
        comment.votes = comment.votes.filter(v => String(v.userId) !== String(req.user._id));
      } else {
        existing.value = value;
      }
    } else {
      comment.votes.push({ userId: req.user._id, value });
    }
    await comment.save();

    const author = await User.findById(comment.userId);
    if (author) {
      // Only add points for new votes, not when changing existing votes
      if (!existing) {
        if (value === 1) author.score += POINTS.COMMENT_UPVOTE;
        else author.score += POINTS.DOWNVOTE_RECEIVED;
        await author.save();
      }
    }

    res.json({ comment });
  } catch (err) {
    console.error('Comment vote error:', err.message);
    res.status(500).send('Server error');
  }
});

export default router;
