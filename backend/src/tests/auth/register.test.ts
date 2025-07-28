import { generateUserData, resetAndSeedDb } from '../utils/test-helpers';

import app from '../../app';
import { db } from '../../database';
import request from 'supertest';

beforeEach(async () => {
  db.reset();
});

describe('POST /auth/register - User Registration', () => {
  it('should register a user with valid data', async () => {
    const user = generateUserData();

    const res = await request(app).post('/auth/register').send(user);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message', 'User registered successfully');
    expect(res.body.user).toMatchObject({
      username: user.username,
      email: user.email,
    });
    expect(res.body).not.toHaveProperty('password');
  });

  it('should return 400 if required fields are missing', async () => {
    const res = await request(app).post('/auth/register').send({});

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({
      error: 'Validation error',
      message: 'Username, email, and password are required.',
    });
  });

  it('should return 400 if email format is invalid', async () => {
    const user = generateUserData({ email: 'invalid-email' });

    const res = await request(app).post('/auth/register').send(user);

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({
      error: 'Validation error',
      message: 'Please provide a valid email address.',
    });
  });

  it('should return 400 if password is too short', async () => {
    const user = generateUserData({ password: 'short' });

    const res = await request(app).post('/auth/register').send(user);

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({
      error: 'Validation error',
      message: 'Password must be at least 6 characters long.',
    });
  });

  it('should return 409 if username already exists', async () => {
    const user = generateUserData();

    // First registration
    await request(app).post('/auth/register').send(user);

    // Second registration with same username
    const res = await request(app)
      .post('/auth/register')
      .send({
        ...user,
        email: generateUserData().email, // unique email
      });

    expect(res.statusCode).toBe(409);
    expect(res.body).toEqual({
      error: 'Validation error',
      message: 'Username or email is already taken.',
    });
  });

  it('should return 409 if email already exists', async () => {
    const user = generateUserData();

    // First registration
    await request(app).post('/auth/register').send(user);

    // Second registration with same email
    const res = await request(app)
      .post('/auth/register')
      .send({
        ...user,
        username: generateUserData().username, // unique username
      });

    expect(res.statusCode).toBe(409);
    expect(res.body).toEqual({
      error: 'Validation error',
      message: 'Username or email is already taken.',
    });
  });
});
