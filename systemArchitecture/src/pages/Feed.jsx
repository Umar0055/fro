import React, { useEffect, useState } from 'react';
import { fetchPosts, votePost } from '../api';
import PostItem from '../components/PostItem';

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const data = await fetchPosts({ page: 1, limit: 20 });
      setPosts(data);
    } catch (err) {
      console.error('Error loading feed:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const handleVote = async (postId, value) => {
    try {
      await votePost(postId, value);
      await load(); // refresh posts to update scores
    } catch (err) {
      alert(err?.response?.data?.message || 'Vote failed');
    }
  };

  return (
    <div>
      <h2>Feed</h2>
      {loading && <div className="card">Loading posts…</div>}
      {!loading && posts.length === 0 && <div className="card">No posts yet. Create one!</div>}
      {posts.map((p) => (
        <PostItem key={p._id} post={p} onVote={handleVote} />
      ))}
    </div>
  );
}
