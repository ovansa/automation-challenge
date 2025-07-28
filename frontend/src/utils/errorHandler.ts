// utils/errorHandler.ts
import { AxiosError } from 'axios';

export interface ApiErrorResponse {
  message: string;
  error?: string;
  details?: any;
}

export interface AppError {
  message: string;
  type: 'auth' | 'api' | 'network' | 'validation';
  details?: any;
}

export const handleApiError = (error: any): AppError => {
  if (error.isAxiosError && error.response) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    const status = axiosError.response?.status;
    const data = axiosError.response?.data;

    // Handle different HTTP status codes
    switch (status) {
      case 400:
        return {
          message: data?.message || 'Invalid request. Please check your input.',
          type: 'validation',
          details: data?.details,
        };
      case 401:
        return {
          message: data?.message || 'Invalid credentials. Please try again.',
          type: 'auth',
          details: data?.details,
        };
      case 403:
        return {
          message: data?.message || "Access denied. You don't have permission.",
          type: 'auth',
          details: data?.details,
        };
      case 404:
        return {
          message: data?.message || 'Resource not found.',
          type: 'api',
          details: data?.details,
        };
      case 409:
        return {
          message: data?.message || 'Conflict. Resource already exists.',
          type: 'validation',
          details: data?.details,
        };
      case 422:
        return {
          message:
            data?.message || 'Validation failed. Please check your input.',
          type: 'validation',
          details: data?.details,
        };
      case 500:
        return {
          message: data?.message || 'Server error. Please try again later.',
          type: 'api',
          details: data?.details,
        };
      default:
        return {
          message: data?.message || `Request failed with status ${status}`,
          type: 'api',
          details: data?.details,
        };
    }
  }

  // Handle network errors
  if (error.isAxiosError && !error.response) {
    return {
      message: 'Network error. Please check your connection and try again.',
      type: 'network',
    };
  }

  // Handle other errors
  return {
    message: error.message || 'An unexpected error occurred.',
    type: 'api',
  };
};
