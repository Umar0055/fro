import React from 'react';
import { useAuth } from '../context/AuthContext';
import { commentsAPI } from '../services/api';
import './CommentCard.css';

const CommentCard = ({ comment }) => {
  const { user, isAuthenticated } = useAuth();
  const [currentVote, setCurrentVote] = React.useState(0);
  const [voteCount, setVoteCount] = React.useState(0);

  React.useEffect(() => {
    if (comment.votes) {
      const userVote = comment.votes.find(vote => vote.userId === user?.id);
      setCurrentVote(userVote ? userVote.value : 0);
      setVoteCount(comment.votes.reduce((sum, vote) => sum + vote.value, 0));
    }
  }, [comment.votes, user?.id]);

  const handleVote = async (value) => {
    if (!isAuthenticated) {
      alert('Please login to vote');
      return;
    }

    try {
      const newVoteValue = currentVote === value ? 0 : value;
      await commentsAPI.vote(comment._id, newVoteValue);

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
      console.error('Error voting on comment:', error);
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
    <div className="comment-card">
      <div className="comment-votes">
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

      <div className="comment-content">
        <div className="comment-header">
          <span className="comment-author">{comment.userId?.username || 'Unknown'}</span>
          <span className="comment-date">{formatDate(comment.createdAt)}</span>
        </div>

        <div className="comment-body">
          <p>{comment.content}</p>
        </div>
      </div>
    </div>
  );
};

export default CommentCard;
