import { AlertCircle, X } from 'lucide-react';

import { AppError } from '../utils/errorHandler';
import React from 'react';

interface ErrorAlertProps {
  error: AppError | null;
  onClose: () => void;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ error, onClose }) => {
  if (!error) return null;

  const getErrorStyles = (type: string) => {
    switch (type) {
      case 'auth':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'validation':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'network':
        return 'bg-orange-50 border-orange-200 text-orange-800';
      default:
        return 'bg-red-50 border-red-200 text-red-800';
    }
  };

  return (
    <div
      className={`rounded-lg border p-4 mb-4 ${getErrorStyles(error.type)}`}
      data-testid='error-alert'
    >
      <div className='flex items-start'>
        <AlertCircle
          className='h-5 w-5 mr-3 mt-0.5 flex-shrink-0'
          data-testid='error-icon'
        />
        <div className='flex-1'>
          <p className='font-medium' data-testid='error-message'>
            {error.message}
          </p>
          {error.details && (
            <pre
              className='mt-2 text-sm opacity-75 whitespace-pre-wrap'
              data-testid='error-details'
            >
              {typeof error.details === 'string'
                ? error.details
                : JSON.stringify(error.details, null, 2)}
            </pre>
          )}
        </div>
        <button
          onClick={onClose}
          className='ml-3 flex-shrink-0 hover:opacity-75 transition-opacity'
          data-testid='error-close-button'
        >
          <X className='h-4 w-4' />
        </button>
      </div>
    </div>
  );
};
