Feature: Authentication and Access Control

  Background:
    Given the user is on the Sauce Demo login page

  Scenario: Successful login with valid standard user
    When the user logs in with username "standard_user" and password "secret_sauce"
    Then the user should be redirected to the inventory page
    And the application logo should display "Swag Labs"

  Scenario: Locked-out user cannot log in
    When the user logs in with username "locked_out_user" and password "secret_sauce"
    Then an error message should be displayed saying "Epic sadface: Sorry, this user has been locked out."

  Scenario: Invalid credentials display error
    When the user logs in with username "invalid_user" and password "wrong_password"
    Then an error message should be displayed saying "Epic sadface: Username and password do not match any user in this service"

  Scenario: Blank username displays required error
    When the user submits an empty login form
    Then an error message should be displayed saying "Epic sadface: Username is required"

  Scenario: User can log out via sidebar menu
    When the user logs in with username "standard_user" and password "secret_sauce"
    And the user logs out from the sidebar menu
    Then the user should be back on the login page
