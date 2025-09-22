import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { postsAPI, commentsAPI } from '../services/api';
import CommentCard from './CommentCard';
import './PostDetail.css';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [currentVote, setCurrentVote] = useState(0);
  const [voteCount, setVoteCount] = useState(0);

  const fetchPost = React.useCallback(async () => {
    try {
      setLoading(true);
      const response = await postsAPI.getById(id);
      setPost(response.data.post);
      setComments(response.data.comments || []);

      // Set voting state
      if (response.data.post.votes) {
        const userVote = response.data.post.votes.find(vote => vote.userId === user?.id);
        setCurrentVote(userVote ? userVote.value : 0);
        setVoteCount(response.data.post.totalVotes || 0);
      }
    } catch (err) {
      setError('Failed to fetch post');
      console.error('Error fetching post:', err);
    } finally {
      setLoading(false);
    }
  }, [id, user]);

  useEffect(() => {
    fetchPost();
  }, [id, fetchPost]);

  const handleVote = async (value) => {
    if (!isAuthenticated) {
      alert('Please login to vote');
      return;
    }

    try {
      const newVoteValue = currentVote === value ? 0 : value;
      await postsAPI.vote(id, newVoteValue);

      // Update local state
      setCurrentVote(newVoteValue);
      setVoteCount(prev => {
        if (currentVote === value) {
          return prev - value;
        } else if (currentVote === 0) {
          return prev + value;
        } else {
          return prev + value - currentVote;
        }
      });
    } catch (error) {
      console.error('Error voting:', error);
      alert('Failed to vote');
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Please login to comment');
      return;
    }

    if (!newComment.trim()) {
      return;
    }

    setSubmittingComment(true);
    try {
      await commentsAPI.create({
        postId: id,
        content: newComment.trim(),
      });

      setNewComment('');
      fetchPost(); // Refresh post and comments
    } catch (error) {
      console.error('Error creating comment:', error);
      alert('Failed to add comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      await postsAPI.delete(id);
      navigate('/');
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="post-detail-container">
        <div className="loading">Loading post...</div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="post-detail-container">
        <div className="error-message">{error || 'Post not found'}</div>
      </div>
    );
  }

  const canEdit = isAuthenticated && user && user.id === post.userId?._id;

  return (
    <div className="post-detail-container">
      <div className="post-detail-card">
        <div className="post-detail-header">
          <div className="post-detail-votes">
            <button
              className={`vote-button upvote ${currentVote === 1 ? 'active' : ''}`}
              onClick={() => handleVote(1)}
              disabled={!isAuthenticated}
            >
              ▲
            </button>
            <span className="vote-count">{voteCount}</span>
            <button
              className={`vote-button downvote ${currentVote === -1 ? 'active' : ''}`}
              onClick={() => handleVote(-1)}
              disabled={!isAuthenticated}
            >
              ▼
            </button>
          </div>

          <div className="post-detail-content">
            <h1 className="post-detail-title">{post.title}</h1>
            <div className="post-detail-meta">
              <span className="post-detail-author">by {post.userId?.username || 'Unknown'}</span>
              <span className="post-detail-date">{formatDate(post.createdAt)}</span>
              {post.updatedAt && post.updatedAt !== post.createdAt && (
                <span className="post-detail-updated"> (edited {formatDate(post.updatedAt)})</span>
              )}
            </div>

            <div className="post-detail-body">
              <p>{post.content}</p>
            </div>

            <div className="post-detail-tags">
              {post.tags && post.tags.map((tag, index) => (
                <span key={index} className="tag">#{tag}</span>
              ))}
            </div>

            <div className="post-detail-actions">
              {canEdit && (
                <>
                  <Link to={`/create-post`} state={{ post }} className="edit-button">
                    Edit Post
                  </Link>
                  <button onClick={handleDeletePost} className="delete-button">
                    Delete Post
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="comments-section">
        <h3>Comments ({comments.length})</h3>

        {isAuthenticated && (
          <form onSubmit={handleCommentSubmit} className="comment-form">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              required
              disabled={submittingComment}
              rows={4}
            />
            <button
              type="submit"
              disabled={submittingComment || !newComment.trim()}
              className="comment-submit-button"
            >
              {submittingComment ? 'Posting...' : 'Post Comment'}
            </button>
          </form>
        )}

        <div className="comments-list">
          {comments.length === 0 ? (
            <p className="no-comments">No comments yet. Be the first to comment!</p>
          ) : (
            comments.map((comment) => (
              <CommentCard key={comment._id} comment={comment} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
