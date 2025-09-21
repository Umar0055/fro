import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchPost, fetchComments, createComment, voteComment, votePost } from '../api';
import CommentItem from '../components/CommentItem';

export default function PostPage({ user }) {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');

  async function load() {
    const p = await fetchPost(id);
    const c = await fetchComments(id);
    setPost(p);
    setComments(c);
  }

  useEffect(() => { load(); }, [id]);

  const submitComment = async (e) => {
    e.preventDefault();
    try {
      await createComment({ postId: id, content: commentText });
      setCommentText('');
      await load();
    } catch (err) {
      alert(err?.response?.data?.message || 'Comment failed');
    }
  };

  const handleCommentVote = async (cid, value) => {
    try {
      await voteComment(cid, value);
      await load();
    } catch (err) {
      alert('Vote failed');
    }
  };

  const handlePostVote = async (postId, value) => {
    try {
      await votePost(postId, value);
      await load();
    } catch (err) {
      alert('Vote failed');
    }
  };

  if (!post) return <div className="card">Loading post…</div>;

  const score = post.votes ? post.votes.reduce((s, v) => s + (v.value || 0), 0) : 0;

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ width: 60, textAlign: 'center' }}>
            <div className="vote">
              <button onClick={() => handlePostVote(post._id, 1)}>▲</button>
              <div style={{ margin: '6px 0' }}>{score}</div>
              <button onClick={() => handlePostVote(post._id, -1)}>▼</button>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <h2>{post.title}</h2>
            <div className="muted small">
              by {post.userId?.username} • {new Date(post.createdAt).toLocaleString()}
            </div>
            <p style={{ marginTop: 12, whiteSpace: 'pre-wrap' }}>{post.content}</p>
            <div className="tags">
              {post.tags?.map((t, i) => (
                <span key={i} className="tag">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <section>
        <h3>Comments</h3>

        {user ? (
          <form className="form" onSubmit={submitComment}>
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
            />
            <div style={{ marginTop: 8 }}>
              <button className="btn" type="submit">Post comment</button>
            </div>
          </form>
        ) : (
          <div className="card">Log in to comment.</div>
        )}

        {comments.map((c) => (
          <CommentItem key={c._id} comment={c} onVote={handleCommentVote} />
        ))}
      </section>
    </div>
  );
}

