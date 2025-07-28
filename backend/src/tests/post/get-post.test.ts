import app from '../../app';
import { db } from '../../database';
import { loginAndGetToken } from '../utils/test-helpers';
import request from 'supertest';

let token: string;

beforeAll(async () => {
  db.reset();
  await db.initializeMockData();
  token = await loginAndGetToken('john_doe', 'password123');
});

describe('GET /posts', () => {
  describe('Success cases', () => {
    it('should fetch all posts with a valid token', async () => {
      const res = await request(app)
        .get('/posts')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('posts');
      expect(Array.isArray(res.body.posts)).toBe(true);
      expect(res.body.posts.length).toBeGreaterThan(0);
      expect(res.body).toHaveProperty('pagination');
    });

    it('should support pagination with token', async () => {
      const res = await request(app)
        .get('/posts?limit=2&page=1')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.posts.length).toBeLessThanOrEqual(2);
      expect(res.body.pagination).toMatchObject({
        page: 1,
        limit: 2,
      });
    });

    it('should filter posts by authorId', async () => {
      const res = await request(app)
        .get('/posts?authorId=1')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.posts.length).toBeGreaterThan(0);
      res.body.posts.forEach((post: any) => {
        expect(post.authorId).toBe(1);
      });
    });

    it('should return empty array for authorId with no posts', async () => {
      const res = await request(app)
        .get('/posts?authorId=999')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.posts).toEqual([]);
    });
  });

  describe('Error cases', () => {
    it('should return 400 for invalid authorId', async () => {
      const res = await request(app)
        .get('/posts?authorId=abc')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        error: 'Invalid author ID',
        message: 'Author ID must be a valid number.',
      });
    });

    it('should return 401 when token is missing', async () => {
      const res = await request(app).get('/posts');

      expect(res.statusCode).toBe(401);
      expect(res.body).toEqual({
        error: 'Access denied',
        message:
          'No token provided. Include Authorization header with Bearer token.',
      });
    });

    it('should return 401 for invalid token', async () => {
      const res = await request(app)
        .get('/posts')
        .set('Authorization', 'Bearer invalid.token.here');

      expect(res.statusCode).toBe(401);
      expect(res.body.error).toBeDefined();
      expect(res.body.message).toBeDefined();
    });
  });
});
