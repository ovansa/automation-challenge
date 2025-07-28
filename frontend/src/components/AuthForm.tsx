import { Lock, Mail, User } from 'lucide-react';
import React, { useState } from 'react';

import { AppError } from '../utils/errorHandler';
import { ErrorAlert } from './ErrorAlert';

interface AuthFormProps {
  mode: 'login' | 'register';
  onSubmit: (data: {
    username: string;
    email: string;
    password: string;
  }) => void;
  loading: boolean;
  error: AppError | null;
  onClearError: () => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({
  mode,
  onSubmit,
  loading,
  error,
  onClearError,
}) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleSubmit = () => {
    const isInvalid =
      loading ||
      !formData.username.trim() ||
      !formData.password.trim() ||
      (mode === 'register' && !formData.email.trim());

    if (isInvalid) return;

    onClearError();
    onSubmit(formData);
  };

  const handleInputChange = (field: string, value: string) => {
    if (error) {
      onClearError();
    }
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-white'>
      <div className='max-w-md w-full space-y-8 p-8' data-testid='auth-form'>
        <div className='text-center'>
          <h2
            className='text-3xl font-bold text-gray-900 mb-2'
            data-testid='auth-title'
          >
            {mode === 'login' ? 'Welcome back' : 'Create account'}
          </h2>
          <p className='text-gray-600' data-testid='auth-subtitle'>
            {mode === 'login'
              ? 'Sign in to your account'
              : 'Start sharing your thoughts'}
          </p>
        </div>

        <div className='space-y-6'>
          <ErrorAlert error={error} onClose={onClearError} />

          <div className='space-y-4'>
            <div>
              <div className='relative'>
                <User className='absolute left-3 top-3 h-5 w-5 text-gray-400' />
                <input
                  type='text'
                  placeholder='Username'
                  value={formData.username}
                  onChange={(e) =>
                    handleInputChange('username', e.target.value)
                  }
                  className='w-full pl-10 pr-4 py-3 border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all'
                  required
                  data-testid='username-input'
                />
              </div>
            </div>

            {mode === 'register' && (
              <div>
                <div className='relative'>
                  <Mail className='absolute left-3 top-3 h-5 w-5 text-gray-400' />
                  <input
                    type='email'
                    placeholder='Email'
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className='w-full pl-10 pr-4 py-3 border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all'
                    required
                    data-testid='email-input'
                  />
                </div>
              </div>
            )}

            <div>
              <div className='relative'>
                <Lock className='absolute left-3 top-3 h-5 w-5 text-gray-400' />
                <input
                  type='password'
                  placeholder='Password'
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange('password', e.target.value)
                  }
                  className='w-full pl-10 pr-4 py-3 border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all'
                  required
                  data-testid='password-input'
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={
              loading ||
              !formData.username ||
              !formData.password ||
              (mode === 'register' && !formData.email)
            }
            className='w-full bg-gray-900 text-white py-3 px-4 hover:bg-gray-800 focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium'
            data-testid='submit-button'
          >
            {loading
              ? 'Processing...'
              : mode === 'login'
              ? 'Sign in'
              : 'Create account'}
          </button>
        </div>
      </div>
    </div>
  );
};
