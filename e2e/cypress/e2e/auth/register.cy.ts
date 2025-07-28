import { RegisterPage } from '../pages/RegisterPage';
import { faker } from '@faker-js/faker';

const registerPage = new RegisterPage();

describe('Register Page', () => {
  let newUser;

  beforeEach(() => {
    registerPage.visit();

    newUser = {
      username: faker.person.firstName(),
      email: faker.internet.email(),
      password: 'password123',
    };
  });

  it('should successfully register with valid credentials', () => {
    registerPage.register(newUser);
    registerPage.assertRegisterSuccess();
  });

  it('should show error on duplicate username or email', () => {
    // First registration
    registerPage.register(newUser);
    cy.findByTestId('logout-button').click();

    // Try to register again
    registerPage.visit();
    registerPage.register(newUser);
    registerPage.assertErrorMessage('Username or email is already taken.');
  });

  it('should disable submit button if fields are empty', () => {
    registerPage.assertSubmitDisabled();
  });

  it('should enable submit button with all valid inputs', () => {
    const tempUser = {
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: 'password123',
    };

    registerPage.fillForm(tempUser);
    registerPage.assertSubmitEnabled();
  });

  it('should show error for invalid email', () => {
    const tempUser = {
      username: faker.person.firstName(),
      email: 'invalid-email',
      password: 'password123',
    };

    registerPage.fillForm(tempUser);
    registerPage.submit();
    registerPage.assertErrorMessage('Please provide a valid email address.');
  });

  it('should show error for password too short', () => {
    const tempUser = {
      username: faker.person.firstName(),
      email: faker.internet.email(),
      password: '123',
    };

    registerPage.fillForm(tempUser);
    registerPage.submit();
    registerPage.assertErrorMessage(
      'Password must be at least 6 characters long.'
    );
  });

  it('should show error for username too short', () => {
    const tempUser = {
      username: 'ab',
      email: faker.internet.email(),
      password: 'password123',
    };

    registerPage.fillForm(tempUser);
    registerPage.submit();
    registerPage.assertErrorMessage(
      'Username must be at least 3 characters long and contain only letters, numbers, and underscores.'
    );
  });
});
