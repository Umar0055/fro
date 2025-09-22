import React, { useState } from 'react';
import './SinglePost.css';

const SinglePost = () => {
  const [comment, setComment] = useState('');

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      console.log('Comment submitted:', comment);
      setComment('');
    }
  };

  return (
    <div className="single-post-container">
      <article>
        <div className="post-header">
          <h1 className="post-title">How to Build Modern React Applications</h1>
          <div className="post-meta">
            <div className="author-info">
              <div className="author-avatar">JD</div>
              <div>
                <div>John Doe</div>
                <div className="post-date">March 15, 2024</div>
              </div>
            </div>
          </div>

          <div className="post-tags">
            <span className="tag">React</span>
            <span className="tag">JavaScript</span>
            <span className="tag">Tutorial</span>
          </div>
        </div>

        <div className="post-content">
          <p>
            Building modern React applications requires understanding several key concepts and best practices.
            In this comprehensive guide, we'll explore the fundamental principles that will help you create
            scalable and maintainable React applications.
          </p>
          <p>
            From component architecture to state management, we'll cover everything you need to know to
            build production-ready React applications that follow industry standards and best practices.
          </p>
        </div>

        <div className="vote-section">
          <div className="vote-buttons">
            <button className="vote-btn upvote">▲</button>
            <span className="vote-count">127</span>
            <button className="vote-btn downvote">▼</button>
          </div>
          <button className="ai-summarize-btn">🤖 Summarize with AI</button>
        </div>
      </article>

      <div className="comments-section">
        <h2 className="comments-title">Comments</h2>

        <form className="comment-form" onSubmit={handleCommentSubmit}>
          <textarea
            className="comment-textarea"
            placeholder="Share your thoughts..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button type="submit" className="comment-submit-btn">
            Add Comment
          </button>
        </form>

        <div className="comments-list">
          <div className="comment">
            <div className="comment-header">
              <div className="comment-author">
                <div className="comment-avatar">AS</div>
                <span>Alice Smith</span>
              </div>
              <div className="comment-date">1 hour ago</div>
            </div>
            <div className="comment-content">
              Great article! The explanations are very clear and the examples are practical.
            </div>
          </div>

          <div className="comment">
            <div className="comment-header">
              <div className="comment-author">
                <div className="comment-avatar">MB</div>
                <span>Mike Brown</span>
              </div>
              <div className="comment-date">3 hours ago</div>
            </div>
            <div className="comment-content">
              This helped me understand React hooks much better. Thanks for sharing!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SinglePost;
