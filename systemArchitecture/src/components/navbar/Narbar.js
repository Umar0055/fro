import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar({ user, setUser }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return (
    <header className="header" style={{ marginBottom: 18 }}>
      <div className="nav">
        <Link to="/" style={{ fontWeight: 700, color: '#222', textDecoration: 'none' }}>Community AI Forum</Link>
        <Link to="/leaderboard" className="small" style={{ textDecoration: 'none' }}>Leaderboard</Link>
      </div>

      <div className="nav">
        <Link to="/create" className="btn">Create Post</Link>
        {user ? (
          <>
            <Link to={`/profile/${user.username}`} className="small" style={{ textDecoration: 'none', marginLeft: 12 }}>{user.username}</Link>
            <button onClick={logout} className="btn" style={{ background: '#e74c3c' }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="small" style={{ marginRight:8 }}>Login</Link>
            <Link to="/register" className="btn">Register</Link>
          </>
        )}
      </div>
    </header>
  );
}
