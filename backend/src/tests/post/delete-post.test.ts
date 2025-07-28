import { createPost, loginAndGetToken } from '../utils/test-helpers';

import app from '../../app';
import { db } from '../../database';
import request from 'supertest';

let token: string;
let otherUserToken: string;
let postIdToDelete: number;

beforeAll(async () => {
  db.reset();
  await db.initializeMockData();

  token = await loginAndGetToken('john_doe', 'password123');
  otherUserToken = await loginAndGetToken('jane_smith', 'password123');

  const newPost = await createPost(token);
  postIdToDelete = newPost.id;
});

describe('DELETE /posts/:id', () => {
  describe('Success case', () => {
    it('should delete a post with valid token and ownership', async () => {
      const res = await request(app)
        .delete(`/posts/${postIdToDelete}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', 'Post deleted successfully');
      expect(res.body.deletedPost).toMatchObject({
        id: postIdToDelete,
      });
    });
  });

  describe('Authorization errors', () => {
    it('should return 403 if trying to delete another user’s post', async () => {
      const anotherPost = db.getPosts().find((p) => p.authorId === 1);
      expect(anotherPost).toBeDefined();

      const res = await request(app)
        .delete(`/posts/${anotherPost!.id}`)
        .set('Authorization', `Bearer ${otherUserToken}`);

      expect(res.statusCode).toBe(403);
      expect(res.body).toEqual({
        error: 'Validation error',
        message: 'You can only delete your own posts.',
      });
    });

    it('should return 401 if token is missing', async () => {
      const res = await request(app).delete(`/posts/${postIdToDelete}`);

      expect(res.statusCode).toBe(401);
      expect(res.body).toEqual({
        error: 'Access denied',
        message:
          'No token provided. Include Authorization header with Bearer token.',
      });
    });

    it('should return 401 for invalid token', async () => {
      const res = await request(app)
        .delete(`/posts/${postIdToDelete}`)
        .set('Authorization', 'Bearer invalid.token');

      expect(res.statusCode).toBe(401);
      expect(res.body.error).toBeDefined();
      expect(res.body.message).toBeDefined();
    });
  });

  describe('Validation errors', () => {
    it('should return 404 if post does not exist', async () => {
      const res = await request(app)
        .delete('/posts/99999')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({
        error: 'Validation error',
        message: 'Post with ID 99999 does not exist.',
      });
    });

    it('should return 400 if post ID is invalid (not a number)', async () => {
      const res = await request(app)
        .delete('/posts/abc')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        error: 'Invalid post ID',
        message: 'Post ID must be a valid number.',
      });
    });
  });
});
