import app from '../../app';
import { db } from '../../database';
import { faker } from '@faker-js/faker';
import request from 'supertest';

export const resetAndSeedDb = async () => {
  db.reset();
  await db.initializeMockData();
};

export const generateUserData = (
  overrides?: Partial<{ username: string; email: string; password: string }>
) => ({
  username:
    overrides?.username ||
    `${faker.person.firstName()}${faker.person.lastName()}`,
  email: overrides?.email || faker.internet.email(),
  password: overrides?.password || 'password123',
});

export const generatePostData = (
  overrides?: Partial<{ title: string; content: string }>
) => ({
  title: overrides?.title || faker.lorem.words(5),
  content: overrides?.content || faker.lorem.paragraph(2),
});

export const registerAndLoginUser = async () => {
  const user = generateUserData();

  const registerRes = await request(app).post('/auth/register').send(user);
  if (registerRes.statusCode !== 201) {
    console.log('Register failed:', registerRes.body);
    throw new Error('User registration failed');
  }

  const loginRes = await request(app).post('/auth/login').send({
    username: user.username,
    password: user.password,
  });

  if (!loginRes.body.token) {
    console.error('Login failed:', loginRes.body);
    throw new Error('Login failed');
  }

  return { token: loginRes.body.token, user };
};

export async function loginAndGetToken(username: string, password: string) {
  const response = await request(app)
    .post('/auth/login')
    .send({ username, password });
  return response.body.token;
}

export const createPost = async (token: string) => {
  if (!token) throw new Error('No token provided to createPost');

  const post = generatePostData();
  const res = await request(app)
    .post('/posts')
    .set('Authorization', `Bearer ${token}`)
    .send(post);

  if (!res.body.post || res.statusCode !== 201) {
    throw new Error('Post creation failed');
  }

  return res.body.post;
};
