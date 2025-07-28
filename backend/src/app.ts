import express, { NextFunction, Request, Response } from 'express';

import { ApiError } from './types';
import { authRoutes } from './routes/authRoutes';
import { config } from './config';
import cors from 'cors';
import { db } from './database';
import { postRoutes } from './routes/postRoutes';
import { requestLogger } from './middleware/logging';
import { userRoutes } from './routes/userRoutes';

const app = express();

app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Routes
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    users: db.getUsers().length,
    posts: db.getPosts().length,
  });
});

app.get('/', (req: Request, res: Response) => {
  res.json({
    name: 'Simple Test API',
    version: '1.0.0',
    description: 'A simple REST API for testing and learning',
    endpoints: {
      auth: {
        'POST /auth/register': 'Register a new user',
        'POST /auth/login': 'Login user',
      },
      users: {
        'GET /users': 'Get all users (requires auth)',
        'GET /users/:id': 'Get user by ID (requires auth)',
      },
      posts: {
        'GET /posts': 'Get all posts',
        'GET /posts/:id': 'Get post by ID',
        'POST /posts': 'Create new post (requires auth)',
        'PUT /posts/:id': 'Update post (requires auth)',
        'DELETE /posts/:id': 'Delete post (requires auth)',
      },
      utility: {
        'GET /health': 'Health check',
        'POST /reset': 'Reset all data to initial state',
      },
    },
    testCredentials: {
      username: 'john_doe',
      password: 'password123',
    },
  });
});

// API Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/posts', postRoutes);

// Reset route
app.post('/reset', async (req: Request, res: Response) => {
  try {
    db.reset();
    await db.initializeMockData();

    res.json({
      message: 'Data reset successfully',
      users: db.getUsers().length,
      posts: db.getPosts().length,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to reset data.',
    });
  }
});

app.post('/clear', async (req: Request, res: Response) => {
  try {
    db.reset();

    res.json({
      message: 'Data cleared successfully',
      users: db.getUsers().length,
      posts: db.getPosts().length,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to reset data.',
    });
  }
});

// Global error handler
app.use((error: ApiError, req: Request, res: Response, next: NextFunction) => {
  console.error('Global error handler:', error);

  res.status(error.statusCode || 500).json({
    error: 'Internal server error',
    message:
      config.nodeEnv === 'development'
        ? error.message
        : 'Something went wrong.',
    ...(config.nodeEnv === 'development' && { stack: error.stack }),
  });
});

// Handle 404
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not found',
    message: `Route ${req.method} ${req.originalUrl} not found.`,
    availableRoutes: [
      'GET /',
      'GET /health',
      'POST /auth/register',
      'POST /auth/login',
      'GET /users',
      'GET /users/:id',
      'GET /posts',
      'GET /posts/:id',
      'POST /posts',
      'PUT /posts/:id',
      'DELETE /posts/:id',
      'POST /reset',
    ],
  });
});

export default app;
