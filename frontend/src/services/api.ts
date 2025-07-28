// services/api.ts
import { AuthResponse, Post, User } from '../types';

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If token is expired or invalid, remove it and redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // You could also trigger a logout here if needed
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: async (username: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', { username, password });
    const { user, token } = response.data;
    localStorage.setItem('token', token);
    return { user, token, message: 'Login successful' };
  },

  register: async (
    username: string,
    email: string,
    password: string
  ): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', {
      username,
      email,
      password,
    });
    const { user, token } = response.data;
    localStorage.setItem('token', token);
    return { user, token, message: 'Registration successful' };
  },

  validateToken: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    console.log('Validating token:', token);

    const response = await fetch('/api/auth/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Token validation response status:', response);

    if (!response.ok) {
      throw new Error('Token validation failed');
    }

    const data = await response.json();

    console.log('Token validation response data:', data);
    return data; // Should include { user }
  },
};

// Posts API
export const postsApi = {
  getPosts: (
    page = 1,
    limit = 10
  ): Promise<{ data: { posts: Post[]; pagination: any } }> =>
    api.get(`/posts?page=${page}&limit=${limit}`),

  getPost: (id: number): Promise<{ data: { post: Post } }> =>
    api.get(`/posts/${id}`),

  createPost: (
    title: string,
    content: string
  ): Promise<{ data: { post: Post } }> =>
    api.post('/posts', { title, content }),

  updatePost: (
    id: number,
    title: string,
    content: string
  ): Promise<{ data: { post: Post } }> =>
    api.put(`/posts/${id}`, { title, content }),

  deletePost: (id: number): Promise<{ data: any }> =>
    api.delete(`/posts/${id}`),
};

// Users API
export const usersApi = {
  getUsers: (): Promise<{ data: { users: User[] } }> => api.get('/users'),

  getUser: (id: number): Promise<{ data: { user: User } }> =>
    api.get(`/users/${id}`),
};
