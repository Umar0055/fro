import express from 'express';
import auth from '../middleware/auth.js';
import Post from '../models/Post.js';
import User from '../models/User.js';
import Comment from '../models/Comment.js';
import POINTS from '../utils/calcScore.js';

const router = express.Router();

// POST /api/posts/ (create post)
router.post('/', auth, async (req, res) => {
  const { title, content, tags } = req.body;
  try {
    if (!title || !content) return res.status(400).json({ msg: 'Missing title or content' });
    const post = new Post({ title, content, tags: tags || [], userId: req.user._id });
    await post.save();
    res.json(post);
  } catch (err) {
    console.error('Create post error:', err.message);
    res.status(500).send('Server error');
  }
});

// GET /api/posts/ (get all posts)
router.get('/', async (req, res) => {
  try {
    const sortBy = req.query.sort;
    let query = Post.find()
      .populate('userId', 'username avatar')
      .populate('comments.user', 'username avatar');
    
    // Sort based on query parameter
    if (sortBy === 'votes') {
      // Sort by total votes
      const posts = await query.exec();
      posts.sort((a, b) => b.totalVotes - a.totalVotes);
      return res.json(posts);
    } else {
      // Default sort by creation date
      query = query.sort({ createdAt: -1 });
      const posts = await query.exec();
      return res.json(posts);
    }
  } catch (err) {
    console.error('Get posts error:', err);
    res.status(500).json({ message: 'Error fetching posts', error: err.message });
  }
});

// POST /api/posts/:id/vote (vote on post)
router.post('/:id/vote', auth, async (req, res) => {
  const { value } = req.body;
  if (![1, -1].includes(value)) return res.status(400).json({ msg: 'Invalid vote value' });
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });

    const existing = post.votes.find(v => String(v.userId) === String(req.user._id));
    if (existing) {
      if (existing.value === value) {
        // unvote
        post.votes = post.votes.filter(v => String(v.userId) !== String(req.user._id));
      } else {
        existing.value = value;
      }
    } else {
      post.votes.push({ userId: req.user._id, value });
    }
    await post.save();

    // update author score
    const author = await User.findById(post.userId);
    if (author) {
      // Only add points for new votes, not when changing existing votes
      if (!existing) {
        if (value === 1) author.score += POINTS.POST_UPVOTE;
        else author.score += POINTS.DOWNVOTE_RECEIVED;
        await author.save();
      }
    }

    res.json({ post });
  } catch (err) {
    console.error('Post vote error:', err.message);
    res.status(500).send('Server error');
  }
});

// GET /api/posts/:id (get single post with comments)
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('userId', 'username avatar score');
    if (!post) return res.status(404).json({ msg: 'Post not found' });
    const comments = await Comment.find({ postId: post._id }).populate('userId', 'username avatar score').sort({ createdAt: 1 });
    res.json({ post, comments });
  } catch (err) {
    console.error('Get post error:', err.message);
    res.status(500).send('Server error');
  }
});

// PUT /api/posts/:id (update post)
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, tags } = req.body;

    // Validate input
    if (!title || !content) {
      return res.status(400).json({ 
        success: false,
        message: 'Title and content are required' 
      });
    }

    // Find and update post
    const updatedPost = await Post.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { 
        $set: {
          title,
          content,
          tags: tags || [],
          updatedAt: Date.now()
        }
      },
      { new: true, runValidators: true }
    ).populate('userId', 'username');

    if (!updatedPost) {
      return res.status(404).json({
        success: false,
        message: 'Post not found or unauthorized'
      });
    }

    res.json({
      success: true,
      post: updatedPost
    });

  } catch (err) {
    console.error('Update post error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to update post',
      error: err.message
    });
  }
});

// DELETE /api/posts/:id  (delete post)
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });

    // Check if current user is the owner of the post
    if (String(post.userId) !== String(req.user._id)) {
      return res.status(403).json({ msg: 'Unauthorized to delete this post' });
    }

    await Post.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Post deleted' });
  } catch (err) {
    console.error('Delete post error:', err.message);
    res.status(500).send('Server error');
  }
});


export default router;
