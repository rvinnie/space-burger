/// <reference types="cypress" />

const SELECTORS = {
  INGREDIENT_BUN: '[data-cy=ingredient-item-bun]',
  INGREDIENT_MAIN: '[data-cy=ingredient-item-main]',
  CONSTRUCTOR: '[data-cy=burger-constructor]',
  INGREDIENT_DETAILS: '[data-cy=ingredient-details]',
  CLOSE_MODAL: '[data-cy=close-modal-button]',
  ORDER_BUTTON: '[data-cy=order-button]',
  ORDER_MODAL: '[data-cy=order-modal]'
}

describe('home page', () => {
  beforeEach(() => {
    cy.intercept("GET", "api/ingredients", { fixture: "ingredients" })
    cy.intercept("GET", "api/auth/user", { fixture: "user" })

    window.localStorage.setItem(
      "refreshToken",
      JSON.stringify("test-refreshToken")
    )

    window.localStorage.setItem(
      "accessToken",
      JSON.stringify("test-accessToken")
    )

    cy.visit('/')
  })

  it('should drag-n-drop', () => {
    cy.get(SELECTORS.INGREDIENT_BUN).as('bun')
    cy.get(SELECTORS.INGREDIENT_MAIN).as('main')
    cy.get(SELECTORS.CONSTRUCTOR).as('constructor')
    cy.get('@constructor').should('contain', 'Выберите и перетащите булку');
    cy.get('@constructor').should('contain', 'Выберите и перетащите ингредиенты');

    cy.get('@bun').trigger('dragstart')
    cy.get('@constructor').trigger('drop')

    cy.get('@constructor')
      .should('not.contain', 'Выберите и перетащите булку')
      .and('contain', 'Краторная булка');

    cy.get('@main').trigger('dragstart')
    cy.get('@constructor').trigger('drop')

    cy.get('@constructor')
      .should('not.contain', 'Выберите и перетащите ингредиенты')
      .and('contain', 'Биокотлета из марсианской Магнолии');
  })

  it('should open ingredient details modal and correct data exists', () => {
    cy.get(SELECTORS.INGREDIENT_MAIN).first().click()

    cy.get(SELECTORS.INGREDIENT_DETAILS).then(($modal) => {
      const modalText = $modal.text()
      
      expect(modalText).to.include('1')
      expect(modalText).to.include('2')
      expect(modalText).to.include('3')
      expect(modalText).to.include('4')
    })

    cy.get(SELECTORS.CLOSE_MODAL).as('close-modal-button')
    cy.get('@close-modal-button').should('exist')
    cy.get('@close-modal-button').click()
    cy.get('@close-modal-button').should('not.exist')
  })

  it('should open order modal and correct data exists', () => {
    cy.get(SELECTORS.INGREDIENT_BUN).as('bun')
    cy.get(SELECTORS.INGREDIENT_MAIN).as('main')
    cy.get(SELECTORS.CONSTRUCTOR).as('constructor')

    cy.get('@bun').trigger('dragstart')
    cy.get('@constructor').trigger('drop')

    cy.get('@main').trigger('dragstart')
    cy.get('@constructor').trigger('drop')

    cy.intercept("POST", "api/orders", { fixture: "orders" })

    cy.get(SELECTORS.ORDER_BUTTON).as('order-button')
    cy.get('@order-button').should('exist')
    cy.get('@order-button').click()

    cy.get(SELECTORS.ORDER_MODAL).then(($modal) => {
      const modalText = $modal.text()
      
      expect(modalText).to.include('95711')
    })

    cy.get(SELECTORS.CLOSE_MODAL).as('close-modal-button')
    cy.get('@close-modal-button').should('exist')
    cy.get('@close-modal-button').click()
    cy.get('@close-modal-button').should('not.exist')
  })
});
