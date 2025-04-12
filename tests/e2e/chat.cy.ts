describe('Chat Application', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.wait(2000);
  })

  it('should display two chat containers', () => {
    cy.get('[data-testid="chat-container"]').should('have.length', 2)
  })

  it('should allow sending and receiving messages between users', () => {
    const containerSelector = '[data-testid="chat-container"]';
    const helloFromPrimary = 'Hello from primary user!';
    const helloFromSecondary = 'Hello from secondary user!';
    // Send message from primary user
    cy.get(containerSelector).last().sendMessage(helloFromPrimary)
    cy.get(containerSelector).last().verifyMessage(helloFromPrimary, true)
    cy.wait(1000)

    // Verify message appears in secondary user's chat
    cy.get(containerSelector).first().verifyMessage(helloFromPrimary)
    cy.wait(1000)

    // // Send message from secondary user
    cy.get(containerSelector).first().sendMessage(helloFromSecondary)
    cy.get(containerSelector).first().verifyMessage(helloFromSecondary, true)
    cy.wait(1000)

    // Verify message appears in primary user's chat
    cy.get(containerSelector).last().verifyMessage(helloFromSecondary)
    cy.wait(1000)
    
  })

  it('should maintain message history after page refresh', () => {
    const containerSelector = '[data-testid="chat-container"]';
    const persistentMessage = 'This message should persist';
    // Send initial message
    cy.get(containerSelector).first().sendMessage(persistentMessage)
    cy.wait(1000)
    
    // Refresh the page
    cy.reload()

    cy.wait(1000)
    // Verify message still exists
    cy.get(containerSelector).first().verifyMessage(persistentMessage, true)
  })
}) 