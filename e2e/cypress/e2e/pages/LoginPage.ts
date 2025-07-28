export class LoginPage {
  visit() {
    cy.visit('/login');
  }

  fillForm({ username, password }: { username?: string; password?: string }) {
    if (username !== undefined) {
      cy.findByTestId('username-input').clear().type(username);
    }
    if (password !== undefined) {
      cy.findByTestId('password-input').clear().type(password);
    }
  }

  submit() {
    cy.findByTestId('submit-button').click();
  }

  login({ username, password }: { username: string; password: string }) {
    this.fillForm({ username, password });
    this.submit();
  }

  assertLoginSuccess() {
    cy.findByTestId('logout-button').should('be.visible');
  }

  assertErrorMessage(message: string) {
    cy.findByTestId('error-alert').should('be.visible');
    cy.findByTestId('error-message').should('contain', message);
  }

  dismissError() {
    cy.findByTestId('error-close-button').click();
  }

  assertSubmitDisabled() {
    cy.findByTestId('submit-button').should('be.disabled');
  }

  assertSubmitEnabled() {
    cy.findByTestId('submit-button').should('not.be.disabled');
  }
}
