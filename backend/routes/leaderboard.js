const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get top users by score
router.get('/', async (req, res) => {
  const limit = Number(req.query.limit) || 10;
  try {
    const topUsers = await User.find()
      .select('username avatar score')
      .sort({ score: -1 })
      .limit(limit);
    res.json(topUsers);
  } catch (err) {
    console.error('Leaderboard error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
