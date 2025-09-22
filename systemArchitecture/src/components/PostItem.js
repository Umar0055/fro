import React from 'react';
import { Link } from 'react-router-dom';

export default function PostItem({ post, onVote = () => {} }) {
  const score = post.votes ? post.votes.reduce((s, v) => s + (v.value || 0), 0) : 0;
  return (
    <article className="card">
      <div style={{ display:'flex', gap:12 }}>
        <div style={{ width:60, textAlign:'center' }}>
          <div className="vote">
            <button onClick={() => onVote(post._id, 1)}>▲</button>
            <div style={{ margin:'6px 0' }}>{score}</div>
            <button onClick={() => onVote(post._id, -1)}>▼</button>
          </div>
        </div>

        <div style={{ flex:1 }}>
          <h3 className="post-title"><Link to={`/post/${post._id}`} style={{ textDecoration:'none', color:'#111' }}>{post.title}</Link></h3>
          <div className="post-meta">
            <img src={post.userId?.avatar || `https://ui-avatars.com/api/?name=${post.userId?.username||'U'}`} alt="a" className="avatar" style={{ marginRight:8 }} />
            <span className="small">by <Link to={`/profile/${post.userId?.username}`} style={{ textDecoration:'none' }}>{post.userId?.username}</Link></span>
            <span className="small" style={{ marginLeft:12 }}>{new Date(post.createdAt).toLocaleString()}</span>
            <div className="tags">
              {post.tags?.slice(0,4).map((t, i) => <span key={i} className="tag">{t}</span>)}
            </div>
          </div>
          <p className="small" style={{ marginTop:8 }}>{post.content?.slice(0,250)}{post.content && post.content.length>250 ? '…' : ''}</p>
        </div>
      </div>
    </article>
  );
}
