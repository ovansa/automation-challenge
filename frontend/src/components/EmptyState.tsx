import { FileText, Plus } from 'lucide-react';

import React from 'react';

interface EmptyStateProps {
  onCreatePost: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onCreatePost }) => {
  return (
    <div className='text-center py-12' data-testid='empty-state'>
      <FileText
        className='h-12 w-12 text-gray-400 mx-auto mb-4'
        data-testid='empty-icon'
      />
      <h3
        className='text-lg font-medium text-gray-900 mb-2'
        data-testid='empty-title'
      >
        No posts yet
      </h3>
      <p className='text-gray-600 mb-6' data-testid='empty-description'>
        Start sharing your thoughts with your first post.
      </p>
      <button
        onClick={onCreatePost}
        className='inline-flex items-center space-x-2 bg-gray-900 text-white px-6 py-3 hover:bg-gray-800 transition-all font-medium'
        data-testid='create-first-post-button'
      >
        <Plus className='h-4 w-4' />
        <span>Create your first post</span>
      </button>
    </div>
  );
};
