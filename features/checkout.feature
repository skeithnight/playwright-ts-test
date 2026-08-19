Feature: E2E Checkout Flow

  Background:
    Given the user is on the Sauce Demo login page
    When the user logs in with username "standard_user" and password "secret_sauce"
    Then the user should be redirected to the inventory page

  Scenario: Successful checkout of a single product
    When the user adds "Sauce Labs Backpack" to the cart
    And the user navigates to the cart page
    Then the cart should contain "Sauce Labs Backpack" with quantity 1
    
    When the user proceeds to checkout
    And the user fills customer information with:
      | firstName | lastName | postalCode |
      | Dwiki     | Nugraha  | 12345      |
    Then the order overview should show matching subtotal and tax
    
    When the user confirms the order
    Then the confirmation header should say "Thank you for your order!"
    And the shopping cart badge should be empty

  Scenario: Accurate total calculation for multiple products
    When the user adds "Sauce Labs Backpack" to the cart
    And the user adds "Sauce Labs Bike Light" to the cart
    And the user adds "Sauce Labs Fleece Jacket" to the cart
    Then the shopping cart badge should show "3"
    
    When the user navigates to the cart page
    Then the cart should contain 3 items
    
    When the user proceeds to checkout
    And the user fills customer information with:
      | firstName | lastName | postalCode |
      | Jane      | Doe      | 90210      |
    Then the order overview should show matching subtotal and tax
    
    When the user confirms the order
    Then the confirmation header should say "Thank you for your order!"
