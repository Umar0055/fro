import React, { useEffect, useState } from 'react';
import { getLeaderboard } from '../api';

export default function Leaderboard() {
  const [list, setList] = useState([]);

  useEffect(() => {
    async function load() {
      const l = await getLeaderboard(10);
      setList(l);
    }
    load();
  }, []);

  return (
    <div>
      <h2>Leaderboard</h2>
      {list.length === 0 && <div className="card">No users yet.</div>}
      {list.map((u, i) => (
        <div className="card" key={u._id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, textAlign: 'center', fontSize: 18, fontWeight: 700 }}>{i + 1}</div>
          <img
            src={u.avatar || `https://ui-avatars.com/api/?name=${u.username}`}
            className="avatar"
            alt="avatar"
          />
          <div>
            <div style={{ fontWeight: 700 }}>{u.username}</div>
            <div className="small muted">Score: {u.score}</div>
          </div>
          <div className="right"></div>
        </div>
      ))}
    </div>
  );
}
