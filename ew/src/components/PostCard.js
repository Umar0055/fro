import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { postsAPI } from '../services/api';
import './PostCard.css';

const PostCard = ({ post }) => {
  const { user, isAuthenticated } = useAuth();
  const [currentVote, setCurrentVote] = React.useState(0);
  const [voteCount, setVoteCount] = React.useState(post.totalVotes || 0);

  React.useEffect(() => {
    if (post.votes) {
      const userVote = post.votes.find(vote => vote.userId === user?.id);
      setCurrentVote(userVote ? userVote.value : 0);
      setVoteCount(post.totalVotes || 0);
    }
  }, [post.votes, post.totalVotes, user?.id]);

  const handleVote = async (value) => {
    if (!isAuthenticated) {
      alert('Please login to vote');
      return;
    }

    try {
      const newVoteValue = currentVote === value ? 0 : value;
      await postsAPI.vote(post._id, newVoteValue);

      // Update local state
      setCurrentVote(newVoteValue);
      setVoteCount(prev => {
        if (currentVote === value) {
          // Unvoting
          return prev - value;
        } else if (currentVote === 0) {
          // First vote
          return prev + value;
        } else {
          // Changing vote
          return prev + value - currentVote;
        }
      });
    } catch (error) {
      console.error('Error voting:', error);
      alert('Failed to vote');
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

  return (
    <div className="post-card">
      <div className="post-votes">
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

      <div className="post-content">
        <div className="post-header">
          <h3 className="post-title">
            <Link to={`/post/${post._id}`}>{post.title}</Link>
          </h3>
          <div className="post-meta">
            <span className="post-author">by {post.userId?.username || 'Unknown'}</span>
            <span className="post-date">{formatDate(post.createdAt)}</span>
          </div>
        </div>

        <div className="post-body">
          <p>{post.content.length > 200 ? `${post.content.substring(0, 200)}...` : post.content}</p>
        </div>

        <div className="post-footer">
          <div className="post-tags">
            {post.tags && post.tags.map((tag, index) => (
              <span key={index} className="tag">
                #{tag}
              </span>
            ))}
          </div>
          <div className="post-stats">
            <Link to={`/post/${post._id}`} className="comments-link">
              {post.comments?.length || 0} comments
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
