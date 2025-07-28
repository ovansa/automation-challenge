import { generateUserData, registerAndLoginUser } from '../utils/test-helpers';

import app from '../../app';
import { db } from '../../database';
import request from 'supertest';

beforeEach(() => {
  db.reset();
});

describe('POST /auth/login - User Login', () => {
  it('should login successfully with valid credentials', async () => {
    const user = generateUserData();

    await request(app).post('/auth/register').send(user);

    const res = await request(app).post('/auth/login').send({
      username: user.username,
      password: user.password,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Login successful');
    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toMatchObject({
      username: user.username,
      email: user.email,
    });
  });

  it('should return 400 if username or password is missing', async () => {
    const res = await request(app).post('/auth/login').send({});

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({
      error: 'Authentication error',
      message: 'Username and password are required.',
    });
  });

  it('should return 401 if username does not exist', async () => {
    const res = await request(app).post('/auth/login').send({
      username: 'nonexistentuser',
      password: 'somepassword',
    });

    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual({
      error: 'Authentication error',
      message: 'Username or password is incorrect.',
    });
  });

  it('should return 401 if password is incorrect', async () => {
    const { user } = await registerAndLoginUser();

    const res = await request(app).post('/auth/login').send({
      username: user.username,
      password: 'wrongpassword',
    });

    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual({
      error: 'Authentication error',
      message: 'Username or password is incorrect.',
    });
  });
});
