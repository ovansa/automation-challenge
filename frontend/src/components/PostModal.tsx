import React, { useState } from 'react';

import { AppError } from '../utils/errorHandler';
import { ErrorAlert } from './ErrorAlert';
import { Post } from '../types';

interface PostModalProps {
  post?: Post;
  onSave: (title: string, content: string) => void;
  onClose: () => void;
  loading: boolean;
  error: AppError | null;
  onClearError: () => void;
}

export const PostModal: React.FC<PostModalProps> = ({
  post,
  onSave,
  onClose,
  loading,
  error,
  onClearError,
}) => {
  const [title, setTitle] = useState(post?.title || '');
  const [content, setContent] = useState(post?.content || '');

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) return;
    onClearError();
    onSave(title.trim(), content.trim());
  };

  const handleInputChange = (field: 'title' | 'content', value: string) => {
    if (error) onClearError();
    field === 'title' ? setTitle(value) : setContent(value);
  };

  return (
    <div
      className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'
      data-testid='post-modal-backdrop'
    >
      <div
        className='bg-white max-w-2xl w-full max-h-[80vh] overflow-hidden'
        data-testid='post-modal'
      >
        <div className='p-6 border-b border-gray-200'>
          <h2
            className='text-2xl font-bold text-gray-900'
            data-testid='post-modal-title'
          >
            {post ? 'Edit Post' : 'Create New Post'}
          </h2>
        </div>

        <div className='p-6 space-y-6 max-h-[60vh] overflow-y-auto'>
          <ErrorAlert error={error} onClose={onClearError} />

          <div>
            <label
              htmlFor='post-title'
              className='block text-sm font-medium text-gray-700 mb-2'
            >
              Title
            </label>
            <input
              id='post-title'
              type='text'
              value={title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className='w-full px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all'
              placeholder='Enter post title...'
              required
              data-testid='post-title-input'
            />
          </div>

          <div>
            <label
              htmlFor='post-content'
              className='block text-sm font-medium text-gray-700 mb-2'
            >
              Content
            </label>
            <textarea
              id='post-content'
              value={content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              rows={8}
              className='w-full px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all resize-none'
              placeholder='Write your post content...'
              required
              data-testid='post-content-textarea'
            />
          </div>

          <div
            className='flex justify-end space-x-4 pt-4'
            data-testid='post-modal-actions'
          >
            <button
              onClick={onClose}
              className='px-6 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors'
              data-testid='cancel-post-button'
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || !title.trim() || !content.trim()}
              className='px-6 py-2 bg-gray-900 text-white hover:bg-gray-800 focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium'
              data-testid='save-post-button'
            >
              {loading ? 'Saving...' : post ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
