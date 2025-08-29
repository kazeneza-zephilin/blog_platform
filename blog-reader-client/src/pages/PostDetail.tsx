import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import type { Post, Comment } from "../types/Post";
import Layout from "../components/Layout";

const PostDetail = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // new states for comment form
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const token = localStorage.getItem("token"); // check authentication
  const isAuthenticated = !!token;

  useEffect(() => {
    const base_url = "http://localhost:5000/api";
    const fetchPost = async () => {
      setLoading(true);
      try {
        const postRes = await axios.get(`${base_url}/posts/${postId}`);
        setPost(postRes.data);

        const commentRes = await axios.get(
          `${base_url}/comments/posts/${postId}/comments`
        );
        setComments(commentRes.data);
      } catch {
        setError("Failed to load post or comments.");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId]);

  // handle new comment
  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      setSubmitting(true);
      const res = await axios.post(
        `http://localhost:5000/api/comments/posts/${postId}/comments`,
        { content: newComment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // append new comment to UI
      setComments((prev) => [...prev, res.data]);
      setNewComment("");
      navigate(0); // refresh to show the new comment
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      {loading && (
        <p className="text-center mt-10 text-orange-600">Loading...</p>
      )}
      {error && <p className="text-center mt-10 text-red-600">{error}</p>}
      {!loading && post && (
        <div className="max-w-4xl mx-auto p-4 mt-6 space-y-6">
          {/* Post content */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h1 className="text-2xl font-bold text-orange-600">{post.title}</h1>
            <p className="text-gray-700 mt-2">{post.content}</p>
            <p className="text-sm text-gray-500 mt-2">
              By <span className="font-semibold">{post.author.username}</span> on{" "}
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </div>

          {/* Comments */}
          <div className="bg-white p-4 rounded-lg shadow space-y-3">
            <h2 className="text-xl font-semibold text-orange-600">
              Comments ({comments.length})
            </h2>
            {comments.length === 0 && (
              <p className="text-gray-500">No comments yet.</p>
            )}
            {comments.map((comment) => (
              <div key={comment.id} className="border-b py-2 last:border-b-0">
                <p className="text-gray-700">{comment.content}</p>
                <p className="text-sm text-gray-500 mt-1">
                  By{" "}
                  <span className="font-semibold">
                    {comment.author.username}
                  </span>{" "}
                  on {new Date(comment.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}

            {/* Add Comment Form */}
            <div className="mt-4 pt-4 border-t">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <textarea
                    className="w-full border rounded-lg p-2"
                    rows={3}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write your comment..."
                  />
                  <button
                    onClick={handleAddComment}
                    disabled={submitting}
                    className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 disabled:opacity-50"
                  >
                    {submitting ? "Posting..." : "Add Comment"}
                  </button>
                </div>
              ) : (
                <p className="text-gray-500">
                  <button
                    onClick={() => navigate("/login")}
                    className="text-orange-600 font-semibold hover:underline"
                  >
                    Login
                  </button>{" "}
                  to comment.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default PostDetail;
