Feature: Checkout Form Validations

  Background:
    Given the user is on the Sauce Demo login page
    And the user logs in with username "standard_user" and password "secret_sauce"
    And the user adds "Sauce Labs Backpack" to the cart
    And the user navigates to the cart page
    And the user proceeds to checkout

  Scenario: First Name is required
    When the user fills customer information with:
      | firstName | lastName | postalCode |
      |           | Doe      | 12345      |
    Then a form error message should be displayed saying "Error: First Name is required"

  Scenario: Last Name is required
    When the user fills customer information with:
      | firstName | lastName | postalCode |
      | John      |          | 12345      |
    Then a form error message should be displayed saying "Error: Last Name is required"

  Scenario: Postal Code is required
    When the user fills customer information with:
      | firstName | lastName | postalCode |
      | John      | Doe      |            |
    Then a form error message should be displayed saying "Error: Postal Code is required"
