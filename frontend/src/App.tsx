import { AppError, handleApiError } from './utils/errorHandler';
import { Post, User } from './types';
import { authApi, postsApi } from './services/api';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { AuthForm } from './components/AuthForm';
import { EmptyState } from './components/EmptyState';
import { ErrorAlert } from './components/ErrorAlert';
import { Header } from './components/Header';
import { LoadingSpinner } from './components/LoadingSpinner';
import { PostCard } from './components/PostCard';
import { PostModal } from './components/PostModal';

export default function QuickPostApp() {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [showPostModal, setShowPostModal] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | undefined>();
  const [loading, setLoading] = useState(false);
  const [postsLoading, setPostsLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const [authError, setAuthError] = useState<AppError | null>(null);
  const [postsError, setPostsError] = useState<AppError | null>(null);
  const [modalError, setModalError] = useState<AppError | null>(null);

  const location = useLocation();
  const navigate = useNavigate();

  const isLogin = location.pathname === '/login';
  const isRegister = location.pathname === '/register';
  const isAuthPage = isLogin || isRegister;

  useEffect(() => {
    const checkExistingSession = () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (token && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          console.error('Invalid stored user data:', error);
        }
      }
      setInitialLoading(false);
    };

    checkExistingSession();
  }, []);

  useEffect(() => {
    if (user && location.pathname !== '/dashboard') {
      navigate('/dashboard');
    }
    if (!user && location.pathname === '/dashboard') {
      navigate('/login');
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadPosts();
    }
  }, [user]);

  const loadPosts = async () => {
    setPostsLoading(true);
    setPostsError(null);
    try {
      const { data } = await postsApi.getPosts();
      setPosts(data.posts);
    } catch (error) {
      if (error.message.includes('401') || error.message.includes('403')) {
        handleLogout();
        return;
      }
      const appError = handleApiError(error);
      setPostsError(appError);
      console.error('Failed to load posts:', error);
    }
    setPostsLoading(false);
  };

  const handleAuth = async (formData: {
    username: string;
    email: string;
    password: string;
  }) => {
    setLoading(true);
    setAuthError(null);
    try {
      let response;
      if (isLogin) {
        response = await authApi.login(formData.username, formData.password);
      } else {
        response = await authApi.register(
          formData.username,
          formData.email,
          formData.password
        );
      }

      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);
    } catch (error) {
      const appError = handleApiError(error);
      setAuthError(appError);
      console.error('Auth failed:', error);
    }
    setLoading(false);
  };

  const handleCreatePost = async (title: string, content: string) => {
    setLoading(true);
    setModalError(null);
    try {
      const { data } = await postsApi.createPost(title, content);
      setPosts([data.post, ...posts]);
      setShowPostModal(false);
    } catch (error) {
      const appError = handleApiError(error);
      setModalError(appError);
      console.error('Failed to create post:', error);
    }
    setLoading(false);
  };

  const handleUpdatePost = async (title: string, content: string) => {
    if (!editingPost) return;
    setLoading(true);
    setModalError(null);
    try {
      const { data } = await postsApi.updatePost(
        editingPost.id,
        title,
        content
      );
      setPosts(posts.map((p) => (p.id === editingPost.id ? data.post : p)));
      setShowPostModal(false);
      setEditingPost(undefined);
    } catch (error) {
      const appError = handleApiError(error);
      setModalError(appError);
      console.error('Failed to update post:', error);
    }
    setLoading(false);
  };

  const handleDeletePost = async (id: number) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      await postsApi.deletePost(id);
      setPosts(posts.filter((p) => p.id !== id));
    } catch (error) {
      const appError = handleApiError(error);
      setPostsError(appError);
      console.error('Failed to delete post:', error);
    }
  };

  const handleEditPost = (post: Post) => {
    setEditingPost(post);
    setModalError(null);
    setShowPostModal(true);
  };

  const handleNewPost = () => {
    setEditingPost(undefined);
    setModalError(null);
    setShowPostModal(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setPosts([]);
    setAuthError(null);
    setPostsError(null);
    setModalError(null);
  };

  const clearAuthError = () => setAuthError(null);
  const clearPostsError = () => setPostsError(null);
  const clearModalError = () => setModalError(null);

  if (initialLoading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <LoadingSpinner />
      </div>
    );
  }

  if (!user && isAuthPage) {
    return (
      <div className='min-h-screen bg-white'>
        <AuthForm
          mode={isLogin ? 'login' : 'register'}
          onSubmit={handleAuth}
          loading={loading}
          error={authError}
          onClearError={clearAuthError}
        />
        <div className='fixed bottom-8 left-1/2 transform -translate-x-1/2'>
          <button
            onClick={() => {
              navigate(isLogin ? '/register' : '/login');
              clearAuthError();
            }}
            className='text-gray-600 hover:text-gray-900 transition-colors'
          >
            {isLogin
              ? "Don't have an account? Sign up"
              : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className='min-h-screen bg-gray-50' data-testid='main-app-screen'>
      <Header user={user} onNewPost={handleNewPost} onLogout={handleLogout} />

      <main className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <ErrorAlert error={postsError} onClose={clearPostsError} />

        {postsLoading ? (
          <LoadingSpinner />
        ) : posts.length === 0 && !postsError ? (
          <EmptyState onCreatePost={handleNewPost} />
        ) : !postsError ? (
          <div
            className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'
            data-testid='posts-grid'
          >
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onEdit={handleEditPost}
                onDelete={handleDeletePost}
                currentUserId={user.id}
              />
            ))}
          </div>
        ) : null}
      </main>

      {showPostModal && (
        <PostModal
          post={editingPost}
          onSave={editingPost ? handleUpdatePost : handleCreatePost}
          onClose={() => {
            setShowPostModal(false);
            setEditingPost(undefined);
            clearModalError();
          }}
          loading={loading}
          error={modalError}
          onClearError={clearModalError}
        />
      )}
    </div>
  );
}
