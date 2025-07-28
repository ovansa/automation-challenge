import {
  generatePostData,
  loginAndGetToken,
  registerAndLoginUser,
  resetAndSeedDb,
} from '../utils/test-helpers';

import app from '../../app';
import { db } from '../../database';
import request from 'supertest';

let token: string;

beforeAll(async () => {
  db.reset();
  await db.initializeMockData();
  token = await loginAndGetToken('john_doe', 'password123');
});

describe('POST /posts - Create Post', () => {
  it('should create a post successfully when valid token and data is provided', async () => {
    const postData = generatePostData();

    const res = await request(app)
      .post('/posts')
      .set('Authorization', `Bearer ${token}`)
      .send(postData);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message', 'Post created successfully');
    expect(res.body.post).toHaveProperty('id');
    expect(res.body.post).toHaveProperty('author');
    expect(res.body.post.title).toBe(postData.title);
  });

  it('should return validation error when title and content are missing', async () => {
    const res = await request(app)
      .post('/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: '', content: '' });

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({
      error: 'Validation error',
      message: 'Title and content are required.',
    });
  });

  it('should return 401 when no token is provided', async () => {
    const postData = generatePostData();

    const res = await request(app).post('/posts').send(postData);

    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual({
      error: 'Access denied',
      message:
        'No token provided. Include Authorization header with Bearer token.',
    });
  });

  it('should return 401 when token is invalid', async () => {
    const postData = generatePostData();

    const res = await request(app)
      .post('/posts')
      .set('Authorization', 'Bearer invalid.token.here')
      .send(postData);

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe('Invalid token');
    expect(res.body.message).toBe('Token format is invalid.');
  });
});
