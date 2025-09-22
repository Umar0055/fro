import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
});

// attach token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export async function register({ username, email, password }) {
  const res = await API.post('/auth/register', { username, email, password });
  return res.data;
}

export async function login({ emailOrUsername, password }) {
  const res = await API.post('/auth/login', { emailOrUsername, password });
  return res.data;
}

export async function getCurrentUser() {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;
    const res = await API.get('/users/me');
    return res.data;
  } catch (_) {
    return null;
  }
}

// Posts
export async function fetchPosts({ page = 1, limit = 10, tag } = {}) {
  const res = await API.get('/posts', { params: { page, limit, tag } });
  return res.data;
}
export async function fetchPost(id) {
  const res = await API.get(`/posts/${id}`);
  return res.data;
}
export async function createPost({ title, content, tags }) {
  const res = await API.post('/posts', { title, content, tags });
  return res.data;
}
export async function updatePost(id, payload) {
  const res = await API.put(`/posts/${id}`, payload);
  return res.data;
}
export async function deletePost(id) {
  const res = await API.delete(`/posts/${id}`);
  return res.data;
}
export async function votePost(id, value) {
  const res = await API.post(`/posts/${id}/vote`, { value });
  return res.data;
}

// Comments
export async function fetchComments(postId) {
  const res = await API.get(`/comments/post/${postId}`);
  return res.data;
}
export async function createComment({ postId, content }) {
  const res = await API.post('/comments', { postId, content });
  return res.data;
}
export async function voteComment(id, value) {
  const res = await API.post(`/comments/${id}/vote`, { value });
  return res.data;
}

// Users & leaderboard
export async function getProfile(username) {
  const res = await API.get(`/users/${username}`);
  return res.data;
}
export async function updateProfile(payload) {
  const res = await API.put('/users/me', payload);
  return res.data;
}
export async function getLeaderboard(limit = 10) {
  const res = await API.get('/leaderboard', { params: { limit }});
  return res.data;
}
