import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { postsAPI } from '../services/api';
import PostCard from './PostCard';
import './Home.css';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('date');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await postsAPI.getAll({ sort: sortBy === 'votes' ? 'votes' : undefined });
        setPosts(response.data);
      } catch (err) {
        setError('Failed to fetch posts');
        console.error('Error fetching posts:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [sortBy]);

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
  };

  if (loading) {
    return (
      <div className="home-container">
        <div className="loading">Loading posts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="home-container">
      <div className="home-header">
        <h1>Community AI Forum</h1>
        <p>Share your thoughts, ask questions, and engage with the community</p>

        <div className="sort-controls">
          <button
            className={`sort-button ${sortBy === 'date' ? 'active' : ''}`}
            onClick={() => handleSortChange('date')}
          >
            Latest
          </button>
          <button
            className={`sort-button ${sortBy === 'votes' ? 'active' : ''}`}
            onClick={() => handleSortChange('votes')}
          >
            Top Voted
          </button>
        </div>
      </div>

      <div className="posts-container">
        {posts.length === 0 ? (
          <div className="no-posts">
            <h3>No posts yet</h3>
            <p>Be the first to share something with the community!</p>
            <Link to="/create-post" className="create-post-button">
              Create First Post
            </Link>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
