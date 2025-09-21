import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProfile, getCurrentUser, updateProfile } from '../api';

export default function Profile() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [me, setMe] = useState(null);
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');

  useEffect(() => {
    async function load() {
      const p = await getProfile(username);
      setProfile(p);
      const cur = await getCurrentUser();
      setMe(cur);
      if (cur && cur.username === username) {
        setBio(cur.bio || '');
        setAvatar(cur.avatar || '');
      }
    }
    load();
  }, [username]);

  const save = async () => {
    try {
      const updated = await updateProfile({ avatar, bio });
      setMe(updated);
      alert('Profile updated');
    } catch (err) {
      alert(err?.response?.data?.message || 'Update failed');
    }
  };

  if (!profile) return <div className="card">Loading profile…</div>;

  const { user, posts, comments } = profile;

  return (
    <div>
      <div className="card" style={{ display: 'flex', gap: 12 }}>
        <img
          src={user.avatar || `https://ui-avatars.com/api/?name=${user.username}`}
          alt="avatar"
          className="avatar"
          style={{ width: 80, height: 80 }}
        />
        <div>
          <h2>{user.username}</h2>
          <div className="small muted">Score: {user.score}</div>
          <p style={{ marginTop: 8 }}>{user.bio}</p>
        </div>
      </div>

      {me && me.username === user.username && (
        <div className="form">
          <h3>Edit profile</h3>
          <div style={{ marginTop: 8 }}>
            <input
              className="input"
              placeholder="Avatar URL"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
            />
          </div>
          <div style={{ marginTop: 8 }}>
            <textarea
              placeholder="Bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>
          <div style={{ marginTop: 8 }}>
            <button className="btn" onClick={save}>Save</button>
          </div>
        </div>
      )}

      <section>
        <h3>Posts</h3>
        {posts.map((p) => (
          <div className="card" key={p._id}>
            <a href={`/post/${p._id}`} style={{ textDecoration: 'none', color: '#111' }}>
              <div style={{ fontWeight: 700 }}>{p.title}</div>
              <div className="small muted">{new Date(p.createdAt).toLocaleString()}</div>
            </a>
          </div>
        ))}
      </section>

      <section>
        <h3>Recent comments</h3>
        {comments.map((c) => (
          <div key={c._id} className="card">
            <div className="small muted">
              on <a href={`/post/${c.postId}`} style={{ textDecoration: 'none' }}>post</a>
            </div>
            <div>{c.content}</div>
          </div>
        ))}
      </section>
    </div>
  );
}
