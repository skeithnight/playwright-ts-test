Feature: Demonstration of Test Failure Artifacts

  @demo-failure
  Scenario: Intentional assertion failure to demonstrate screenshot, video and trace capture
    Given the user is on the Sauce Demo login page
    When the user logs in with username "standard_user" and password "secret_sauce"
    Then the user should be redirected to the inventory page
    And the application logo should display "Non-Existent Incorrect Logo"
