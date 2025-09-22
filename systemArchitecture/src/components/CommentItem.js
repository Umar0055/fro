import React from 'react';

export default function CommentItem({ comment, onVote = () => {} }) {
  const score = comment.votes ? comment.votes.reduce((s, v) => s + (v.value || 0), 0) : 0;
  return (
    <div className="card" style={{ display:'flex', gap:12 }}>
      <div style={{ width:60, textAlign:'center' }}>
        <div className="vote">
          <button onClick={() => onVote(comment._id, 1)}>▲</button>
          <div style={{ margin:'6px 0' }}>{score}</div>
          <button onClick={() => onVote(comment._id, -1)}>▼</button>
        </div>
      </div>
      <div style={{ flex:1 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <img src={comment.userId?.avatar || `https://ui-avatars.com/api/?name=${comment.userId?.username||'U'}`} alt="a" className="avatar" />
          <div>
            <div style={{ fontWeight:600 }}>{comment.userId?.username}</div>
            <div className="small muted">{new Date(comment.createdAt).toLocaleString()}</div>
          </div>
        </div>
        <p style={{ marginTop:8 }}>{comment.content}</p>
      </div>
    </div>
  );
}
