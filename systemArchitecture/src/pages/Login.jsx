import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, getCurrentUser } from '../api';

export default function Login({ setUser }) {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      const data = await login({ emailOrUsername, password });
      localStorage.setItem('token', data.token);
      const cur = await getCurrentUser();
      setUser(cur);
      navigate('/');
    } catch (e) {
      setErr(e?.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={{ maxWidth:560, margin:'0 auto' }}>
      <form onSubmit={submit} className="form">
        <h2>Login</h2>
        {err && <div style={{ color:'red' }}>{err}</div>}
        <div style={{ marginTop:8 }}>
          <input className="input" placeholder="Email or username" value={emailOrUsername} onChange={e=>setEmailOrUsername(e.target.value)} />
        </div>
        <div style={{ marginTop:8 }}>
          <input className="input" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        </div>
        <div style={{ marginTop:12 }}>
          <button className="btn" type="submit">Login</button>
        </div>
      </form>
    </div>
  );
}
