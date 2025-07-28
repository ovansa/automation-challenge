// frontend/src/types/index.ts
export interface User {
  id: number;
  username: string;
  email: string;
  createdAt: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  author?: {
    username: string;
    email: string;
  };
}

export interface AuthResponse {
  message?: string;
  user: User;
  token?: string;
}

export interface ApiError {
  error: string;
  message: string;
}
