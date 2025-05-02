// https://on.cypress.io/api

describe('My First Test', () => {
  it('visits the app root url', () => {
    cy.visit('/')
    cy.contains('h1', 'You did it!')
  })

  it('should display the login form', () => {
    cy.visit('/login')
    cy.get('form').should('be.visible')
    cy.get('input[name="username"]').should('exist')
    cy.get('input[name="password"]').should('exist')
  })
})
