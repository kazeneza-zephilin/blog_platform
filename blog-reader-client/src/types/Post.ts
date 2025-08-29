// src/types/Post.ts
export interface Post {
  id: number;
  title: string;
  content: string;
  author: {
    id: number;
    username: string;
  };
  createdAt: string;
}

export interface Comment {
  id: number;
  content: string;
  author: {
    id: number;
    username: string;
  };
  createdAt: string;
}

