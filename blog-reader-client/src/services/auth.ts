import axios from "axios";

const API_URL = "http://localhost:5000/api/auth"; // replace with your backend URL

export interface User {
  id: number;
  username: string;
  role: string;
}

interface AuthResponse {
  token: string;
  user: User;
  message: string;
}

export const registerUser = async (data: {
  username: string;
  email: string;
  password: string;
}) => {
  const response = await axios.post<AuthResponse>(`${API_URL}/register`, data);
  return response.data;
};

export const loginUser = async (data: { email: string; password: string }) => {
  const response = await axios.post<AuthResponse>(`${API_URL}/login`, data);
  return response.data;
};
