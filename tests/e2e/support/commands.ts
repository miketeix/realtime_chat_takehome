/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to send a message in the chat
       * @example cy.sendMessage('Hello, how are you?')
       */
      sendMessage(message: string): Chainable<void>
      
      /**
       * Custom command to verify a message exists in the chat
       * @example cy.verifyMessage('Hello, how are you?')
       */
      verifyMessage(message: string): Chainable<void>
    }
  }
}

Cypress.Commands.add('sendMessage', {
  prevSubject: true,
}, ($container, message: string) => {
  
  cy.wrap($container).find('[data-testid="message-input"]').type(message).then(() => {
    cy.wrap($container).find('[data-testid="send-button"]').click();
  })
  
})

// Cypress.Commands.add('sendMessage', (container: JQuery<HTMLElement>, message: string) => {
  //   const studd = cy.get('[data-testid="message-input"]');
  //   // .type(message)
  //   cy.get('[data-testid="send-button"]').click()
  // })
  
  Cypress.Commands.add('verifyMessage', {
    prevSubject: true,
  }, ($container, message: string, ownMessage: boolean = false) => {
      cy.wrap($container).find('[data-testid="message-list"]').find('[data-testid="message-bubble"]').last()
        .should('contain', message)
        .should('have.class', ownMessage ? 'message-outgoing' :'message-incoming');
}) 

//   Cypress.Commands.add('verifyMessage', ($container, message: string, ownMessage: boolean = false) => {
//   const messageList = cy.get('[data-testid="message-list"]');
//   messageList.should('contain', message);
//   // messageList.find('[data-testid="message-bubble"]').should('have.class', ownMessage ? 'message-outgoing' :'message-incoming');

// }) 