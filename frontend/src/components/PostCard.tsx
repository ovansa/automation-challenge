import { Edit, Trash2 } from 'lucide-react';

import { Post } from '../types';
import React from 'react';

interface PostCardProps {
  post: Post;
  onEdit: (post: Post) => void;
  onDelete: (id: number) => void;
  currentUserId: number;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onEdit,
  onDelete,
  currentUserId,
}) => {
  const isOwner = post.authorId === currentUserId;

  return (
    <div
      className='bg-white border border-gray-200 p-6 hover:shadow-md transition-shadow'
      data-testid={`post-card-${post.id}`}
    >
      <div className='flex justify-between items-start mb-4'>
        <h3
          className='text-xl font-semibold text-gray-900 line-clamp-2'
          data-testid='post-title'
        >
          {post.title}
        </h3>
        {isOwner && (
          <div className='flex space-x-2 ml-4' data-testid='post-actions'>
            <button
              onClick={() => onEdit(post)}
              className='p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all'
              data-testid='edit-post-button'
            >
              <Edit className='h-4 w-4' />
            </button>
            <button
              onClick={() => onDelete(post.id)}
              className='p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all'
              data-testid='delete-post-button'
            >
              <Trash2 className='h-4 w-4' />
            </button>
          </div>
        )}
      </div>

      <p className='text-gray-600 mb-4 line-clamp-3' data-testid='post-content'>
        {post.content}
      </p>

      <div
        className='flex items-center justify-between text-sm text-gray-500'
        data-testid='post-meta'
      >
        <span data-testid='post-author'>
          By {post.author?.username || 'Unknown'}
        </span>
        <span data-testid='post-date'>
          {new Date(post.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};
