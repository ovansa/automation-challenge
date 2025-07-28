import { faker } from '@faker-js/faker';

export const generateUserData = (type: 'valid' | 'invalid') => {
  if (type === 'invalid') {
    return {
      username: '',
      email: 'invalid-email',
      password: '123', // too short or weak
    };
  }

  return {
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password({ length: 12 }),
  };
};

export const generatePostData = (type: 'valid' | 'missing' | 'short') => {
  if (type === 'missing') {
    return {
      title: '',
      content: '',
    };
  }

  if (type === 'short') {
    return {
      title: 'Hi',
      content: 'Too short',
    };
  }

  return {
    title: faker.lorem.words(5),
    content: faker.lorem.paragraphs(2),
  };
};
