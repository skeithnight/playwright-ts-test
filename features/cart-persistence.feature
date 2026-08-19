Feature: Cart Operations and State Persistence

  Background:
    Given the user is on the Sauce Demo login page
    When the user logs in with username "standard_user" and password "secret_sauce"

  Scenario: Remove an item directly from the cart page
    When the user adds "Sauce Labs Backpack" to the cart
    And the user adds "Sauce Labs Bike Light" to the cart
    Then the shopping cart badge should show "2"
    
    When the user navigates to the cart page
    Then the cart should contain 2 items
    
    When the user removes "Sauce Labs Backpack" from the cart
    Then the cart should contain 1 items
    And the shopping cart badge should show "1"

  Scenario: Preserve cart contents when clicking Continue Shopping
    When the user adds "Sauce Labs Bolt T-Shirt" to the cart
    And the user navigates to the cart page
    
    When the user clicks Continue Shopping
    Then the user should be redirected to the inventory page
    And the shopping cart badge should show "1"
    
    When the user adds "Sauce Labs Onesie" to the cart
    Then the shopping cart badge should show "2"
    
    When the user navigates to the cart page
    Then the cart should contain 2 items
