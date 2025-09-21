import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../api';

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagsText, setTagsText] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const tags = tagsText.split(',').map((t) => t.trim()).filter(Boolean);
      const post = await createPost({ title, content, tags });
      navigate(`/post/${post._id}`);
    } catch (err) {
      alert(err?.response?.data?.message || 'Create failed');
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <form className="form" onSubmit={submit}>
        <h2>Create Post</h2>
        <div style={{ marginTop: 8 }}>
          <input
            className="input"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div style={{ marginTop: 8 }}>
          <textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <div style={{ marginTop: 8 }}>
          <input
            className="input"
            placeholder="Tags (comma separated)"
            value={tagsText}
            onChange={(e) => setTagsText(e.target.value)}
          />
        </div>
        <div style={{ marginTop: 12 }}>
          <button className="btn" type="submit">Publish</button>
        </div>
      </form>
    </div>
  );
}
