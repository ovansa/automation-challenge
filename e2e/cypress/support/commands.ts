/// <reference types="cypress" />
// ***********************************************

Cypress.Commands.add('findByTestId', (value) => {
  return cy.get(`[data-testid="${value}"]`);
});
