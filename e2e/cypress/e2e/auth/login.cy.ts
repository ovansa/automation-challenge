import { LoginPage } from '../pages/LoginPage';

const loginPage = new LoginPage();

describe('Login Page', () => {
  const validUser = {
    username: 'john_doe',
    password: 'password123',
  };

  beforeEach(() => {
    loginPage.visit();
  });

  it('should login successfully with valid credentials', () => {
    loginPage.login(validUser);
    loginPage.assertLoginSuccess();
  });

  it('should show error on incorrect password', () => {
    loginPage.login({ username: validUser.username, password: 'wrongpass' });
    loginPage.assertErrorMessage('Username or password is incorrect.');
  });

  it('should disable submit button if inputs are empty', () => {
    loginPage.assertSubmitDisabled();
  });

  it('should enable submit button with valid input', () => {
    loginPage.fillForm(validUser);
    loginPage.assertSubmitEnabled();
  });

  it('should allow dismissing the error alert', () => {
    loginPage.login({ username: validUser.username, password: 'wrongpass' });
    loginPage.assertErrorMessage('Username or password is incorrect.');
    loginPage.dismissError();
    cy.findByTestId('error-alert').should('not.exist');
  });
});
