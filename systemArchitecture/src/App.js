import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './styles.css';
import Navbar from './components/navbar/Narbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Feed from './pages/Feed';
import PostPage from './pages/PostPage';
import CreatePost from './pages/CreatePost';
import Profile from './pages/Profile';
import Leaderboard from './pages/Leaderboard';
import { getCurrentUser } from './api';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetch() {
      const cur = await getCurrentUser();
      setUser(cur || null);
    }
    fetch();
  }, []);

  return (
    <BrowserRouter>
      <Navbar user={user} setUser={setUser} />
      <main className="container">
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register setUser={setUser} />} />
          <Route path="/post/:id" element={<PostPage user={user} />} />
          <Route path="/create" element={
            <PrivateRoute>
              <CreatePost user={user} />
            </PrivateRoute>
          } />
          <Route path="/profile/:username" element={<Profile />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}


