import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { postsAPI } from '../services/api';
import './CreatePost.css';

const CreatePost = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  React.useEffect(() => {
    if (isEditing) {
      // Load existing post data for editing
      const loadPost = async () => {
        try {
          const response = await postsAPI.getById(id);
          const post = response.data.post;
          setFormData({
            title: post.title,
            content: post.content,
            tags: post.tags ? post.tags.join(', ') : '',
          });
        } catch (err) {
          setError('Failed to load post for editing');
        }
      };
      loadPost();
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const postData = {
        title: formData.title,
        content: formData.content,
        tags: formData.tags
          .split(',')
          .map(tag => tag.trim())
          .filter(tag => tag.length > 0),
      };

      if (isEditing) {
        await postsAPI.update(id, postData);
      } else {
        await postsAPI.create(postData);
      }

      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post-container">
      <div className="create-post-card">
        <h2>{isEditing ? 'Edit Post' : 'Create New Post'}</h2>
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="create-post-form">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Enter your post title..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              disabled={loading}
              rows={8}
              placeholder="Share your thoughts..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="tags">Tags (comma-separated)</label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              disabled={loading}
              placeholder="ai, machine-learning, discussion"
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="cancel-button"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-button"
              disabled={loading}
            >
              {loading
                ? (isEditing ? 'Updating...' : 'Creating...')
                : (isEditing ? 'Update Post' : 'Create Post')
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
