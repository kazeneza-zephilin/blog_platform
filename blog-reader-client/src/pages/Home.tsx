import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { type Post } from "../types/Post";
import Layout from "../components/Layout";

const Home = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const base_url = 'http://localhost:5000'
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${base_url}/api/posts`);
        setPosts(res.data);
      } catch {
        setError("Failed to load posts.");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <Layout>
      {loading && <p className="text-center mt-10 text-orange-600">Loading posts...</p>}
      {error && <p className="text-center mt-10 text-red-600">{error}</p>}

      <div className="max-w-4xl mx-auto p-4 space-y-4 mt-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className="p-4 border rounded-lg shadow hover:shadow-lg transition bg-white"
          >
            <Link to={`/posts/${post.id}`}>
              <h2 className="text-xl font-bold text-orange-600 hover:underline">{post.title}</h2>
            </Link>
            <p className="text-gray-700 mt-2 line-clamp-3">{post.content}</p>
            <p className="text-sm text-gray-500 mt-1">
              By <span className="font-semibold">{post.author.username}</span> on{" "}
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default Home;
