// cypress/pages/RegisterPage.ts

export class RegisterPage {
  visit() {
    cy.visit('/register');
  }

  fillForm({
    username,
    email,
    password,
  }: {
    username?: string;
    email?: string;
    password?: string;
  }) {
    if (username !== undefined) {
      cy.findByTestId('username-input').clear().type(username);
    }
    if (email !== undefined) {
      cy.findByTestId('email-input').clear().type(email);
    }
    if (password !== undefined) {
      cy.findByTestId('password-input').clear().type(password);
    }
  }

  submit() {
    cy.findByTestId('submit-button').click();
  }

  register({
    username,
    email,
    password,
  }: {
    username: string;
    email: string;
    password: string;
  }) {
    this.fillForm({ username, email, password });
    this.submit();
  }

  assertRegisterSuccess() {
    cy.findByTestId('logout-button').should('be.visible');
  }

  assertErrorMessage(message: string) {
    cy.findByTestId('error-alert').should('be.visible');
    cy.findByTestId('error-message').should('contain', message);
  }

  assertSubmitDisabled() {
    cy.findByTestId('submit-button').should('be.disabled');
  }

  assertSubmitEnabled() {
    cy.findByTestId('submit-button').should('not.be.disabled');
  }

  dismissError() {
    cy.findByTestId('error-close-button').click();
  }
}
