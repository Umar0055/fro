import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register, getCurrentUser } from '../api';

export default function Register({ setUser }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      const data = await register({ username, email, password });
      localStorage.setItem('token', data.token);
      const cur = await getCurrentUser();
      setUser(cur);
      navigate('/');
    } catch (e) {
      setErr(e?.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div style={{ maxWidth:560, margin:'0 auto' }}>
      <form onSubmit={submit} className="form">
        <h2>Register</h2>
        {err && <div style={{ color:'red' }}>{err}</div>}
        <div style={{ marginTop:8 }}>
          <input className="input" placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} />
        </div>
        <div style={{ marginTop:8 }}>
          <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        </div>
        <div style={{ marginTop:8 }}>
          <input className="input" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        </div>
        <div style={{ marginTop:12 }}>
          <button className="btn" type="submit">Register</button>
        </div>
      </form>
    </div>
  );
}
