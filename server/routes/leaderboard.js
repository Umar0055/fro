import express from 'express';
import Post from '../models/Post.js';

const router = express.Router();

// GET /api/leaderboard
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('userId', 'username avatar')
      .sort({ 'votes': -1 })
      .limit(10);
    
    res.json(posts);
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ message: 'Error fetching leaderboard' });
  }
});

export default router;
