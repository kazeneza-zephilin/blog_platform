import axios from "axios";
import type { Post, Comment } from "../types";

const API_URL = "http://localhost:5000/api"; // update your backend URL

// POSTS
export const getAllPosts = async (): Promise<Post[]> => {
  const res = await axios.get(`${API_URL}/posts`);
  return res.data;
};

export const getPostById = async (postId: number): Promise<Post> => {
  const res = await axios.get(`${API_URL}/posts/${postId}`);
  return res.data;
};

// COMMENTS
export const getCommentsForPost = async (
  postId: number
): Promise<Comment[]> => {
  const res = await axios.get(`${API_URL}/posts/${postId}/comments`);
  return res.data;
};

export const createComment = async (
  postId: number,
  content: string,
  token: string
): Promise<Comment> => {
  const res = await axios.post(
    `${API_URL}/posts/${postId}/comments`,
    { content },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};
