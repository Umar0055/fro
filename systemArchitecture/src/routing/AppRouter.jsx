
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Feed from '../pages/Feed';
import SinglePost from '../pages/SinglePost';
import CreateEditPost from '../pages/CreateEditPost';
import UserProfile from '../pages/UserProfile';
import Leaderboard from '../pages/Leaderboard';
import Navbar from '../components/navbar/navbar';

const AppRouter = () => {
  return (
    <BrowserRouter>
    <Navbar />
 
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/post/:id" element={<SinglePost />} />
        <Route path="/create-post" element={<CreateEditPost />} />
        <Route path="/edit-post/:id" element={<CreateEditPost />} />
        <Route path="/profile/:id" element={<UserProfile />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/" element={<Feed />} />
      </Routes>
   
    </BrowserRouter>
  );
};

export default AppRouter;

