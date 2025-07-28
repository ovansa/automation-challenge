import { LogOut, Plus } from 'lucide-react';

import React from 'react';
import { User } from '../types';

interface HeaderProps {
  user: User;
  onNewPost: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onNewPost,
  onLogout,
}) => {
  return (
    <header
      className='bg-white border-b border-gray-200 sticky top-0 z-40'
      data-testid='header'
    >
      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center py-4'>
          <div
            className='flex items-center space-x-4'
            data-testid='user-greeting'
          >
            <h1
              className='text-2xl font-bold text-gray-900'
              data-testid='app-title'
            >
              QuickPost
            </h1>
            <span className='text-gray-500'>•</span>
            <span className='text-gray-600' data-testid='welcome-message'>
              Welcome, {user.username}
            </span>
          </div>

          <div className='flex items-center space-x-4'>
            <button
              onClick={onNewPost}
              className='flex items-center space-x-2 bg-gray-900 text-white px-4 py-2 hover:bg-gray-800 transition-all font-medium'
              data-testid='new-post-button'
            >
              <Plus className='h-4 w-4' />
              <span>New Post</span>
            </button>

            <button
              onClick={onLogout}
              className='flex items-center space-x-2 text-gray-600 hover:text-gray-900 px-4 py-2 hover:bg-gray-100 transition-all'
              data-testid='logout-button'
            >
              <LogOut className='h-4 w-4' />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
