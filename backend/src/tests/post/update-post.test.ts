import {
  createPost,
  registerAndLoginUser,
  resetAndSeedDb,
} from '../utils/test-helpers';

import app from '../../app';
import request from 'supertest';

let token: string;
let otherUserToken: string;
let postId: number;

beforeEach(async () => {
  await resetAndSeedDb();

  // Register and login as author
  const { token: authorToken } = await registerAndLoginUser();
  token = authorToken;

  // Register and login as another user
  const { token: nonAuthorToken } = await registerAndLoginUser();
  otherUserToken = nonAuthorToken;
  console.log('otherUserToken Token:', otherUserToken);

  // Create a post as the author
  const post = await createPost(token);
  postId = post.id;
});

describe('PUT /posts/:id - Update Post', () => {
  it('should update the post successfully with valid data and token', async () => {
    const res = await request(app)
      .put(`/posts/${postId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Updated Title',
        content: 'Updated content that is definitely more than ten characters.',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Post updated successfully');
    expect(res.body.post).toMatchObject({
      id: postId,
      title: 'Updated Title',
    });
  });

  it('should return 400 if title and content are missing', async () => {
    const res = await request(app)
      .put(`/posts/${postId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: '',
        content: '',
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({
      error: 'Validation error',
      message: 'Title and content are required.',
    });
  });

  it('should return 400 if post ID is not a number', async () => {
    const res = await request(app)
      .put('/posts/abc')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Valid',
        content: 'Also valid content',
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({
      error: 'Invalid post ID',
      message: 'Post ID must be a valid number.',
    });
  });

  it('should return 404 if the post does not exist', async () => {
    const res = await request(app)
      .put('/posts/999999')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test',
        content: 'More than 10 chars',
      });

    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({
      error: 'Validation error',
      message: 'Post with ID 999999 does not exist.',
    });
  });

  it('should return 403 if user is not the author', async () => {
    const res = await request(app)
      .put(`/posts/${postId}`)
      .set('Authorization', `Bearer ${otherUserToken}`)
      .send({
        title: 'Hacked Title',
        content: 'Trying to change someone else’s post',
      });

    console.log(res.body); // Debugging line to see the response body

    expect(res.statusCode).toBe(403);
    expect(res.body).toEqual({
      error: 'Validation error',
      message: 'You can only edit your own posts.',
    });
  });

  it('should return 401 if token is missing', async () => {
    const res = await request(app).put(`/posts/${postId}`).send({
      title: 'Title',
      content: 'Some content',
    });

    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual({
      error: 'Access denied',
      message:
        'No token provided. Include Authorization header with Bearer token.',
    });
  });

  it('should return 401 for invalid token', async () => {
    const res = await request(app)
      .put(`/posts/${postId}`)
      .set('Authorization', 'Bearer invalid.token')
      .send({
        title: 'Invalid Token',
        content: 'Some content',
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe('Invalid token');
    expect(res.body.message).toBe('Token format is invalid.');
  });
});
