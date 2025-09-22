import React, { useState, useEffect } from 'react';
import { leaderboardAPI } from '../services/api';
import './Leaderboard.css';

const Leaderboard = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await leaderboardAPI.get();
      setPosts(response.data);
    } catch (err) {
      setError('Failed to fetch leaderboard');
      console.error('Error fetching leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (index) => {
    switch (index) {
      case 0:
        return '🥇';
      case 1:
        return '🥈';
      case 2:
        return '🥉';
      default:
        return `#${index + 1}`;
    }
  };

  const getScoreColor = (score) => {
    if (score >= 100) return '#e74c3c';
    if (score >= 50) return '#f39c12';
    if (score >= 10) return '#3498db';
    return '#95a5a6';
  };

  if (loading) {
    return (
      <div className="leaderboard-container">
        <div className="loading">Loading leaderboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="leaderboard-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-header">
        <h1>🏆 Leaderboard</h1>
        <p>Top voted posts in the community</p>
      </div>

      {posts.length === 0 ? (
        <div className="no-posts">
          <h3>No posts yet</h3>
          <p>Be the first to create a post and start the leaderboard!</p>
        </div>
      ) : (
        <div className="leaderboard-list">
          {posts.map((post, index) => (
            <div key={post._id} className={`leaderboard-item ${index < 3 ? 'top-three' : ''}`}>
              <div className="rank">
                <span className="rank-icon">{getRankIcon(index)}</span>
              </div>

              <div className="post-info">
                <h3 className="post-title">{post.title}</h3>
                <div className="post-meta">
                  <span className="post-author">by {post.userId?.username || 'Unknown'}</span>
                  <span className="post-votes">
                    {post.totalVotes || 0} votes
                  </span>
                </div>
                <div className="post-preview">
                  {post.content.length > 150
                    ? `${post.content.substring(0, 150)}...`
                    : post.content
                  }
                </div>
              </div>

              <div className="score">
                <span
                  className="score-value"
                  style={{ color: getScoreColor(post.totalVotes || 0) }}
                >
                  {post.totalVotes || 0}
                </span>
                <span className="score-label">votes</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
